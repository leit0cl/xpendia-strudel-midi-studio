// Inicializamos Strudel SIN pasar por @strudel/web (cuyo bundle pre-inlinea
// @strudel/core y dispara "loaded more than once"). Importamos cada sub-paquete
// directamente para que Vite los una en un único grafo de módulos.
import { Pattern, evalScope, setTime } from '@strudel/core';
import {
  initAudioOnFirstClick,
  registerSynthSounds,
  webaudioRepl,
} from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { miniAllStrings } from '@strudel/mini';
import {
  samples as sdSamples,
  getAudioContext as sdGetAudioContext,
  getSuperdoughAudioController,
  registerZZFXSounds,
} from 'superdough';
import { getMasterFxState } from '../fx/MasterFx';
import { wrapCode } from '../fx/wrapCode';
import { registerDrumAliases } from './drumAliases';

type Hap = {
  whole?: { begin: number; end: number };
  part?: { begin: number; end: number };
  value: { s?: string; note?: string | number; n?: number; gain?: number };
  context: { locations?: Array<{ start: number; end: number }> };
};

type TriggerHandler = (info: {
  time: number;
  currentTime: number;
  hap: Hap;
  cps: number;
}) => void;

let bootPromise: Promise<any> | null = null;
let repl: any = null;
const handlers = new Set<TriggerHandler>();
const loadedPacks = new Set<string>();
let lastCode: string | null = null;
let reevalTimer: ReturnType<typeof setTimeout> | null = null;

async function bootInner() {
  initAudioOnFirstClick();
  miniAllStrings();
  repl = webaudioRepl({ transpiler });
  setTime(() => repl.scheduler.now());

  // patch para que `.play()` sobre cualquier Pattern reproduzca via nuestro repl
  (Pattern.prototype as any).play = function (this: any) {
    repl.setPattern(this, true);
    return this;
  };

  // Strudel docs use visual-effect methods like `_pianoroll()`, `_punchcard()`,
  // `_spiral()`, `_pitchwheel()`, etc. These come from @strudel/draw and draw
  // on a host canvas — we don't have that canvas; we have our own PianoRoll /
  // Spectrum / Oscilloscope. Register pass-throughs so user code copied from
  // docs doesn't crash with "is not a function".
  const drawMethods = [
    'pianoroll', '_pianoroll',
    'punchcard', '_punchcard',
    'wordfall', '_wordfall',
    'spiral', '_spiral',
    'pitchwheel', '_pitchwheel',
    'draw', '_draw',
    'onPaint', '_onPaint',
    'animate', '_animate',
    'scope', '_scope',
  ];
  for (const m of drawMethods) {
    if ((Pattern.prototype as any)[m]) continue;
    (Pattern.prototype as any)[m] = function (this: any) {
      return this;
    };
  }

  // hook de trigger común para highlight / pianoroll
  repl.scheduler.onTrigger = (time: number, hap: Hap, currentTime: number, cps: number) => {
    for (const cb of handlers) cb({ time, hap, currentTime, cps });
  };

  // defaultPrebake equivalente
  const loadModules = evalScope(
    evalScope,
    import('@strudel/core'),
    import('@strudel/mini'),
    import('@strudel/tonal'),
    import('@strudel/webaudio'),
    { hush, evaluate },
  );

  const cdn = 'https://strudel.b-cdn.net';
  const defaultPacks: Array<[string, string?]> = [
    ['github:tidalcycles/dirt-samples'],
    [`${cdn}/tidal-drum-machines.json`, `${cdn}/tidal-drum-machines/machines/`],
    [`${cdn}/piano.json`, `${cdn}/piano/`],
    [`${cdn}/vcsl.json`, `${cdn}/VCSL/`],
    [`${cdn}/uzu-drumkit.json`, `${cdn}/uzu-drumkit/`],
    [`${cdn}/uzu-wavetables.json`, `${cdn}/uzu-wavetables/`],
    [`${cdn}/mridangam.json`, `${cdn}/mrid/`],
  ];
  await Promise.all([
    loadModules,
    registerSynthSounds(),
    Promise.resolve().then(() => registerZZFXSounds()),
    import('@strudel/soundfonts').then((m) => m.registerSoundfonts()),
    import('@strudel/midi').catch(() => null),
    ...defaultPacks.map(async ([src, base]) => {
      await sdSamples(src, base);
      loadedPacks.add(src);
    }),
  ]);

  // Register short drum-machine aliases (linn_bd, dmx_oh, tr808_sd, …) on
  // top of the just-loaded tidal-drum-machines pack so flat names from
  // Strudel examples resolve out of the box.
  registerDrumAliases().catch(() => {
    /* non-fatal — aliases are a convenience layer */
  });

  return repl;
}

export function boot() {
  if (!bootPromise) bootPromise = bootInner();
  return bootPromise;
}

export async function play(code: string) {
  await boot();
  lastCode = code;
  return repl.evaluate(wrapCode(code, getMasterFxState()), true);
}

export async function stop() {
  await boot();
  // Cancel any pending reeval so a stale FX-knob change doesn't restart it.
  if (reevalTimer) {
    clearTimeout(reevalTimer);
    reevalTimer = null;
  }
  // Replace the active pattern with silence — kills future trigger events
  // including ones the scheduler had already queued.
  try {
    repl.evaluate('silence', true);
  } catch {
    /* swallow — fall through to scheduler.stop() */
  }
  // Hard-mute reverb / delay tails by ramping destinationGain to 0 for ~120ms
  // then restoring. Without this, long room/delay knobs keep ringing after stop.
  try {
    const ac = sdGetAudioContext() as AudioContext;
    const controller = getSuperdoughAudioController() as {
      output: { destinationGain: GainNode };
    };
    const g = controller.output.destinationGain.gain;
    const now = ac.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + 0.05);
    g.linearRampToValueAtTime(1, now + 0.18);
  } catch {
    /* non-fatal */
  }
  return repl.stop();
}

export async function evaluate(code: string, autoplay = true) {
  await boot();
  lastCode = code;
  return repl.evaluate(wrapCode(code, getMasterFxState()), autoplay);
}

export function hush() {
  if (repl) repl.stop();
}

// Re-evaluate the last code with the current master FX state. Debounced so
// dragging a knob doesn't saturate the evaluator. No-op if nothing has played.
export function triggerReeval(delayMs = 120) {
  if (lastCode == null) return;
  if (reevalTimer) clearTimeout(reevalTimer);
  reevalTimer = setTimeout(() => {
    reevalTimer = null;
    if (!repl || lastCode == null) return;
    try {
      repl.evaluate(wrapCode(lastCode, getMasterFxState()), true);
    } catch {
      /* swallow — knob changes shouldn't break the user */
    }
  }, delayMs);
}

export function onTrigger(cb: TriggerHandler): () => void {
  handlers.add(cb);
  return () => handlers.delete(cb);
}

// Carga un sample pack adicional (idempotente). Devuelve true si lo cargó.
export async function ensurePack(shortcut: string): Promise<boolean> {
  if (loadedPacks.has(shortcut)) return false;
  await boot();
  await sdSamples(shortcut);
  loadedPacks.add(shortcut);
  return true;
}

export function isPackLoaded(shortcut: string): boolean {
  return loadedPacks.has(shortcut);
}

export function getLoadedPacks(): string[] {
  return Array.from(loadedPacks);
}

// Devuelve un MediaStream con el audio de Strudel para grabar/exportar.
// Tap directo sobre destinationGain (justo antes de audioContext.destination)
// para no romper el playback en speakers.
export async function getOutputStream(): Promise<MediaStream> {
  await boot();
  const ac = sdGetAudioContext() as AudioContext;
  const controller = getSuperdoughAudioController() as {
    output: { destinationGain: AudioNode };
  };
  const out = controller.output.destinationGain;
  const streamDest = ac.createMediaStreamDestination();
  out.connect(streamDest);
  return streamDest.stream;
}

export function getAudioContext(): AudioContext {
  return sdGetAudioContext() as AudioContext;
}
