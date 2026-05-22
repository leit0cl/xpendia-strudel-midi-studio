import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useTheme } from '../theme/useTheme';
import { AWESOME_PACKS } from '../strudel/sample-packs';

interface Props {
  open: boolean;
  onClose: () => void;
  loadedExtraCount: number;
  onOpenMyMusic: () => void;
  onOpenPacks: () => void;
  onOpenMidi: () => void;
}

type Section = 'general' | 'midi' | 'credits';

const CREDITS = [
  {
    name: 'Strudel',
    desc: 'Felix Roos, Daniel Roos & community — live-coding engine.',
    url: 'https://strudel.cc',
  },
  {
    name: 'TidalCycles',
    desc: 'Alex McLean — original pattern language.',
    url: 'https://tidalcycles.org',
  },
  {
    name: 'tidal-drum-machines',
    desc: 'ritchse — vintage drum machine sample catalog.',
    url: 'https://github.com/ritchse/tidal-drum-machines',
  },
  {
    name: 'VCSL',
    desc: 'Versilian Community Sample Library — orchestral samples.',
    url: 'https://github.com/sgossner/VCSL',
  },
  {
    name: 'lamejs',
    desc: 'Pure-JS MP3 encoder used for the export feature.',
    url: 'https://github.com/zhuker/lamejs',
  },
  {
    name: 'MediaPipe Tasks Vision',
    desc: 'Real-time pose / hand landmarking for Dancing mode.',
    url: 'https://developers.google.com/mediapipe',
  },
  {
    name: 'three.js + react-three-fiber',
    desc: 'Neon 3D rendering of the body skeleton.',
    url: 'https://docs.pmnd.rs/react-three-fiber',
  },
  {
    name: 'i18next + react-i18next',
    desc: 'Internationalization for ES / EN / PT.',
    url: 'https://www.i18next.com',
  },
  {
    name: 'MIDI-To-Strudel',
    desc: 'Emanuel de Jong — base algorithm for the MIDI → Strudel converter.',
    url: 'https://github.com/Emanuel-de-Jong/MIDI-To-Strudel',
  },
  {
    name: 'localforage',
    desc: 'IndexedDB-backed storage powering "My music".',
    url: 'https://github.com/localForage/localForage',
  },
];

export function SettingsModal({
  open,
  onClose,
  loadedExtraCount,
  onOpenMyMusic,
  onOpenPacks,
  onOpenMidi,
}: Props) {
  const { t } = useTranslation();
  const [section, setSection] = useState<Section>('general');
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="settings-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-panel glass" role="dialog" aria-modal="true">
        <header className="settings-header">
          <div className="settings-title">
            <span className="settings-icon">⚙</span>
            <h3>{t('settings.title')}</h3>
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

        <nav className="settings-tabs">
          <button
            type="button"
            className={section === 'general' ? 'active' : ''}
            onClick={() => setSection('general')}
          >
            {t('settings.tab_general')}
          </button>
          <button
            type="button"
            className={section === 'midi' ? 'active' : ''}
            onClick={() => setSection('midi')}
          >
            {t('settings.tab_midi')}
          </button>
          <button
            type="button"
            className={section === 'credits' ? 'active' : ''}
            onClick={() => setSection('credits')}
          >
            {t('settings.tab_credits')}
          </button>
        </nav>

        <div className="settings-body">
          {section === 'general' && (
            <>
              <div className="settings-row">
                <div className="settings-row-label">
                  <h4>{t('settings.theme')}</h4>
                  <p>{t('settings.theme_desc')}</p>
                </div>
                <div className="settings-row-control">
                  <div className="theme-toggle-group">
                    <button
                      type="button"
                      className={theme === 'dark' ? 'active' : ''}
                      onClick={() => setTheme('dark')}
                    >
                      ☾ {t('settings.dark')}
                    </button>
                    <button
                      type="button"
                      className={theme === 'light' ? 'active' : ''}
                      onClick={() => setTheme('light')}
                    >
                      ☀ {t('settings.light')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-label">
                  <h4>{t('settings.language')}</h4>
                  <p>{t('settings.language_desc')}</p>
                </div>
                <div className="settings-row-control">
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-label">
                  <h4>🎶 {t('my_music.title')}</h4>
                  <p>{t('settings.music_desc')}</p>
                </div>
                <div className="settings-row-control">
                  <button
                    type="button"
                    className="settings-action-btn"
                    onClick={() => {
                      onOpenMyMusic();
                      onClose();
                    }}
                  >
                    {t('settings.open')}
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-label">
                  <h4>📦 {t('settings.packs')}</h4>
                  <p>
                    {t('settings.packs_desc', {
                      loaded: loadedExtraCount,
                      total: AWESOME_PACKS.length,
                    })}
                  </p>
                </div>
                <div className="settings-row-control">
                  <button
                    type="button"
                    className="settings-action-btn"
                    onClick={() => {
                      onOpenPacks();
                      onClose();
                    }}
                  >
                    {t('settings.manage')}
                  </button>
                </div>
              </div>
            </>
          )}

          {section === 'midi' && (
            <div className="settings-midi">
              <div className="settings-midi-hero">
                <div className="settings-midi-icon">🎹</div>
                <h4>{t('midi.title')}</h4>
                <p>{t('midi.description')}</p>
              </div>
              <button
                type="button"
                className="confirm-ok primary"
                onClick={() => {
                  onOpenMidi();
                  onClose();
                }}
              >
                {t('midi.open_converter')}
              </button>
            </div>
          )}

          {section === 'credits' && (
            <div className="settings-credits">
              <p className="settings-credits-intro">
                {t('settings.credits_intro')}
              </p>
              <ul className="settings-credits-list">
                {CREDITS.map((c) => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      <strong>{c.name}</strong>
                      <span>{c.desc}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="settings-credits-license">
                Xpendia Studio — AGPL-3.0 ·{' '}
                <a
                  href="https://xpendia.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  xpendia.cl
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
