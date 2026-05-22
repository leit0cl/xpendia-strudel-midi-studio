import { useEffect, useRef, useState } from 'react';
import {
  exportToMp3,
  type ExportProgress,
} from './mp3Exporter';

type Status = 'idle' | 'running' | 'done' | 'error';

const PRESET_DURATIONS = [8, 16, 30, 60, 120];

export function ExportMp3Dialog({
  open,
  onClose,
  code,
  defaultDuration = 16,
  filenameHint = 'strudel',
}: {
  open: boolean;
  onClose: () => void;
  code: string;
  defaultDuration?: number;
  filenameHint?: string;
}) {
  const [duration, setDuration] = useState(defaultDuration);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setProgress(null);
      setError(null);
      cancelledRef.current = false;
    }
  }, [open]);

  if (!open) return null;

  const run = async () => {
    setStatus('running');
    setError(null);
    try {
      const filename = `${filenameHint}-${duration}s-192k-${Date.now()}.mp3`;
      await exportToMp3({
        code,
        durationSec: duration,
        filename,
        onProgress: (p) => {
          if (!cancelledRef.current) setProgress(p);
        },
      });
      setStatus('done');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus('error');
    }
  };

  const renderProgress = () => {
    if (!progress) return null;
    if (progress.phase === 'recording') {
      const pct = Math.min(100, (progress.elapsed / progress.total) * 100);
      return (
        <div className="export-progress">
          <div className="export-progress-label">
            🔴 Grabando · {progress.elapsed.toFixed(1)}s / {progress.total}s
          </div>
          <div className="export-bar">
            <div className="export-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    }
    if (progress.phase === 'decoding') {
      return <div className="export-progress-label">⏳ Decodificando audio…</div>;
    }
    if (progress.phase === 'encoding') {
      const pct = progress.progress * 100;
      return (
        <div className="export-progress">
          <div className="export-progress-label">
            🎵 Codificando MP3 192kbps · {pct.toFixed(0)}%
          </div>
          <div className="export-bar">
            <div className="export-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="export-overlay" onClick={(e) => e.target === e.currentTarget && status !== 'running' && onClose()}>
      <div className="export-dialog">
        <header className="export-header">
          <span>🎵 Exportar MP3 (192 kbps)</span>
          <button
            type="button"
            className="ghost small"
            onClick={onClose}
            disabled={status === 'running'}
            title="cerrar"
          >
            ✕
          </button>
        </header>

        <div className="export-body">
          <label className="export-label">
            <span>Duración</span>
            <div className="export-duration-grid">
              {PRESET_DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`export-duration ${duration === d ? 'active' : ''}`}
                  onClick={() => setDuration(d)}
                  disabled={status === 'running'}
                >
                  {d < 60 ? `${d}s` : `${d / 60}min`}
                </button>
              ))}
              <input
                type="number"
                className="export-duration-input"
                min={1}
                max={600}
                value={duration}
                onChange={(e) =>
                  setDuration(Math.max(1, Math.min(600, parseInt(e.target.value, 10) || 1)))
                }
                disabled={status === 'running'}
                title="segundos"
              />
            </div>
          </label>

          <div className="export-info">
            <div>Calidad: MP3 estéreo · 192 kbps</div>
            <div>
              Tamaño aprox.: <strong>{((duration * 192) / 8 / 1024).toFixed(2)} MB</strong>
            </div>
            <div className="muted">
              La grabación ocurre en tiempo real: {duration}s reales. No cambies
              de pestaña mientras graba.
            </div>
          </div>

          {renderProgress()}

          {status === 'done' && (
            <div className="export-success">
              ✅ Exportado y descargado.
            </div>
          )}
          {status === 'error' && error && (
            <pre className="export-error">{error}</pre>
          )}
        </div>

        <footer className="export-footer">
          <button
            type="button"
            className="ghost"
            onClick={onClose}
            disabled={status === 'running'}
          >
            {status === 'done' ? 'cerrar' : 'cancelar'}
          </button>
          <button
            type="button"
            onClick={run}
            disabled={status === 'running' || !code.trim()}
          >
            {status === 'running' ? 'exportando…' : '▶ exportar mp3'}
          </button>
        </footer>
      </div>
    </div>
  );
}
