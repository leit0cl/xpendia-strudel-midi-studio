import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { play, stop, onTrigger, ensurePack } from './strudel/engine';
import { SettingsModal } from './settings/SettingsModal';
import { MidiConverterDialog } from './midi/MidiConverterDialog';
import { MidiPlayer } from './midi/MidiPlayer';
import { StrudelEditor, type StrudelEditorHandle } from './editor/StrudelEditor';
import { Palette } from './palette/Palette';
import { FxPanel } from './fx/FxPanel';
import { DancingMode } from './dancing/DancingMode';
import { Instructions } from './instructions/Instructions';
import {
  loadInitialCode,
  saveCode,
  loadInitialStudio,
  saveStudio,
  loadInitialMode,
  saveMode,
  type Mode,
} from './persistence';
import { TapBpm, setBpmInCode } from './tapBpm';
import { PRESETS } from './presets';
import { enableHydra, disableHydra, isHydraOn } from './visuals/hydra';
import { Studio } from './studio/Studio';
import { DEFAULT_STUDIO } from './studio/presets';
import { tracksToCode } from './studio/compile';
import type { StudioState } from './studio/types';
import { PacksPanel } from './studio/PacksPanel';
import { AWESOME_PACKS } from './strudel/sample-packs';
import { loadEnabledPacks } from './persistence';
import { Select } from './components/Select';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ExportMp3Dialog } from './record/ExportMp3Dialog';
import { SaveSongDialog } from './music/SaveSongDialog';
import { MyMusicPanel } from './music/MyMusicPanel';
import { saveCodeSong, saveStudioSong, type SavedSong } from './music/library';
import './App.css';

// .cpm() = cycles per minute. Como un ciclo tiene 4 beats, multiplicá por 4
// para tener BPM perceptual. Ej: .cpm(27.5) ≈ 110 BPM.
const HELLO = `stack(
  s("bd ~ bd ~"),
  s("~ cp ~ cp"),
  s("hh*8").gain(0.6),
).cpm(27.5) // 110 bpm`;

function App() {
  const { t } = useTranslation();
  const editorRef = useRef<StrudelEditorHandle>(null);
  const [mode, setMode] = useState<Mode>(() => loadInitialMode('studio'));
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [hydraOn, setHydraOn] = useState(false);
  const [packsOpen, setPacksOpen] = useState(false);
  const [loadedExtraCount, setLoadedExtraCount] = useState(() => loadEnabledPacks().length);
  const [exportOpen, setExportOpen] = useState(false);
  const [dancingOpen, setDancingOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [midiOpen, setMidiOpen] = useState(false);

  const codeRef = useRef('');
  const debounceRef = useRef<number | null>(null);
  const studioDebounceRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const tapper = useMemo(() => new TapBpm(), []);

  const initialCode = useMemo(() => loadInitialCode(HELLO), []);
  const initialStudio = useMemo(
    () => loadInitialStudio(DEFAULT_STUDIO as StudioState),
    [],
  );
  if (!codeRef.current) codeRef.current = initialCode;

  const [studio, setStudio] = useState<StudioState>(initialStudio);

  function showToast(msg: string, ms = 1800) {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), ms);
  }

  async function evalCode(code: string) {
    setError(null);
    try {
      await play(code);
      setStatus('playing');
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }

  const [starting, setStarting] = useState(false);
  async function onPlay() {
    setStarting(true);
    setStatus('loading');
    const code = mode === 'studio' ? tracksToCode(studio) : (editorRef.current?.getCode() ?? codeRef.current);
    try {
      await evalCode(code);
    } finally {
      window.setTimeout(() => setStarting(false), 420);
    }
  }

  const [stopping, setStopping] = useState(false);
  async function onStopClick() {
    setStopping(true);
    try {
      await stop();
      setStatus('idle');
    } finally {
      // Keep the pulse visible briefly so it never feels "no respondió".
      window.setTimeout(() => setStopping(false), 380);
    }
  }

  function onChange(code: string) {
    codeRef.current = code;
    saveCode(code);
    if (!live || status !== 'playing') return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => evalCode(code), 200);
  }

  function onInsert(snippet: string) {
    editorRef.current?.insertAtCursor(snippet);
  }

  function onStudioChange(next: StudioState) {
    setStudio(next);
    saveStudio(next);
    if (!live || status !== 'playing') return;
    if (studioDebounceRef.current) window.clearTimeout(studioDebounceRef.current);
    studioDebounceRef.current = window.setTimeout(
      () => evalCode(tracksToCode(next)),
      150,
    );
  }

  function onTap() {
    const bpm = tapper.tap();
    if (bpm === null) {
      showToast(t('toast.tap_pending'), 600);
      return;
    }
    if (mode === 'studio') {
      onStudioChange({ ...studio, bpm });
    } else {
      const newCode = setBpmInCode(editorRef.current?.getCode() ?? codeRef.current, bpm);
      editorRef.current?.setCode(newCode);
    }
    showToast(t('toast.tap_bpm', { bpm }));
  }

  function onReset() {
    setResetOpen(true);
  }
  function doReset() {
    if (mode === 'studio') {
      onStudioChange(DEFAULT_STUDIO as StudioState);
    } else {
      editorRef.current?.setCode(HELLO);
    }
    tapper.reset();
    setResetOpen(false);
  }

  async function onSaveSong(name: string) {
    if (mode === 'studio') {
      await saveStudioSong(name, studio);
    } else {
      const code = editorRef.current?.getCode() ?? codeRef.current;
      await saveCodeSong(name, code);
    }
    showToast(t('save_dialog.saved'));
  }

  function onLoadSavedSong(song: SavedSong) {
    if (song.kind === 'studio-song') {
      if (mode !== 'studio') {
        setMode('studio');
        saveMode('studio');
      }
      onStudioChange(song.state);
    } else {
      if (mode !== 'code') {
        setMode('code');
        saveMode('code');
      }
      editorRef.current?.setCode(song.code);
      codeRef.current = song.code;
      saveCode(song.code);
      if (status === 'playing') evalCode(song.code);
    }
    showToast(t('my_music.loaded', { name: song.name }));
  }

  function onLoadPreset(id: string) {
    if (!id) return;
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    editorRef.current?.setCode(preset.code);
    codeRef.current = preset.code;
    saveCode(preset.code);
    // If currently playing, swap the loop in real time so the previous
    // pattern stops sounding and the new one takes over.
    if (status === 'playing') evalCode(preset.code);
    showToast(t('header.preset_loaded', { label: preset.label }));
  }

  function onChangeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    saveMode(next);
    // si estaba sonando, recompilar con la fuente del modo nuevo
    if (status === 'playing') {
      const code =
        next === 'studio' ? tracksToCode(studio) : codeRef.current || tracksToCode(studio);
      window.setTimeout(() => evalCode(code), 100);
    }
  }

  async function onToggleHydra() {
    try {
      if (isHydraOn()) {
        disableHydra();
        setHydraOn(false);
        showToast(t('header.visuals_off'));
      } else {
        showToast(t('header.visuals_loading'));
        await enableHydra();
        setHydraOn(true);
        showToast(t('header.visuals_on'));
      }
    } catch (e) {
      showToast(
        t('header.visuals_error', {
          message: e instanceof Error ? e.message : String(e),
        }),
        3000,
      );
    }
  }

  // Al boot, recargar packs habilitados de sesiones anteriores en background.
  useEffect(() => {
    const enabled = loadEnabledPacks();
    if (!enabled.length) return;
    for (const id of enabled) {
      const pack = AWESOME_PACKS.find((p) => p.id === id);
      if (!pack) continue;
      ensurePack(pack.shortcut).catch(() => {
        // silencioso — si falla, el usuario lo verá al abrir el panel
      });
    }
  }, []);

  useEffect(() => {
    const unsub = onTrigger(({ hap }) => {
      const locs = hap.context?.locations;
      if (!locs || !locs.length) return;
      for (const loc of locs) {
        editorRef.current?.flash(loc.start, loc.end);
      }
    });
    return () => {
      unsub();
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (studioDebounceRef.current) window.clearTimeout(studioDebounceRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="brand-logo" aria-label="Xpendia Studio">
            <span className="b-open">{'{'}</span>
            <span className="b-name">Xpendia</span>
            <span className="b-close">{'}'}</span>
          </div>
          <div className="brand-sub">
            <strong>{t('brand.studio')}</strong>
            <span className="dot" />
            {t('brand.tagline')}
          </div>
        </div>
        <div className="header-right">
          <div className="mode-toggle">
            <button
              className={mode === 'studio' ? 'active' : ''}
              onClick={() => onChangeMode('studio')}
            >
              {t('header.mode_studio')}
            </button>
            <button
              className={mode === 'code' ? 'active' : ''}
              onClick={() => onChangeMode('code')}
            >
              {t('header.mode_code')}
            </button>
          </div>
          {mode === 'code' && (
            <Select
              className="presets"
              value=""
              placeholder={t('header.load_loop_placeholder')}
              onChange={(v) => {
                if (v) onLoadPreset(v);
              }}
              options={(() => {
                const m = new Map<string, { value: string; label: string }[]>();
                for (const p of PRESETS) {
                  if (!m.has(p.category)) m.set(p.category, []);
                  m.get(p.category)!.push({ value: p.id, label: p.label });
                }
                return Array.from(m.entries()).map(([label, options]) => ({ label, options }));
              })()}
              searchable
              ariaLabel={t('header.load_loop_aria')}
            />
          )}
          <button
            className={`ghost ${hydraOn ? 'on' : ''}`}
            onClick={onToggleHydra}
            title={t('header.visuals_title')}
          >
            {t('header.visuals')}
          </button>
          <button
            className="ghost"
            onClick={() => setSaveOpen(true)}
            title={t('my_music.save_title')}
          >
            {t('my_music.save_button')}
          </button>
          <button
            className="ghost"
            onClick={() => setExportOpen(true)}
            title={t('header.mp3_title')}
          >
            {t('header.mp3')}
          </button>
          <button
            className="ghost"
            onClick={() => setDancingOpen(true)}
            title={t('header.dancing_title')}
          >
            {t('header.dancing')}
          </button>
          <button
            className="ghost"
            onClick={() => setSettingsOpen(true)}
            title={t('settings.button_title')}
          >
            {t('settings.button')}
          </button>
          <button className="ghost" onClick={onReset} title={t('common.reset_title')}>
            ⟲ {t('common.reset')}
          </button>
          {mode === 'code' && (
            <label className="live-toggle">
              <input
                type="checkbox"
                checked={live}
                onChange={(e) => setLive(e.target.checked)}
              />
              {t('common.live')}
            </label>
          )}
          {status !== 'idle' && (
            <span className={`badge ${status}`}>{t(`header.status_${status}`)}</span>
          )}
        </div>
      </header>

      <div className="layout">
        {mode === 'studio' ? (
          <main className="studio-main">
            <Studio state={studio} onChange={onStudioChange} />
            <div className="controls">
              <button
                onClick={onPlay}
                disabled={status === 'loading'}
                className={`play-btn ${starting ? 'is-starting' : ''}`}
              >
                {status === 'loading' ? t('common.loading') : `▶ ${t('common.play')}`}
              </button>
              <button
                onClick={onStopClick}
                className={`stop-btn ${stopping ? 'is-stopping' : ''}`}
              >
                ■ {t('common.stop')}
              </button>
              <button onClick={onTap} className="tap" title={t('common.tap_title')}>
                ♪ {t('common.tap')}
              </button>
            </div>
            {error && <pre className="error">{error}</pre>}
            <FxPanel />
            <MidiPlayer onConvert={() => setMidiOpen(true)} />
            <Instructions mode={mode} />
          </main>
        ) : (
          <>
            <Palette onInsert={onInsert} />
            <main>
              <StrudelEditor
                ref={editorRef}
                initialCode={initialCode}
                onChange={onChange}
                onSubmit={(c) => evalCode(c)}
              />
              <div className="controls">
                <button
                  onClick={onPlay}
                  disabled={status === 'loading'}
                  className={`play-btn ${starting ? 'is-starting' : ''}`}
                >
                  {status === 'loading' ? t('common.loading') : `▶ ${t('common.play')}`}
                </button>
                <button
                  onClick={onStopClick}
                  className={`stop-btn ${stopping ? 'is-stopping' : ''}`}
                >
                ■ {t('common.stop')}
              </button>
                <button onClick={onTap} className="tap" title={t('common.tap_title')}>
                  ♪ {t('common.tap')}
                </button>
              </div>
              {error && <pre className="error">{error}</pre>}
              <FxPanel />
              <MidiPlayer onConvert={() => setMidiOpen(true)} />
              <Instructions mode={mode} />
            </main>
          </>
        )}
      </div>

      <PacksPanel
        open={packsOpen}
        onClose={() => setPacksOpen(false)}
        onChange={(n) => setLoadedExtraCount(n)}
      />

      <ExportMp3Dialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        code={
          mode === 'studio'
            ? tracksToCode(studio)
            : editorRef.current?.getCode() ?? codeRef.current
        }
        defaultDuration={mode === 'studio' ? 16 : 16}
        filenameHint={mode === 'studio' ? 'strudel-studio' : 'strudel-code'}
      />

      <ConfirmDialog
        open={resetOpen}
        icon="⟲"
        title={t('reset_dialog.title')}
        message={t('reset_dialog.message')}
        confirmLabel={t('reset_dialog.confirm')}
        variant="danger"
        onConfirm={doReset}
        onCancel={() => setResetOpen(false)}
      />

      <SaveSongDialog
        open={saveOpen}
        kind={mode === 'studio' ? 'studio-song' : 'code-song'}
        onClose={() => setSaveOpen(false)}
        onSave={onSaveSong}
      />

      <MyMusicPanel
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onLoad={onLoadSavedSong}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        loadedExtraCount={loadedExtraCount}
        onOpenMyMusic={() => setLibraryOpen(true)}
        onOpenPacks={() => setPacksOpen(true)}
        onOpenMidi={() => setMidiOpen(true)}
      />

      <MidiConverterDialog
        open={midiOpen}
        onClose={() => setMidiOpen(false)}
        onLoadIntoEditor={(code) => {
          if (mode !== 'code') {
            setMode('code');
            saveMode('code');
          }
          editorRef.current?.setCode(code);
          codeRef.current = code;
          saveCode(code);
        }}
      />

      {toast && <div className="toast">{toast}</div>}

      {dancingOpen && <DancingMode onClose={() => setDancingOpen(false)} />}

      <footer className="brand-footer">
        <div className="footer-pitch">
          <span className="lab-tag">{t('footer.lab')}</span>
          <span>
            <em>{t('footer.tagline_strong')}</em> {t('footer.tagline_rest')}
          </span>
        </div>
        <div className="footer-meta">
          <span className="license">{t('footer.license')}</span>
          <span className="sep" />
          <a
            href="https://strudel.cc"
            target="_blank"
            rel="noopener noreferrer"
            title={t('footer.strudel_title')}
          >
            {t('footer.powered')}
          </a>
          <span className="sep" />
          <a href="https://xpendia.cl" target="_blank" rel="noopener noreferrer">
            xpendia.cl
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
