import { useEffect, useRef } from 'react';
import { getAnalyser } from './analyser';

interface Props {
  /** Bar gradient base color. Defaults to Xpendia cyan. */
  color?: string;
}

/** FFT spectrum bar visualizer — the "EQ view". Bars colored by frequency:
 *  bass → cyan, mids → mint, highs → coral. */
export function Spectrum({ color = '#00BFFF' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    try {
      analyser = getAnalyser();
    } catch {
      /* not booted yet */
    }
    let buf: Uint8Array | null = analyser
      ? new Uint8Array(analyser.frequencyBinCount)
      : null;

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    });
    ro.observe(canvas);

    // peak hold per bar for the floating "peak" cap
    let peaks: number[] = [];

    function draw() {
      if (!ctx || !canvas) return;
      if (!analyser) {
        try {
          analyser = getAnalyser();
          buf = new Uint8Array(analyser.frequencyBinCount);
        } catch {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }
      }
      analyser.getByteFrequencyData(buf!);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bars = 48;
      // logarithmic-ish mapping so bass doesn't dominate visually
      const usableBins = Math.min(buf!.length, 512);
      const bw = w / bars;

      if (peaks.length !== bars) peaks = new Array(bars).fill(0);

      for (let i = 0; i < bars; i++) {
        // log frequency mapping
        const t = i / (bars - 1);
        const idx = Math.floor(Math.pow(t, 2.2) * (usableBins - 1));
        const next = Math.floor(Math.pow((i + 1) / bars, 2.2) * (usableBins - 1));
        let v = 0;
        for (let j = idx; j <= Math.max(idx, next); j++) {
          if (buf![j] > v) v = buf![j];
        }
        const norm = v / 255;
        const bh = norm * h * 0.92;

        // color per band: bass = cyan, mid = mint, high = coral
        let fill: string;
        if (t < 0.33) fill = color;
        else if (t < 0.66) fill = '#11FA8F';
        else fill = '#FF7357';

        const x = i * bw + 1;
        const y = h - bh;

        // bar gradient
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, fill);
        grad.addColorStop(1, 'rgba(0,0,0,0.05)');
        ctx.fillStyle = grad;
        ctx.shadowColor = fill;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, Math.max(1, bw - 2), bh);

        // peak cap
        peaks[i] = Math.max(peaks[i] * 0.94, bh);
        ctx.shadowBlur = 0;
        ctx.fillStyle = fill;
        ctx.fillRect(x, h - peaks[i] - 2, Math.max(1, bw - 2), 2);
      }
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [color]);

  return <canvas ref={canvasRef} className="spectrum-canvas" />;
}
