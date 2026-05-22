import { useState } from 'react';
import type { Segment, Track, TrackParams } from './types';
import { DrumsForm } from './forms/DrumsForm';
import { ArpeggioForm } from './forms/ArpeggioForm';
import { PadForm } from './forms/PadForm';
import { BassForm } from './forms/BassForm';
import { StringsForm } from './forms/StringsForm';
import { newSegmentId, defaultSegmentParams } from './Studio';

const ICONS: Record<Track['type'], string> = {
  drums: '🥁',
  arpeggio: '🎹',
  pad: '🌫️',
  bass: '🎸',
  strings: '🎻',
};

function segmentSummary(t: Track, seg: Segment): string {
  if (seg.silent) return `silencio · ${seg.bars}c`;
  const p = seg.params as Record<string, unknown>;
  switch (t.type) {
    case 'drums':
      return `${p.pattern ?? '?'} · ${p.bank ?? '?'}`;
    case 'arpeggio':
    case 'bass':
      return `${(p.notes as string[] | undefined)?.join(' ') || '—'} · ${p.instrument}`;
    case 'pad':
    case 'strings':
      return `${(p.notes as string[] | undefined)?.join(',') || '—'} · ${p.instrument}`;
    default:
      return '—';
  }
}

export function TrackCard({
  track,
  onChange,
  onDelete,
}: {
  track: Track;
  onChange: (t: Track) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const safeIdx = Math.min(activeIdx, track.segments.length - 1);
  const active = track.segments[safeIdx];

  const updateSegment = (i: number, patch: Partial<Segment>) => {
    const segments = track.segments.slice();
    segments[i] = { ...segments[i], ...patch };
    onChange({ ...track, segments });
  };

  const updateSegmentParams = (params: TrackParams) => {
    if (!active) return;
    updateSegment(safeIdx, { params });
  };

  const addSegment = () => {
    // duplica el último por default — patrón común al alargar pistas
    const last = track.segments[track.segments.length - 1];
    const base: Segment = last
      ? {
          id: newSegmentId(),
          bars: last.bars,
          params: JSON.parse(JSON.stringify(last.params)),
          silent: last.silent,
        }
      : { id: newSegmentId(), bars: 4, params: defaultSegmentParams(track.type) };
    onChange({ ...track, segments: [...track.segments, base] });
    setActiveIdx(track.segments.length); // selecciona el nuevo
  };

  const addSilentSegment = () => {
    const last = track.segments[track.segments.length - 1];
    const seg: Segment = {
      id: newSegmentId(),
      bars: last?.bars ?? 4,
      params: defaultSegmentParams(track.type),
      silent: true,
    };
    onChange({ ...track, segments: [...track.segments, seg] });
    setActiveIdx(track.segments.length);
  };

  const toggleSilent = (i: number) => {
    const seg = track.segments[i];
    updateSegment(i, { silent: !seg.silent });
  };

  const duplicateSegment = (i: number) => {
    const src = track.segments[i];
    const copy: Segment = {
      id: newSegmentId(),
      bars: src.bars,
      params: JSON.parse(JSON.stringify(src.params)),
    };
    const segments = [
      ...track.segments.slice(0, i + 1),
      copy,
      ...track.segments.slice(i + 1),
    ];
    onChange({ ...track, segments });
    setActiveIdx(i + 1);
  };

  const removeSegment = (i: number) => {
    if (track.segments.length <= 1) return; // siempre ≥1 segmento
    const segments = track.segments.slice();
    segments.splice(i, 1);
    onChange({ ...track, segments });
    if (safeIdx >= segments.length) setActiveIdx(segments.length - 1);
  };

  return (
    <div className={`track-card ${track.muted ? 'muted' : ''}`}>
      <header>
        <button
          type="button"
          className="track-toggle"
          onClick={() => setOpen(!open)}
          title={open ? 'colapsar' : 'expandir'}
        >
          {open ? '▾' : '▸'}
        </button>
        <span className="track-icon">{ICONS[track.type]}</span>
        <input
          className="track-name"
          value={track.name}
          onChange={(e) => onChange({ ...track, name: e.target.value })}
        />
        <button
          type="button"
          className={`track-mute ${track.muted ? 'on' : ''}`}
          onClick={() => onChange({ ...track, muted: !track.muted })}
          title={track.muted ? 'unmute' : 'mute'}
        >
          {track.muted ? 'muted' : 'on'}
        </button>
        <input
          type="range"
          className="track-vol"
          min={0}
          max={1}
          step={0.05}
          value={track.volume}
          onChange={(e) => onChange({ ...track, volume: parseFloat(e.target.value) })}
          title={`volumen ${Math.round(track.volume * 100)}%`}
        />
        <button
          type="button"
          className="track-delete"
          onClick={onDelete}
          title="eliminar pista"
        >
          ✕
        </button>
      </header>

      {open && (
        <div className="track-body">
          {/* tira de segmentos */}
          <div className="segments-strip">
            {track.segments.map((seg, i) => {
              const isActive = i === safeIdx;
              return (
                <button
                  key={seg.id}
                  type="button"
                  className={`segment-chip ${isActive ? 'active' : ''} ${seg.silent ? 'silent' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  onDoubleClick={() => toggleSilent(i)}
                  title={`${segmentSummary(track, seg)} — doble click para ${seg.silent ? 'reactivar' : 'silenciar'}`}
                >
                  <span className="seg-num">#{i + 1}</span>
                  <span className="seg-bars">{seg.silent ? '∅' : `${seg.bars}c`}</span>
                </button>
              );
            })}
            <button
              type="button"
              className="segment-add"
              onClick={addSegment}
              title="agregar segmento (duplica el último)"
            >
              +
            </button>
            <button
              type="button"
              className="segment-add silent"
              onClick={addSilentSegment}
              title="agregar silencio"
            >
              ∅
            </button>
          </div>

          {/* form del segmento activo */}
          {active && (
            <div className="segment-form">
              <div className="segment-form-header">
                <span className="segment-form-title">
                  Segmento #{safeIdx + 1}
                  {active.silent && <em className="silent-tag"> (silencio)</em>}
                </span>
                <label className="bars-input">
                  <span>compases</span>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={active.bars}
                    onChange={(e) =>
                      updateSegment(safeIdx, {
                        bars: Math.max(1, parseInt(e.target.value, 10) || 1),
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className={`ghost small ${active.silent ? 'on' : ''}`}
                  onClick={() => toggleSilent(safeIdx)}
                  title={active.silent ? 'reactivar segmento' : 'silenciar segmento'}
                >
                  {active.silent ? '▶ reactivar' : '∅ silenciar'}
                </button>
                <button
                  type="button"
                  className="ghost small"
                  onClick={() => duplicateSegment(safeIdx)}
                  title="duplicar este segmento"
                >
                  ⎘ duplicar
                </button>
                <button
                  type="button"
                  className="ghost small"
                  onClick={() => removeSegment(safeIdx)}
                  disabled={track.segments.length <= 1}
                  title="eliminar este segmento"
                >
                  ✕ eliminar
                </button>
              </div>
              {active.silent ? (
                <div className="segment-silent-note">
                  Este bloque suena como silencio durante {active.bars} compás{active.bars === 1 ? '' : 'es'}.
                </div>
              ) : (
                <>
                  {track.type === 'drums' && (
                    <DrumsForm
                      params={active.params as never}
                      onChange={(p) => updateSegmentParams(p as TrackParams)}
                    />
                  )}
                  {track.type === 'arpeggio' && (
                    <ArpeggioForm
                      params={active.params as never}
                      onChange={(p) => updateSegmentParams(p as TrackParams)}
                    />
                  )}
                  {track.type === 'pad' && (
                    <PadForm
                      params={active.params as never}
                      onChange={(p) => updateSegmentParams(p as TrackParams)}
                    />
                  )}
                  {track.type === 'bass' && (
                    <BassForm
                      params={active.params as never}
                      onChange={(p) => updateSegmentParams(p as TrackParams)}
                    />
                  )}
                  {track.type === 'strings' && (
                    <StringsForm
                      params={active.params as never}
                      onChange={(p) => updateSegmentParams(p as TrackParams)}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
