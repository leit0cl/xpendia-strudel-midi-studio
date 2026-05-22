import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  /** Optional formatter for the displayed value (e.g. khz). */
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

/** Vertical-drag knob: drag up to increase, down to decrease. Double-click
 * opens a prompt to type a precise value. Visual fill arc shows percentage. */
export function FxKnob({
  label,
  value,
  min,
  max,
  step = 0.01,
  unit,
  format,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
    document.body.classList.add('cm-knob-dragging');
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const dy = startYRef.current - e.clientY;
    const range = max - min;
    let next = startValRef.current + (dy / 180) * range;
    next = Math.max(min, Math.min(max, next));
    if (step) next = Math.round(next / step) * step;
    if (next !== value) onChange(next);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragging(false);
    document.body.classList.remove('cm-knob-dragging');
  }

  function onDoubleClick() {
    const raw = window.prompt(
      t('fx.knob_prompt', { label, min, max }),
      String(value),
    );
    if (raw == null) return;
    const n = Number(raw);
    if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
  }

  const pct = (value - min) / (max - min);
  const displayed = format
    ? format(value)
    : value.toFixed(step >= 1 ? 0 : 2);

  return (
    <div
      className={`fx-knob ${dragging ? 'is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      title={t('fx.knob_drag_hint', { label })}
    >
      <div className="fx-knob-dial">
        <div
          className="fx-knob-fill"
          style={{ height: `${Math.round(pct * 100)}%` }}
        />
        <span className="fx-knob-value">
          {displayed}
          {unit ? <em>{unit}</em> : null}
        </span>
      </div>
      <div className="fx-knob-label">{label}</div>
    </div>
  );
}
