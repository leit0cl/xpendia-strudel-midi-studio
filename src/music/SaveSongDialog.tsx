import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  defaultName?: string;
  kind: 'code-song' | 'studio-song';
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
}

export function SaveSongDialog({ open, defaultName, kind, onClose, onSave }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(defaultName ?? '');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(defaultName ?? '');
      setSaving(false);
      // focus & select after the dialog mounts
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
    }
  }, [open, defaultName]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onSave(trimmed);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="save-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="save-dialog" onSubmit={submit} aria-labelledby="save-title">
        <div className="save-icon">{kind === 'studio-song' ? '🎛' : '⌨'}</div>
        <h3 id="save-title" className="save-title">
          {t('save_dialog.title')}
        </h3>
        <p className="save-subtitle">
          {kind === 'studio-song'
            ? t('save_dialog.subtitle_studio')
            : t('save_dialog.subtitle_code')}
        </p>
        <input
          ref={inputRef}
          className="save-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('save_dialog.placeholder')}
          maxLength={80}
          required
        />
        <div className="save-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onClose}
            disabled={saving}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="confirm-ok primary"
            disabled={saving || !name.trim()}
          >
            {saving ? t('save_dialog.saving') : t('save_dialog.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
