import { useEffect, useRef } from 'react';
import { getAnalyser } from './analyser';

interface Props {
  /** Stroke color — defaults to the Xpendia cyan accent. */
  color?: string;
  /** Line thickness in CSS pixels. */
  thickness?: number;
  /** Adds a subtle glow halo behind the line. */
  glow?: boolean;
}

export function Oscilloscope({
  color = '#00BFFF',
  thickness = 2,
  glow = true,
}: Props) {
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
      // AudioContext not booted yet — keep retrying via RAF until it exists.
    }
    let buffer: Uint8Array<ArrayBuffer> | null = analyser
      ? new Uint8Array(new ArrayBuffer(analyser.fftSize))
      : null;

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    });
    ro.observe(canvas);

    function draw() {
      if (!ctx || !canvas) return;
      if (!analyser) {
        try {
          analyser = getAnalyser();
          buffer = new Uint8Array(new ArrayBuffer(analyser.fftSize));
        } catch {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }
      }
      analyser.getByteTimeDomainData(buffer!);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // center line
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // waveform
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness * (window.devicePixelRatio || 1);
      ctx.beginPath();
      const len = buffer!.length;
      const step = w / len;
      for (let i = 0; i < len; i++) {
        const v = buffer![i] / 128 - 1; // -1..1
        const x = i * step;
        const y = h / 2 + v * (h / 2) * 0.92;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [color, thickness, glow]);

  return <canvas ref={canvasRef} className="oscilloscope-canvas" />;
}
