import type {
  ArpeggioParams,
  BassParams,
  DrumsParams,
  PadParams,
  Segment,
  StringsParams,
  StudioState,
  Track,
} from './types';
import { DRUM_PATTERNS } from './presets';

function arrangeNotes(notes: string[], direction: ArpeggioParams['direction']): string {
  if (notes.length === 0) return '~';
  switch (direction) {
    case 'down':
      return [...notes].reverse().join(' ');
    case 'updown': {
      const reversed = [...notes].slice(1, -1).reverse();
      return [...notes, ...reversed].join(' ');
    }
    case 'random':
      return `[${notes.join(' ')}]?`;
    case 'up':
    default:
      return notes.join(' ');
  }
}

function chordTokens(notes: string[]): string {
  if (notes.length === 0) return '~';
  return `[${notes.join(',')}]`;
}

function roundN(n: number, decimals = 2): number {
  const k = 10 ** decimals;
  return Math.round(n * k) / k;
}

function compileDrums(p: DrumsParams, volume: number): string {
  const pattern = DRUM_PATTERNS[p.pattern] ?? 'bd*4';
  const bankSuffix = p.bank !== 'dirt' ? `.bank("${p.bank}")` : '';
  return `s("${pattern}")${bankSuffix}.gain(${roundN(volume)})`;
}

function compileArpeggio(p: ArpeggioParams, volume: number): string {
  const mode = p.mode ?? 'arpeggio';
  if (mode === 'chord') {
    const stack = chordTokens(p.notes);
    const fast = p.speed !== 1 ? `.fast(${p.speed})` : '';
    return `note("${stack}").s("${p.instrument}")${fast}.gain(${roundN(volume)})`;
  }
  const arranged = arrangeNotes(p.notes, p.direction);
  return `note("${arranged}").s("${p.instrument}").fast(${p.speed}).gain(${roundN(volume)})`;
}

function compilePad(p: PadParams, volume: number): string {
  const expr = chordTokens(p.notes);
  const room = p.reverb > 0 ? `.room(${roundN(p.reverb)})` : '';
  const slow = p.slow > 1 ? `.slow(${p.slow})` : '';
  return `note("${expr}").s("${p.instrument}")${room}${slow}.gain(${roundN(volume)})`;
}

function compileBass(p: BassParams, volume: number): string {
  const mode = p.mode ?? 'arpeggio';
  if (mode === 'chord') {
    const stack = chordTokens(p.notes);
    const fast = p.speed !== 1 ? `.fast(${p.speed})` : '';
    return `note("${stack}").s("${p.instrument}")${fast}.gain(${roundN(volume)})`;
  }
  const arranged = arrangeNotes(p.notes, p.direction);
  const fast = p.speed !== 1 ? `.fast(${p.speed})` : '';
  return `note("${arranged}").s("${p.instrument}")${fast}.gain(${roundN(volume)})`;
}

function compileStrings(p: StringsParams, volume: number): string {
  const expr = chordTokens(p.notes);
  const room = p.reverb > 0 ? `.room(${roundN(p.reverb)})` : '';
  const slow = p.slow > 1 ? `.slow(${p.slow})` : '';
  const trem = p.tremolo ? '.fast(8)' : '';
  return `note("${expr}").s("${p.instrument}")${room}${slow}${trem}.gain(${roundN(volume)})`;
}

function compileSegment(t: Track, seg: Segment): string | null {
  if (seg.silent) return 'silence';
  try {
    switch (t.type) {
      case 'drums':
        return compileDrums(seg.params as DrumsParams, t.volume);
      case 'arpeggio':
        return compileArpeggio(seg.params as ArpeggioParams, t.volume);
      case 'pad':
        return compilePad(seg.params as PadParams, t.volume);
      case 'bass':
        return compileBass(seg.params as BassParams, t.volume);
      case 'strings':
        return compileStrings(seg.params as StringsParams, t.volume);
    }
  } catch {
    return null;
  }
}

function compileTrack(t: Track): string | null {
  if (!t.segments || t.segments.length === 0) return null;
  if (t.segments.length === 1) {
    const only = t.segments[0];
    if (only.silent) return null; // pista con un único bloque silencioso ⇒ se omite
    return compileSegment(t, only);
  }
  const parts: string[] = [];
  for (const seg of t.segments) {
    const c = compileSegment(t, seg);
    if (c) parts.push(`[${seg.bars}, ${c}]`);
  }
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0].replace(/^\[\d+,\s*/, '').replace(/\]$/, '');
  return `arrange(\n    ${parts.join(',\n    ')}\n  )`;
}

// Strudel mide "cycles per minute". Como nuestros patrones tienen 4 beats por
// ciclo (estándar 4/4), un BPM "real" se convierte a CPM dividiendo por 4.
function bpmToCpm(bpm: number): number {
  return Math.round((bpm / 4) * 100) / 100;
}

export function tracksToCode(state: StudioState): string {
  const cpm = bpmToCpm(state.bpm);
  const lines = state.tracks
    .filter((t) => !t.muted)
    .map(compileTrack)
    .filter((s): s is string => !!s);

  if (lines.length === 0) {
    return `silence.cpm(${cpm})`;
  }
  if (lines.length === 1) {
    return `${lines[0]}.cpm(${cpm})`;
  }
  return `stack(\n  ${lines.join(',\n  ')}\n).cpm(${cpm})`;
}
