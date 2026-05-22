import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Midi } from '@tonejs/midi';
import {
  getAudioContext as sdGetAudioContext,
  getSuperdoughAudioController,
} from 'superdough';
import { boot } from '../strudel/engine';
import { setSharedMidi } from './sharedMidi';

interface Props {
  /** Open the MIDI → Strudel converter dialog with the currently loaded file. */
  onConvert: () => void;
}

interface PlayerState {
  ctx: AudioContext;
  master: GainNode;
  scheduled: OscillatorNode[];
  startedAt: number;
  duration: number;
}

function midiNoteToFreq(n: number): number {
  return 440 * Math.pow(2, (n - 69) / 12);
}

export function MidiPlayer({ onConvert }: Props) {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState<string | null>(null);
  const [midi, setMidi] = useState<Midi | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<PlayerState | null>(null);
  const rafRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function stopAll() {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const p = playerRef.current;
    if (!p) return;
    try {
      p.master.gain.cancelScheduledValues(p.ctx.currentTime);
      p.master.gain.linearRampToValueAtTime(0, p.ctx.currentTime + 0.04);
    } catch {}
    setTimeout(() => {
      for (const node of p.scheduled) {
        try { node.stop(); } catch {}
        try { node.disconnect(); } catch {}
      }
      try { p.master.disconnect(); } catch {}
    }, 60);
    playerRef.current = null;
  }

  useEffect(() => () => stopAll(), []);

  async function handleFile(file: File) {
    if (!/\.(mid|midi)$/i.test(file.name)) {
      setError(t('midi.bad_file'));
      return;
    }
    try {
      const buf = await file.arrayBuffer();
      const m = new Midi(buf);
      setMidi(m);
      setFileName(file.name);
      setError(null);
      setProgress(0);
      // Make the loaded file available to the converter dialog.
      setSharedMidi(buf.slice(0), file.name);
      if (playing) stop();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function play() {
    if (!midi) return;
    stopAll();

    // Use the SAME AudioContext + destinationGain as superdough so the shared
    // AnalyserNode (osciloscopio + espectro) reacts to the MIDI playback too.
    await boot();
    const ctx = sdGetAudioContext() as AudioContext;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch {}
    }
    const controller = getSuperdoughAudioController() as {
      output: { destinationGain: AudioNode };
    };
    const destGain = controller.output.destinationGain;

    const master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(destGain);

    const scheduled: OscillatorNode[] = [];
    const startAt = ctx.currentTime + 0.05;
    let maxEnd = 0;

    for (const track of midi.tracks) {
      if (track.channel === 9) continue; // skip drums (channel 10)
      for (const note of track.notes) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = midiNoteToFreq(note.midi);
        const t0 = startAt + note.time;
        const t1 = t0 + Math.max(0.04, note.duration);
        const vel = Math.min(1, Math.max(0.05, note.velocity)) * 0.18;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(vel, t0 + 0.008);
        g.gain.linearRampToValueAtTime(vel * 0.55, t0 + Math.min(0.08, note.duration * 0.5));
        g.gain.linearRampToValueAtTime(0.0001, t1);
        osc.connect(g).connect(master);
        osc.start(t0);
        osc.stop(t1 + 0.02);
        scheduled.push(osc);
        if (t1 > maxEnd) maxEnd = t1;
      }
    }

    playerRef.current = {
      ctx,
      master,
      scheduled,
      startedAt: startAt,
      duration: maxEnd - startAt,
    };

    setPlaying(true);
    const tick = () => {
      const p = playerRef.current;
      if (!p) return;
      const elapsed = p.ctx.currentTime - p.startedAt;
      if (elapsed >= p.duration) {
        stopAll();
        setPlaying(false);
        setProgress(1);
        return;
      }
      setProgress(Math.max(0, elapsed / p.duration));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function stop() {
    stopAll();
    setPlaying(false);
  }

  const duration = playerRef.current?.duration ?? 0;
  const elapsed = playerRef.current && playing
    ? Math.min(duration, playerRef.current.ctx.currentTime - playerRef.current.startedAt)
    : progress * duration;

  function fmt(s: number): string {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div className="midi-player">
      <div className="midi-player-header">
        <span className="midi-player-icon">🎼</span>
        <h3>{t('midi_player.title')}</h3>
        <span className="midi-player-sub">{t('midi_player.subtitle')}</span>
      </div>

      <div className="midi-player-body">
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

        <button
          type="button"
          className="midi-player-load"
          onClick={() => inputRef.current?.click()}
        >
          📂 {fileName ?? t('midi_player.choose_file')}
        </button>

        {error && <div className="midi-error">⚠ {error}</div>}

        {midi && (
          <>
            <div className="midi-player-controls">
              {playing ? (
                <button
                  type="button"
                  className="midi-player-btn stop"
                  onClick={stop}
                >
                  ■ {t('common.stop')}
                </button>
              ) : (
                <button
                  type="button"
                  className="midi-player-btn play"
                  onClick={play}
                >
                  ▶ {t('common.play')}
                </button>
              )}
              <button
                type="button"
                className="midi-player-btn convert"
                onClick={onConvert}
                title={t('midi_player.convert_title')}
              >
                🪄 {t('midi_player.convert')}
              </button>
              <div className="midi-player-time">
                <span>{fmt(elapsed)}</span>
                <span className="sep">/</span>
                <span>{fmt(duration || midi.duration)}</span>
              </div>
            </div>
            <div className="midi-player-progress">
              <div
                className="midi-player-progress-fill"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="midi-player-meta">
              <span>{midi.tracks.length} {t('midi_player.tracks')}</span>
              <span className="sep">·</span>
              <span>{midi.header.tempos[0]?.bpm.toFixed(0) ?? '120'} bpm</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
