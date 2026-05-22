import { useState } from 'react';
import type { StudioState, Track, TrackType, TrackParams } from './types';
import { TrackCard } from './TrackCard';
import { AddTrackMenu } from './AddTrackMenu';

let idCounter = Date.now();
const newId = (prefix = 't') => `${prefix}${++idCounter}`;

function defaultParams(type: TrackType): TrackParams {
  switch (type) {
    case 'drums':
      return { bank: 'RolandTR909', pattern: '4-floor', accent: 0.7 };
    case 'arpeggio':
      return {
        notes: ['c3', 'e3', 'g3', 'b3'],
        mode: 'arpeggio',
        direction: 'up',
        speed: 2,
        instrument: 'piano',
      };
    case 'pad':
      return {
        notes: ['c3', 'e3', 'g3'],
        instrument: 'pipeorgan_quiet',
        reverb: 0.7,
        slow: 4,
      };
    case 'bass':
      return {
        notes: ['c2', 'g2'],
        mode: 'arpeggio',
        direction: 'up',
        speed: 1,
        instrument: 'gm_electric_bass_finger',
      };
    case 'strings':
      return {
        notes: ['c3', 'e3', 'g3'],
        instrument: 'gm_string_ensemble_1',
        reverb: 0.6,
        slow: 4,
        tremolo: false,
      };
  }
}

const TRACK_DEFAULTS: Record<TrackType, { name: string; volume: number }> = {
  drums: { name: 'Drums', volume: 0.85 },
  arpeggio: { name: 'Melodía', volume: 0.6 },
  pad: { name: 'Pad', volume: 0.5 },
  bass: { name: 'Bajo', volume: 0.7 },
  strings: { name: 'Cuerdas', volume: 0.55 },
};

function newTrack(type: TrackType): Track {
  const { name, volume } = TRACK_DEFAULTS[type];
  return {
    id: newId('t'),
    type,
    name,
    muted: false,
    volume,
    segments: [
      { id: newId('s'), bars: 4, params: defaultParams(type) },
    ],
  };
}

export function Studio({
  state,
  onChange,
}: {
  state: StudioState;
  onChange: (s: StudioState) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);

  const updateTrack = (i: number, t: Track) => {
    const tracks = state.tracks.slice();
    tracks[i] = t;
    onChange({ ...state, tracks });
  };

  const deleteTrack = (i: number) => {
    const tracks = state.tracks.slice();
    tracks.splice(i, 1);
    onChange({ ...state, tracks });
  };

  const addTrack = (type: TrackType) => {
    onChange({ ...state, tracks: [...state.tracks, newTrack(type)] });
    setShowAdd(false);
  };

  return (
    <div className="studio">
      <div className="studio-controls">
        <label className="bpm-input">
          <span>BPM</span>
          <input
            type="number"
            min={40}
            max={220}
            value={state.bpm}
            onChange={(e) => onChange({ ...state, bpm: parseInt(e.target.value, 10) || 110 })}
          />
        </label>
      </div>

      <div className="studio-tracks">
        {state.tracks.map((t, i) => (
          <TrackCard
            key={t.id}
            track={t}
            onChange={(nt) => updateTrack(i, nt)}
            onDelete={() => deleteTrack(i)}
          />
        ))}
      </div>

      {showAdd ? (
        <div className="studio-add">
          <AddTrackMenu onAdd={addTrack} />
          <button type="button" className="ghost" onClick={() => setShowAdd(false)}>
            cancelar
          </button>
        </div>
      ) : (
        <button type="button" className="add-track-btn" onClick={() => setShowAdd(true)}>
          + agregar pista
        </button>
      )}
    </div>
  );
}

// Helpers expuestos para TrackCard
export function newSegmentId(): string {
  return newId('s');
}

export function defaultSegmentParams(type: TrackType): TrackParams {
  return defaultParams(type);
}
