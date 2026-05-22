import { useEffect, useRef } from 'react';
import { onTrigger } from '../strudel/engine';

type Event = {
  t: number; // perf time when added
  duration: number; // seconds
  row: number; // 0..N lane
  label: string;
  color: string;
};

const LANE_COLORS = [
  '#7c5cff',
  '#38d39f',
  '#ffb84d',
  '#ff6b6b',
  '#5cc8ff',
  '#ff8ad8',
  '#c4d65c',
  '#9a9fff',
];

const WINDOW_SEC = 4; // visible window
const LANE_HEIGHT = 18;
const PADDING = 8;

export function PianoRoll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventsRef = useRef<Event[]>([]);
  const lanesRef = useRef<Map<string, number>>(new Map());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = onTrigger(({ hap }) => {
      const v = hap.value ?? {};
      const label =
        v.s ??
        (v.note !== undefined ? String(v.note) : v.n !== undefined ? String(v.n) : '?');
      // assign lane
      let row = lanesRef.current.get(label);
      if (row === undefined) {
        row = lanesRef.current.size;
        lanesRef.current.set(label, row);
      }
      const dur = hap.whole
        ? Math.max(0.05, hap.whole.end - hap.whole.begin)
        : 0.1;
      eventsRef.current.push({
        t: performance.now() / 1000,
        duration: dur,
        row,
        label,
        color: LANE_COLORS[row % LANE_COLORS.length],
      });
      // cap buffer
      if (eventsRef.current.length > 500) {
        eventsRef.current.splice(0, eventsRef.current.length - 500);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const now = performance.now() / 1000;
      const cutoff = now - WINDOW_SEC;
      // drop old
      while (
        eventsRef.current.length &&
        eventsRef.current[0].t + eventsRef.current[0].duration < cutoff
      ) {
        eventsRef.current.shift();
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // background grid (1s ticks)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let s = 1; s <= WINDOW_SEC; s++) {
        const x = w - (s / WINDOW_SEC) * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // playhead (right edge)
      ctx.strokeStyle = 'rgba(124,92,255,0.6)';
      ctx.beginPath();
      ctx.moveTo(w - 1, 0);
      ctx.lineTo(w - 1, h);
      ctx.stroke();

      // events
      for (const ev of eventsRef.current) {
        const age = now - ev.t;
        if (age > WINDOW_SEC) continue;
        const x = w - (age / WINDOW_SEC) * w;
        const blockW = Math.max(4, (ev.duration / WINDOW_SEC) * w);
        const y = PADDING + ev.row * LANE_HEIGHT;
        if (y + LANE_HEIGHT > h - PADDING) continue;
        const alpha = Math.max(0.3, 1 - age / WINDOW_SEC);
        ctx.fillStyle = ev.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - blockW, y, blockW, LANE_HEIGHT - 4);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '10px ui-monospace, monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText(ev.label, 6, y + (LANE_HEIGHT - 4) / 2);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="pianoroll">
      <canvas ref={canvasRef} />
    </div>
  );
}
