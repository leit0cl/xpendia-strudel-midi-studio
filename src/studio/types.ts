export type TrackType = 'drums' | 'arpeggio' | 'pad' | 'bass' | 'strings';

export type DrumsParams = {
  bank: string;
  pattern: string;
  accent: number;
};

export type ArpeggioParams = {
  notes: string[];
  mode: 'arpeggio' | 'chord';
  direction: 'up' | 'down' | 'updown' | 'random';
  speed: number;
  instrument: string;
};

export type PadParams = {
  notes: string[];
  instrument: string;
  reverb: number;
  slow: number;
};

export type BassParams = {
  notes: string[];
  mode: 'arpeggio' | 'chord';
  direction: 'up' | 'down' | 'updown' | 'random';
  speed: number;
  instrument: string;
};

export type StringsParams = {
  notes: string[];
  instrument: string;
  reverb: number;
  slow: number;
  tremolo: boolean;
};

export type TrackParams =
  | DrumsParams
  | ArpeggioParams
  | PadParams
  | BassParams
  | StringsParams;

export type Segment = {
  id: string;
  bars: number;       // duración en compases
  params: TrackParams;
  silent?: boolean;   // si true, el segmento suena como silencio durante `bars`
};

export type Track = {
  id: string;
  type: TrackType;
  name: string;
  muted: boolean;
  volume: number;       // 0..1
  segments: Segment[];  // siempre ≥1; si 1, no se usa arrange
};

export type StudioState = {
  tracks: Track[];
  bpm: number;
};
