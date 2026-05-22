import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  maxLength?: number;
  onConfirm: (value: string) => void | Promise<void>;
  onCancel: () => void;
}

/** Premium prompt — replaces window.prompt with a styled dialog. */
export function PromptDialog({
  open,
  title,
  message,
  defaultValue = '',
  placeholder,
  icon = '✎',
  confirmLabel,
  cancelLabel,
  maxLength = 80,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setBusy(false);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await onConfirm(trimmed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="save-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <form className="save-dialog" onSubmit={submit}>
        <div className="save-icon">{icon}</div>
        <h3 className="save-title">{title}</h3>
        {message && <p className="save-subtitle">{message}</p>}
        <input
          ref={inputRef}
          className="save-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          required
        />
        <div className="save-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel ?? t('common.cancel')}
          </button>
          <button
            type="submit"
            className="confirm-ok primary"
            disabled={busy || !value.trim()}
          >
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </form>
    </div>
  );
}
