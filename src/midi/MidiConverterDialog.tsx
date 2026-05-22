import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  midiToStrudel,
  DEFAULT_OPTS,
  type MidiConvertOpts,
} from './midiToStrudel';
import { getSharedMidi } from './sharedMidi';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoadIntoEditor: (code: string) => void;
}

export function MidiConverterDialog({ open, onClose, onLoadIntoEditor }: Props) {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState<string | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [opts, setOpts] = useState<MidiConvertOpts>(DEFAULT_OPTS);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setFileName(null);
      setBuffer(null);
      setOutput('');
      setError(null);
      return;
    }
    // If the inline player already loaded a file, hand it off here.
    const shared = getSharedMidi();
    if (shared.buffer && shared.fileName) {
      setFileName(shared.fileName);
      setBuffer(shared.buffer);
      convert(shared.buffer, opts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleFile(file: File) {
    if (!/\.(mid|midi)$/i.test(file.name)) {
      setError(t('midi.bad_file'));
      return;
    }
    setError(null);
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    setBuffer(buf);
    convert(buf, opts);
  }

  function convert(buf: ArrayBuffer, currentOpts: MidiConvertOpts) {
    try {
      const code = midiToStrudel(buf, currentOpts);
      setOutput(code);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setOutput('');
    }
  }

  function updateOpts(patch: Partial<MidiConvertOpts>) {
    const next = { ...opts, ...patch };
    setOpts(next);
    if (buffer) convert(buffer, next);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      /* user can copy manually */
    }
  }

  function loadIntoEditor() {
    if (!output) return;
    onLoadIntoEditor(output);
    onClose();
  }

  return (
    <div
      className="midi-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="midi-dialog" role="dialog" aria-modal="true">
        <header className="midi-header">
          <div className="midi-title">
            <span className="midi-icon">🎹</span>
            <h3>{t('midi.title')}</h3>
          </div>
          <button
            type="button"
            className="my-music-close"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </header>

        <div className="midi-body">
          <div
            className={`midi-dropzone ${dragOver ? 'is-dragover' : ''} ${fileName ? 'has-file' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = Array.from(e.dataTransfer.files).find((f) =>
                /\.(mid|midi)$/i.test(f.name),
              );
              if (file) handleFile(file);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".mid,.midi,audio/midi"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="midi-dropzone-icon">🎼</div>
            <div className="midi-dropzone-text">
              {fileName ? (
                <strong>{fileName}</strong>
              ) : (
                <>
                  <strong>{t('midi.drop_or_click')}</strong>
                  <span>{t('midi.formats')}</span>
                </>
              )}
            </div>
          </div>

          <details className="midi-opts">
            <summary>{t('midi.options')}</summary>
            <div className="midi-opts-grid">
              <label>
                <span>{t('midi.bar_limit')}</span>
                <input
                  type="number"
                  min={0}
                  value={opts.barLimit}
                  onChange={(e) => updateOpts({ barLimit: Number(e.target.value) || 0 })}
                />
              </label>
              <label>
                <span>{t('midi.notes_per_bar')}</span>
                <input
                  type="number"
                  min={4}
                  step={4}
                  value={opts.notesPerBar}
                  onChange={(e) => updateOpts({ notesPerBar: Math.max(4, Number(e.target.value) || 64) })}
                />
              </label>
              <label className="midi-checkbox">
                <input
                  type="checkbox"
                  checked={opts.guessInstrument}
                  onChange={(e) => updateOpts({ guessInstrument: e.target.checked })}
                />
                <span>{t('midi.guess_instrument')}</span>
              </label>
              <label className="midi-checkbox">
                <input
                  type="checkbox"
                  checked={opts.flatSequences}
                  onChange={(e) => updateOpts({ flatSequences: e.target.checked })}
                />
                <span>{t('midi.flat_sequences')}</span>
              </label>
              <label className="midi-checkbox">
                <input
                  type="checkbox"
                  checked={opts.smallPrint}
                  onChange={(e) => updateOpts({ smallPrint: e.target.checked })}
                />
                <span>{t('midi.small_print')}</span>
              </label>
            </div>
          </details>

          {error && <div className="midi-error">⚠ {error}</div>}

          {output && (
            <>
              <textarea
                className="midi-output"
                value={output}
                readOnly
                spellCheck={false}
              />
              <div className="midi-actions">
                <button
                  type="button"
                  className="confirm-cancel"
                  onClick={copy}
                >
                  📋 {t('midi.copy')}
                </button>
                <button
                  type="button"
                  className="confirm-ok primary"
                  onClick={loadIntoEditor}
                >
                  {t('midi.load_into_editor')}
                </button>
              </div>
            </>
          )}

          <div className="midi-credit">
            {t('midi.credit')}{' '}
            <a
              href="https://github.com/Emanuel-de-Jong/MIDI-To-Strudel"
              target="_blank"
              rel="noopener noreferrer"
            >
              Emanuel-de-Jong/MIDI-To-Strudel
            </a>{' '}
            (GPL-3.0)
          </div>
        </div>
      </div>
    </div>
  );
}
