const TAP_WINDOW_MS = 2000;
const MIN_TAPS = 2;

export class TapBpm {
  private taps: number[] = [];

  tap(): number | null {
    const now = performance.now();
    // discard taps older than window
    this.taps = this.taps.filter((t) => now - t < TAP_WINDOW_MS);
    this.taps.push(now);
    if (this.taps.length < MIN_TAPS) return null;
    const intervals: number[] = [];
    for (let i = 1; i < this.taps.length; i++) {
      intervals.push(this.taps[i] - this.taps[i - 1]);
    }
    const sorted = [...intervals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const bpm = 60000 / median;
    if (!isFinite(bpm) || bpm < 20 || bpm > 400) return null;
    return Math.round(bpm);
  }

  reset() {
    this.taps = [];
  }
}

// Strudel usa CPM (cycles per minute), un ciclo ≈ 4 beats (4/4). Convertimos
// el BPM "real" del tap a CPM dividiendo por 4 para que un tap a 120 BPM
// genere un tempo perceptual de 120 BPM y no de 480.
function bpmToCpm(bpm: number): number {
  return Math.round((bpm / 4) * 100) / 100;
}

// Replace `.cpm(N)` or `.cps(N)` in code; if neither, append `.cpm(N)` at end of last line.
export function setBpmInCode(code: string, bpm: number): string {
  const cpm = bpmToCpm(bpm);
  const cpmRe = /\.cpm\(\s*[\d.]+\s*\)/;
  if (cpmRe.test(code)) {
    return code.replace(cpmRe, `.cpm(${cpm})`);
  }
  const cpsRe = /\.cps\(\s*[\d.]+\s*\)/;
  if (cpsRe.test(code)) {
    return code.replace(cpsRe, `.cps(${(bpm / 60 / 4).toFixed(3)})`);
  }
  // append
  const trimmed = code.replace(/\s+$/, '');
  return `${trimmed}.cpm(${cpm})`;
}
