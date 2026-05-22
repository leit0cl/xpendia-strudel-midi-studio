import { initHydra, clearHydra } from '@strudel/hydra';

let enabled = false;

export async function enableHydra() {
  if (enabled) return;
  await initHydra({ detectAudio: false, feedStrudel: false });
  enabled = true;
  const c = document.getElementById('hydra-canvas') as HTMLCanvasElement | null;
  if (c) {
    c.style.position = 'fixed';
    c.style.inset = '0';
    c.style.width = '100vw';
    c.style.height = '100vh';
    c.style.zIndex = '0';
    c.style.opacity = '0.55';
    c.style.pointerEvents = 'none';
  }
  // Default scene so the canvas isn't black on activation.
  // hydra-synth exposes osc/noise/etc as globals after initHydra().
  try {
    const w = window as unknown as {
      osc: (a?: number, b?: number, c?: number) => { kaleid: (n: number) => { out: () => void } };
    };
    w.osc?.(20, 0.08, 1.4).kaleid(4).out();
  } catch {
    /* ignore — hydra not ready yet */
  }
}

export function runHydraScene(code: string) {
  if (!enabled) return;
  try {
    // hydra-synth installs an `eval` global that uses its own scope
    const w = window as unknown as { eval: (s: string) => void };
    w.eval(code);
  } catch {
    /* ignore */
  }
}

export function disableHydra() {
  if (!enabled) return;
  try {
    clearHydra();
  } catch {
    /* ignore */
  }
  document.getElementById('hydra-canvas')?.remove();
  enabled = false;
}

export function isHydraOn() {
  return enabled;
}
