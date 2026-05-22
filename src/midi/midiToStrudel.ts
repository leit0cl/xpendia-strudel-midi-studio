/**
 * Port of github.com/Emanuel-de-Jong/MIDI-To-Strudel (main.js)
 * GPL-3.0 — original by Emanuel de Jong.
 * Converts a MIDI ArrayBuffer into Strudel code.
 */
import { Midi } from '@tonejs/midi';

export interface MidiConvertOpts {
  /** Maximum number of cycles (bars) to emit. 0 = no limit. */
  barLimit: number;
  /** Subdivisions per bar — 16, 32, 64… */
  notesPerBar: number;
  /** Spaces used for indentation in the output. */
  tabSize: number;
  /** Try to map the MIDI program number to a matching Strudel sound. */
  guessInstrument: boolean;
  /** If true, emit each cycle as a flat `[n1 n2 …]` sequence (no rests). */
  flatSequences: boolean;
  /** If true, fold the whole pattern onto one line per track. */
  smallPrint: boolean;
}

export const DEFAULT_OPTS: MidiConvertOpts = {
  barLimit: 0,
  notesPerBar: 64,
  tabSize: 2,
  guessInstrument: true,
  flatSequences: false,
  smallPrint: false,
};

const NOTE_NAMES = [
  'c', 'c#', 'd', 'd#', 'e', 'f', 'f#',
  'g', 'g#', 'a', 'a#', 'b',
];

const STRUDEL_SOUNDS = new Set<string>([
  'agogo','balafon','balafon_hard','balafon_soft','ballwhistle','belltree',
  'bongo','bytebeat','cabasa','cajon','casio','clash','clash2','clave',
  'clavisynth','conga','cowbell','dantranh','dantranh_tremolo',
  'dantranh_vibrato','darbuka','didgeridoo','fingercymbal','flexatone',
  'fmpiano','folkharp','framedrum','glockenspiel','gm_accordion',
  'gm_acoustic_bass','gm_acoustic_guitar_nylon','gm_acoustic_guitar_steel',
  'gm_agogo','gm_alto_sax','gm_applause','gm_bagpipe','gm_bandoneon',
  'gm_banjo','gm_baritone_sax','gm_bassoon','gm_bird_tweet',
  'gm_blown_bottle','gm_brass_section','gm_breath_noise','gm_celesta',
  'gm_cello','gm_choir_aahs','gm_church_organ','gm_clarinet','gm_clavinet',
  'gm_contrabass','gm_distortion_guitar','gm_drawbar_organ','gm_dulcimer',
  'gm_electric_bass_finger','gm_electric_bass_pick','gm_electric_guitar_clean',
  'gm_electric_guitar_jazz','gm_electric_guitar_muted','gm_english_horn',
  'gm_epiano1','gm_epiano2','gm_fiddle','gm_flute','gm_french_horn',
  'gm_fretless_bass','gm_fx_atmosphere','gm_fx_brightness','gm_fx_crystal',
  'gm_fx_echoes','gm_fx_goblins','gm_fx_rain','gm_fx_sci_fi',
  'gm_fx_soundtrack','gm_glockenspiel','gm_guitar_fret_noise',
  'gm_guitar_harmonics','gm_gunshot','gm_harmonica','gm_harpsichord',
  'gm_helicopter','gm_kalimba','gm_koto','gm_lead_1_square',
  'gm_lead_2_sawtooth','gm_lead_3_calliope','gm_lead_4_chiff',
  'gm_lead_5_charang','gm_lead_6_voice','gm_lead_7_fifths',
  'gm_lead_8_bass_lead','gm_marimba','gm_melodic_tom','gm_music_box',
  'gm_muted_trumpet','gm_oboe','gm_ocarina','gm_orchestra_hit',
  'gm_orchestral_harp','gm_overdriven_guitar','gm_pad_bowed',
  'gm_pad_choir','gm_pad_halo','gm_pad_metallic','gm_pad_new_age',
  'gm_pad_poly','gm_pad_sweep','gm_pad_warm','gm_pan_flute',
  'gm_percussive_organ','gm_piano','gm_piccolo','gm_pizzicato_strings',
  'gm_recorder','gm_reed_organ','gm_reverse_cymbal','gm_rock_organ',
  'gm_seashore','gm_shakuhachi','gm_shamisen','gm_shanai','gm_sitar',
  'gm_slap_bass_1','gm_slap_bass_2','gm_soprano_sax','gm_steel_drums',
  'gm_string_ensemble_1','gm_string_ensemble_2','gm_synth_bass_1',
  'gm_synth_bass_2','gm_synth_brass_1','gm_synth_brass_2','gm_synth_choir',
  'gm_synth_drum','gm_synth_strings_1','gm_synth_strings_2',
  'gm_taiko_drum','gm_telephone','gm_tenor_sax','gm_timpani',
  'gm_tinkle_bell','gm_tremolo_strings','gm_trombone','gm_trumpet',
  'gm_tuba','gm_tubular_bells','gm_vibraphone','gm_viola','gm_violin',
  'gm_voice_oohs','gm_whistle','gm_woodblock','gm_xylophone',
  'gong','gong2','guiro','handbells','handchimes','harmonica',
  'harmonica_soft','harmonica_vib','harp','kalimba','kalimba2','kalimba3',
  'kalimba4','kalimba5','kawai','korgkrz_fx','krz_fx','marimba',
  'marktrees','mc303_fx','mridangam_ardha','mridangam_chaapu',
  'mridangam_dhi','mridangam_dhin','mridangam_dhum','mridangam_gumki',
  'mridangam_ka','mridangam_ki','mridangam_na','mridangam_nam',
  'mridangam_ta','mridangam_tha','mridangam_thom','ocarina',
  'ocarina_small','ocarina_small_stacc','ocarina_vib','oceandrum',
  'organ_4inch','organ_8inch','organ_full','piano','piano1',
  'pipeorgan_loud','pipeorgan_loud_pedal','pipeorgan_quiet',
  'pipeorgan_quiet_pedal','psaltery_bow','psaltery_pluck',
  'psaltery_spiccato','pulse','recorder_alto_stacc','recorder_alto_sus',
  'recorder_alto_vib','recorder_bass_stacc','recorder_bass_sus',
  'recorder_bass_vib','recorder_soprano_stacc','recorder_soprano_sus',
  'recorder_tenor_stacc','recorder_tenor_sus','recorder_tenor_vib',
  'rolandmc303_fx','rx5_fx','saw','sawtooth','sax','sax_stacc','sax_vib',
  'saxello','saxello_stacc','saxello_vib','shaker_large','shaker_small',
  'sin','sine','sleighbells','slitdrum','sqr','square','steinway',
  'strumstick','super64','super64_acc','super64_vib','supersaw',
  'tambourine','tambourine2','tg33_fx','timpani','timpani_roll','timpani2',
  'tri','triangle','triangles','tubularbells','tubularbells2',
  'vibraphone','vibraphone_bowed','vibraphone_soft','vibraslap',
  'woodblock','wt_digital','wt_digital_bad_day','wt_digital_basique',
  'wt_digital_crickets','wt_digital_curses','wt_digital_echoes',
  'wt_vgame','xylophone_hard_ff','xylophone_hard_pp',
  'xylophone_medium_ff','xylophone_medium_pp','xylophone_soft_ff',
  'xylophone_soft_pp','yamaharx5_fx','yamahatg33_fx','z_sawtooth',
  'z_sine','z_square','z_tan','z_triangle','zzfx',
]);

const MIDI_SOUNDS: string[] = [
  'gm_piano','gm_piano','gm_epiano1','gm_piano','gm_epiano1','gm_epiano2','gm_harpsichord','gm_clavinet',
  'gm_celesta','gm_glockenspiel','gm_music_box','gm_vibraphone','gm_marimba','gm_xylophone','gm_tubular_bells','gm_dulcimer',
  'gm_drawbar_organ','gm_percussive_organ','gm_rock_organ','gm_church_organ','gm_reed_organ','gm_accordion','gm_harmonica','gm_bandoneon',
  'gm_acoustic_guitar_nylon','gm_acoustic_guitar_steel','gm_electric_guitar_jazz','gm_electric_guitar_clean',
  'gm_electric_guitar_muted','gm_overdriven_guitar','gm_distortion_guitar','gm_guitar_harmonics',
  'gm_acoustic_bass','gm_electric_bass_finger','gm_electric_bass_pick','gm_fretless_bass',
  'gm_slap_bass_1','gm_slap_bass_2','gm_synth_bass_1','gm_synth_bass_2',
  'gm_violin','gm_viola','gm_cello','gm_contrabass',
  'gm_tremolo_strings','gm_pizzicato_strings','gm_orchestral_harp','gm_timpani',
  'gm_string_ensemble_1','gm_string_ensemble_2','gm_synth_strings_1','gm_synth_strings_2',
  'gm_choir_aahs','gm_voice_oohs','gm_synth_choir','gm_orchestra_hit',
  'gm_trumpet','gm_trombone','gm_tuba','gm_muted_trumpet',
  'gm_french_horn','gm_brass_section','gm_synth_brass_1','gm_synth_brass_2',
  'gm_soprano_sax','gm_alto_sax','gm_tenor_sax','gm_baritone_sax',
  'gm_oboe','gm_english_horn','gm_bassoon','gm_clarinet',
  'gm_piccolo','gm_flute','gm_recorder','gm_pan_flute',
  'gm_blown_bottle','gm_shakuhachi','gm_whistle','gm_ocarina',
  'gm_lead_1_square','gm_lead_2_sawtooth','gm_lead_3_calliope','gm_lead_4_chiff',
  'gm_lead_5_charang','gm_lead_6_voice','gm_lead_7_fifths','gm_lead_8_bass_lead',
  'gm_pad_new_age','gm_pad_warm','gm_pad_poly','gm_pad_choir',
  'gm_pad_bowed','gm_pad_metallic','gm_pad_halo','gm_pad_sweep',
  'gm_fx_rain','gm_fx_soundtrack','gm_fx_crystal','gm_fx_atmosphere',
  'gm_fx_brightness','gm_fx_goblins','gm_fx_echoes','gm_fx_sci_fi',
  'gm_sitar','gm_banjo','gm_shamisen','gm_koto',
  'gm_kalimba','gm_shanai','gm_fiddle','gm_shanai',
  'gm_tinkle_bell','gm_agogo','gm_steel_drums','gm_woodblock',
  'gm_taiko_drum','gm_melodic_tom','gm_synth_drum','gm_reverse_cymbal',
  'gm_guitar_fret_noise','gm_breath_noise','gm_fx_rain','gm_fx_brightness',
  'gm_fx_echoes','gm_fx_echoes','gm_fx_echoes','gm_fx_echoes',
];

const SOUND_IMPROVEMENT_MAPS: Record<string, string> = {
  gm_lead_1_square: 'square',
  gm_lead_2_sawtooth: 'saw',
};

const SOUND_FALLBACK = 'piano';

interface TrackLike {
  instrument?: { number?: number };
}

function getSoundName(track: TrackLike): string {
  if (!track.instrument) return SOUND_FALLBACK;
  const programNumber = track.instrument.number;
  if (
    typeof programNumber !== 'number' ||
    programNumber < 0 ||
    programNumber > MIDI_SOUNDS.length - 1
  ) {
    return SOUND_FALLBACK;
  }
  const soundName = MIDI_SOUNDS[programNumber];
  if (soundName in SOUND_IMPROVEMENT_MAPS) return SOUND_IMPROVEMENT_MAPS[soundName];
  if (STRUDEL_SOUNDS.has(soundName.replace('gm_', ''))) {
    return soundName.replace('gm_', '');
  }
  if (STRUDEL_SOUNDS.has(soundName)) return soundName;
  return SOUND_FALLBACK;
}

function noteNumToStr(n: number): string {
  return NOTE_NAMES[n % 12] + (Math.floor(n / 12) - 1);
}

/**
 * Most @strudel/soundfonts presets cover MIDI ~36..84 (C2..C6). Notes outside
 * that window fail with "no soundfont zone found for preset". We octave-shift
 * any out-of-range pitch back into the safe window — keeps melodies in the
 * same pitch class without dropping notes.
 */
function clampToSoundfontRange(midi: number, lo = 36, hi = 84): number {
  while (midi < lo) midi += 12;
  while (midi > hi) midi -= 12;
  return midi;
}

function quantizeTime(
  t: number,
  cycleStart: number,
  cycleLen: number,
  notesPerBar: number,
): number {
  const rel = (t - cycleStart) / cycleLen;
  const q = Math.round(rel * notesPerBar) / notesPerBar;
  return Math.min(q, 1 - 1e-9);
}

/**
 * GM drum note → Strudel sample name. Channel 10 (index 9) notes are routed
 * through this so a kick is `bd`, not `c2`.
 */
const DRUM_MAP: Record<number, string> = {
  35: 'bd', 36: 'bd',
  37: 'rim',
  38: 'sd', 40: 'sd',
  39: 'cp',
  41: 'lt', 43: 'lt',
  42: 'hh', 44: 'hh',
  45: 'mt', 47: 'mt',
  46: 'oh',
  48: 'ht', 50: 'ht',
  49: 'cr', 52: 'cr', 55: 'cr', 57: 'cr',
  51: 'rd', 53: 'rd', 59: 'rd',
  54: 'tb',
  56: 'cb',
  58: 'cl',
  60: 'bongo', 61: 'bongo',
  62: 'conga', 63: 'conga', 64: 'conga',
  65: 'timbale', 66: 'timbale',
  70: 'maracas',
  75: 'claves',
};

function drumName(midiNote: number): string {
  return DRUM_MAP[midiNote] ?? 'perc';
}

/**
 * Some drum tokens we emit (perc, tb, cb, cl, bongo, conga, timbale, maracas,
 * claves) don't exist in every tidal-drum-machines bank. This map remaps any
 * token to one that DOES exist in the target bank, so `.bank("RolandTR808")`
 * never trips a "not found" error.
 */
const BANK_AVAILABLE: Record<string, Set<string>> = {
  RolandTR808: new Set(['bd', 'cb', 'cp', 'cr', 'hh', 'ht', 'lt', 'mt', 'oh', 'perc', 'rim', 'sd', 'sh']),
  RolandTR909: new Set(['bd', 'cp', 'cr', 'hh', 'ht', 'lt', 'mt', 'oh', 'rd', 'rim', 'sd']),
  LinnLM1: new Set(['bd', 'cb', 'cp', 'hh', 'ht', 'lt', 'oh', 'perc', 'rim', 'sd', 'sh', 'tb']),
  AkaiMPC60: new Set(['bd', 'cp', 'cr', 'hh', 'ht', 'lt', 'misc', 'mt', 'oh', 'perc', 'rd', 'rim', 'sd']),
};

/** Closest in-bank fallback for any unknown token. */
const TOKEN_FALLBACK: Record<string, string> = {
  rd: 'cr',     // ride → crash
  tb: 'sh',     // tambourine → shaker
  cb: 'perc',   // cowbell → perc (in banks without cb)
  cl: 'rim',    // claves → rim
  bongo: 'perc',
  conga: 'perc',
  timbale: 'perc',
  maracas: 'sh',
  claves: 'rim',
  perc: 'rim',  // last-resort perc → rim (always exists)
  sh: 'hh',     // shaker → hihat
};

function resolveTokenForBank(token: string, bank: string): string {
  const set = BANK_AVAILABLE[bank];
  if (!set || set.has(token)) return token;
  // Walk fallbacks until we land on something the bank has.
  let cur = token;
  for (let i = 0; i < 4 && !set.has(cur); i++) {
    const next = TOKEN_FALLBACK[cur];
    if (!next) break;
    cur = next;
  }
  return set.has(cur) ? cur : 'bd'; // bd is universally present
}

/**
 * Pick the smallest subdivision (4, 8, 12, 16, 24, 32, 48, 64…) that fits all
 * event positions of a bar within a tight tolerance. Lets a bar with only
 * quarter notes emit `[a b c d]` (4) instead of a 64-step monster.
 */
/**
 * Collapse runs of 3+ identical adjacent bars into Strudel's `bar!N` repeat
 * shorthand. Keeps runs of 1-2 unrolled for readability.
 *   ["a","a","a","a","b","-","-"] → ["a!4","b","-","-"]
 */
function compressRepeats(bars: string[]): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < bars.length) {
    let j = i + 1;
    while (j < bars.length && bars[j] === bars[i]) j++;
    const count = j - i;
    if (count >= 3) {
      out.push(`${bars[i]}!${count}`);
    } else {
      for (let k = 0; k < count; k++) out.push(bars[i]);
    }
    i = j;
  }
  return out;
}

/** Median of 0..1 numbers. Used for per-track gain. */
function median(arr: number[]): number {
  if (!arr.length) return 1;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function pickSubdivision(positions: number[], maxSubdiv: number): number {
  if (positions.length === 0) return 1;
  const candidates = [4, 6, 8, 12, 16, 24, 32, 48, 64].filter((s) => s <= maxSubdiv);
  // tolerance: half of the *finest* allowed step, so triplets vs straight
  // sub-grids can both pass.
  const tol = 0.5 / maxSubdiv;
  for (const s of candidates) {
    const ok = positions.every((p) => {
      const grid = Math.round(p * s) / s;
      return Math.abs(p - grid) < tol;
    });
    if (ok) return s;
  }
  return maxSubdiv;
}

function simplifySubdivisions(arr: string[]): string[] {
  let cur = arr;
  while (cur.length % 2 === 0) {
    const ok = cur.every((_, i) => (i % 2 === 1 ? cur[i] === '-' : true));
    if (!ok) break;
    cur = cur.filter((_, i) => i % 2 === 0);
  }
  return cur;
}

interface NoteEvent {
  time: number;
  /** For melodic tracks: a note string like "c#4". For drum tracks: a drum
   *  sample name like "bd" / "sd" / "hh". */
  token: string;
  /** Normalized velocity 0..1 from @tonejs/midi. */
  velocity: number;
  instrument?: { number?: number };
}

interface TrackBundle {
  events: NoteEvent[];
  isDrum: boolean;
}

function collectEvents(midi: Midi): Record<number, TrackBundle> {
  const out: Record<number, TrackBundle> = {};
  midi.tracks.forEach((track, trackIndex) => {
    if (!track.notes.length) return;
    // @tonejs/midi uses 0-indexed channels — GM drums are channel 10 → index 9.
    // Some MIDIs flag tracks as percussion via the instrument family too.
    const isDrum =
      track.channel === 9 ||
      (track.instrument as unknown as { family?: string })?.family === 'drums';
    out[trackIndex] = {
      isDrum,
      events: track.notes.map((note) => ({
        time: note.time,
        token: isDrum
          ? resolveTokenForBank(drumName(note.midi), 'RolandTR808')
          : noteNumToStr(clampToSoundfontRange(note.midi)),
        velocity: typeof note.velocity === 'number' ? note.velocity : 0.8,
        instrument: track.instrument as { number?: number },
      })),
    };
  });
  return out;
}

function adjustLateNotes(events: NoteEvent[], cycleLen: number): NoteEvent[] {
  return events.map((event) => {
    const rel = (event.time % cycleLen) / cycleLen;
    return rel > 0.95
      ? { ...event, time: Math.ceil(event.time / cycleLen) * cycleLen }
      : event;
  });
}

function buildCycleBars(
  events: NoteEvent[],
  track: TrackLike,
  cycleLen: number,
  opts: MidiConvertOpts,
): { bars: string[]; track: TrackLike } {
  const adjustedEvents = adjustLateNotes(events, cycleLen);
  const maxTime = Math.max(...adjustedEvents.map((event) => event.time));
  const numCycles =
    opts.barLimit > 0
      ? Math.min(Math.floor(maxTime / cycleLen) + 1, opts.barLimit)
      : Math.floor(maxTime / cycleLen) + 1;

  const bars: string[] = [];

  for (let cycleIndex = 0; cycleIndex < numCycles; cycleIndex++) {
    const start = cycleIndex * cycleLen;
    const end = start + cycleLen;
    const eventsInCycle = adjustedEvents.filter(
      (event) => event.time >= start && event.time < end,
    );

    if (!eventsInCycle.length) {
      bars.push('-');
      continue;
    }

    if (opts.flatSequences) {
      const tokens = eventsInCycle.map((event) => event.token);
      bars.push(tokens.length === 1 ? tokens[0] : `[${tokens.join(' ')}]`);
      continue;
    }

    // Pick the smallest grid that captures this bar cleanly.
    const positions = eventsInCycle.map((ev) => (ev.time - start) / cycleLen);
    const subdivCount = pickSubdivision(positions, opts.notesPerBar);

    const groups: Record<string, string[]> = {};
    eventsInCycle.forEach((event) => {
      const pos = quantizeTime(event.time, start, cycleLen, subdivCount);
      const key = String(Math.round(pos * subdivCount) / subdivCount);
      (groups[key] || (groups[key] = [])).push(event.token);
    });

    const subdiv: string[] = Array(subdivCount).fill('-');
    Object.keys(groups)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .forEach((key) => {
        const index = Math.round(parseFloat(key) * subdivCount);
        if (index < subdivCount) {
          const group = groups[key];
          subdiv[index] =
            group.length === 1 ? group[0] : `[${group.join(',')}]`;
        }
      });

    const simplified = simplifySubdivisions(subdiv);
    const bar =
      simplified.length === 1 ? simplified[0] : `[${simplified.join(' ')}]`;
    bars.push(
      bar === '[' + Array(subdivCount).fill('-').join(' ') + ']' ? '-' : bar,
    );
  }

  return { bars, track };
}

interface BuiltTrack {
  bars: string[];
  track: TrackLike;
  isDrum: boolean;
  /** Per-track gain derived from the median note velocity. 1 = neutral. */
  gain: number;
}

function buildTracks(
  bundles: Record<number, TrackBundle>,
  midi: Midi,
  cycleLen: number,
  opts: MidiConvertOpts,
): BuiltTrack[] {
  const tracks: BuiltTrack[] = [];

  Object.keys(bundles)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((trackIndex) => {
      const bundle = bundles[Number(trackIndex)];
      const track = midi.tracks[Number(trackIndex)] as unknown as TrackLike;
      const trackData = buildCycleBars(bundle.events, track, cycleLen, opts);
      if (trackData.bars.length && trackData.bars.some((bar) => bar !== '-')) {
        // Median velocity (0..1) mapped to a gentle gain curve. Tonejs gives
        // velocity already in 0..1; we clamp into a reasonable 0.4..1.2 range
        // so quiet tracks duck and loud tracks pop without distortion.
        const medVel = median(bundle.events.map((e) => e.velocity));
        const gain = Math.round((0.4 + medVel * 0.8) * 100) / 100;
        tracks.push({ ...trackData, isDrum: bundle.isDrum, gain });
      }
    });

  // Trim global leading/trailing silence so tracks that start late don't drag
  // every other track through dozens of `-` rest bars. We compute the earliest
  // and latest cycle index that has any non-rest content across ALL tracks,
  // then trim every track to that window (preserving relative alignment).
  if (tracks.length > 0) {
    const maxLen = Math.max(...tracks.map((tr) => tr.bars.length));
    let firstNonRest = Infinity;
    let lastNonRest = -1;
    for (const tr of tracks) {
      for (let i = 0; i < tr.bars.length; i++) {
        if (tr.bars[i] !== '-') {
          if (i < firstNonRest) firstNonRest = i;
          if (i > lastNonRest) lastNonRest = i;
        }
      }
    }
    if (firstNonRest !== Infinity && lastNonRest >= 0) {
      // keep 1 leading bar of rest if available (small "breath"); none extra
      // trailing — the song ends with its last hit.
      const start = Math.max(0, firstNonRest - 1);
      const end = Math.min(maxLen, lastNonRest + 1);
      for (const tr of tracks) {
        // pad short tracks to the max so all tracks have a coherent end
        while (tr.bars.length < end) tr.bars.push('-');
        tr.bars = tr.bars.slice(start, end);
      }
    }
  }

  // Compress runs of 3+ identical adjacent bars into `bar!N`.
  for (const tr of tracks) {
    tr.bars = compressRepeats(tr.bars);
  }

  return tracks;
}

function formatStrudelOutput(
  tracks: BuiltTrack[],
  bpm: number,
  opts: MidiConvertOpts,
): string {
  const indent = (n: number) => ' '.repeat(n);

  let longestBarLength = 0;
  tracks.forEach((trackData) => {
    trackData.bars.forEach((bar) => {
      if (bar.length > longestBarLength) longestBarLength = bar.length;
    });
  });

  let barsPerRow = 8;
  if (longestBarLength > 0) {
    const barsFit = Math.floor((160 + 1) / (longestBarLength + 1));
    barsPerRow = Math.max(2, Math.min(8, barsFit));
  }

  const out: string[] = [`setcpm(${Math.round(bpm)}/4)\n`];
  tracks.forEach((trackData) => {
    const bars = trackData.bars;
    const track = trackData.track;
    // Drum tracks use s("...") since their tokens are sample names; melodic
    // tracks use note("...") with the GM-mapped instrument.
    const head = trackData.isDrum ? 's' : 'note';

    if (opts.smallPrint) {
      out.push(`$: ${head}(\`<${bars.join('')}>\`)`);
    } else {
      out.push(`$: ${head}(\`<`);
      for (let i = 0; i < bars.length; i += barsPerRow) {
        const chunk = bars.slice(i, i + barsPerRow).join(' ');
        out.push(`${indent(opts.tabSize * 2)}${chunk}`);
      }
      out[out.length - 1] += '>`)';
    }

    const gainTail =
      Math.abs(trackData.gain - 1) > 0.05
        ? `.gain(${trackData.gain})`
        : '';

    if (trackData.isDrum) {
      // TR-808 has the widest sample roster of the default-loaded banks
      // (includes perc, cb, sh) so most GM drum notes resolve cleanly.
      out.push(`${indent(opts.tabSize)}.bank("RolandTR808")${gainTail}\n`);
    } else {
      let soundName = SOUND_FALLBACK;
      if (opts.guessInstrument) {
        soundName = getSoundName(track);
      }
      out.push(`${indent(opts.tabSize)}.sound("${soundName}")${gainTail}\n`);
    }
  });
  return out.join('\n');
}

/** Convert a MIDI ArrayBuffer into a Strudel code string. */
export function midiToStrudel(
  arrayBuffer: ArrayBuffer,
  opts: MidiConvertOpts = DEFAULT_OPTS,
): string {
  const midi = new Midi(arrayBuffer);
  const bpm = midi.header.tempos.length ? midi.header.tempos[0].bpm : 120;
  const cycleLen = (60 / bpm) * 4; // 1 cycle = 4 beats
  const events = collectEvents(midi);
  const tracks = buildTracks(events, midi, cycleLen, opts);
  return formatStrudelOutput(tracks, bpm, opts);
}
