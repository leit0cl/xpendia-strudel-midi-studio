import { useEffect, useRef } from 'react';
import { getAnalyser } from '../fx/analyser';

/** Bottom-pinned waveform band shown over Dancing mode. Uses the shared
 *  analyser (same as Oscilloscope) so there's only one tap on the audio. */
export function AudioWaveBand() {
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
      /* not yet booted */
    }
    let buf: Uint8Array | null = analyser
      ? new Uint8Array(analyser.fftSize)
      : null;

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    });
    ro.observe(canvas);

    function draw() {
      if (!ctx || !canvas) return;
      if (!analyser) {
        try {
          analyser = getAnalyser();
          buf = new Uint8Array(analyser.fftSize);
        } catch {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }
      }
      analyser.getByteTimeDomainData(buf!);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // background gradient haze
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(0,191,255,0)');
      grad.addColorStop(1, 'rgba(0,191,255,0.16)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // mirrored bars (symmetric around center) → "car EQ" look
      const len = buf!.length;
      const samples = 96;
      const barW = w / samples;
      ctx.fillStyle = '#00BFFF';
      ctx.shadowColor = '#00BFFF';
      ctx.shadowBlur = 18;
      for (let i = 0; i < samples; i++) {
        const idx = Math.floor((i / samples) * len);
        const v = Math.abs(buf![idx] / 128 - 1); // 0..1
        const bh = Math.max(2, v * h * 0.95);
        const x = i * barW + 1;
        const y = (h - bh) / 2;
        ctx.fillRect(x, y, Math.max(1, barW - 2), bh);
      }
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="dancing-wave-canvas" />;
}
