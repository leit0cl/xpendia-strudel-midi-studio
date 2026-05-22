import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PromptDialog } from '../components/PromptDialog';
import {
  deleteSong,
  listSongs,
  renameSong,
  type SavedSong,
} from './library';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (song: SavedSong) => void;
}

function formatDate(ts: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export function MyMusicPanel({ open, onClose, onLoad }: Props) {
  const { t, i18n } = useTranslation();
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [filter, setFilter] = useState<'all' | 'code-song' | 'studio-song'>(
    'all',
  );
  const [loading, setLoading] = useState(false);
  const [renameTarget, setRenameTarget] = useState<SavedSong | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedSong | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setSongs(await listSongs());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // Only close on Escape if no inner dialog is active.
      if (e.key === 'Escape' && !renameTarget && !deleteTarget) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, renameTarget, deleteTarget]);

  if (!open) return null;

  const visible = songs.filter((s) => filter === 'all' || s.kind === filter);

  async function doDelete() {
    if (!deleteTarget) return;
    await deleteSong(deleteTarget.id);
    setDeleteTarget(null);
    await refresh();
  }

  async function doRename(newName: string) {
    if (!renameTarget) return;
    await renameSong(renameTarget.id, newName);
    setRenameTarget(null);
    await refresh();
  }

  return (
    <div
      className="my-music-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-music-panel" role="dialog" aria-modal="true">
        <header className="my-music-header">
          <div className="my-music-title">
            <span className="my-music-icon">🎶</span>
            <h3>{t('my_music.title')}</h3>
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

        <div className="my-music-filters">
          <button
            type="button"
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            {t('my_music.filter_all')} ({songs.length})
          </button>
          <button
            type="button"
            className={filter === 'studio-song' ? 'active' : ''}
            onClick={() => setFilter('studio-song')}
          >
            🎛 {t('my_music.filter_studio')}
          </button>
          <button
            type="button"
            className={filter === 'code-song' ? 'active' : ''}
            onClick={() => setFilter('code-song')}
          >
            ⌨ {t('my_music.filter_code')}
          </button>
        </div>

        <div className="my-music-list">
          {loading && (
            <div className="my-music-empty">{t('common.loading')}</div>
          )}
          {!loading && visible.length === 0 && (
            <div className="my-music-empty">{t('my_music.empty')}</div>
          )}
          {!loading &&
            visible.map((s) => (
              <div key={s.id} className="my-music-row">
                <div className="my-music-row-main">
                  <span className="my-music-kind">
                    {s.kind === 'studio-song' ? '🎛' : '⌨'}
                  </span>
                  <div className="my-music-meta">
                    <button
                      type="button"
                      className="my-music-name"
                      onClick={() => {
                        onLoad(s);
                        onClose();
                      }}
                      title={t('my_music.load_title')}
                    >
                      {s.name}
                    </button>
                    <span className="my-music-date">
                      {formatDate(s.updatedAt, i18n.language)}
                    </span>
                  </div>
                </div>
                <div className="my-music-row-actions">
                  <button
                    type="button"
                    className="my-music-action"
                    onClick={() => setRenameTarget(s)}
                    title={t('my_music.rename')}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="my-music-action danger"
                    onClick={() => setDeleteTarget(s)}
                    title={t('my_music.delete')}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <PromptDialog
        open={renameTarget !== null}
        title={t('my_music.rename')}
        message={t('my_music.rename_prompt')}
        defaultValue={renameTarget?.name ?? ''}
        icon="✎"
        confirmLabel={t('my_music.rename')}
        onConfirm={doRename}
        onCancel={() => setRenameTarget(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        icon="🗑"
        title={t('my_music.delete')}
        message={
          deleteTarget
            ? t('my_music.delete_confirm', { name: deleteTarget.name })
            : ''
        }
        confirmLabel={t('my_music.delete')}
        variant="danger"
        onConfirm={doDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
