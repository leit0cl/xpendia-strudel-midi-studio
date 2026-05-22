// Acordes con voicings simples en una octava media.
export const CHORDS: Record<string, string[]> = {
  // Tríadas mayores
  'C':       ['c3', 'e3', 'g3'],
  'D':       ['d3', 'f#3', 'a3'],
  'E':       ['e3', 'g#3', 'b3'],
  'F':       ['f3', 'a3', 'c4'],
  'G':       ['g3', 'b3', 'd4'],
  'A':       ['a3', 'c#4', 'e4'],
  'B':       ['b3', 'd#4', 'f#4'],
  // Tríadas menores
  'Cm':      ['c3', 'eb3', 'g3'],
  'Dm':      ['d3', 'f3', 'a3'],
  'Em':      ['e3', 'g3', 'b3'],
  'Fm':      ['f3', 'ab3', 'c4'],
  'Gm':      ['g3', 'bb3', 'd4'],
  'Am':      ['a3', 'c4', 'e4'],
  'Bm':      ['b3', 'd4', 'f#4'],
  // Séptimas
  'Cmaj7':   ['c3', 'e3', 'g3', 'b3'],
  'Dm7':     ['d3', 'f3', 'a3', 'c4'],
  'Em7':     ['e3', 'g3', 'b3', 'd4'],
  'Fmaj7':   ['f3', 'a3', 'c4', 'e4'],
  'G7':      ['g3', 'b3', 'd4', 'f4'],
  'Am7':     ['a3', 'c4', 'e4', 'g4'],
  'Bm7b5':   ['b3', 'd4', 'f4', 'a4'],
  // Otras útiles
  'E7':      ['e3', 'g#3', 'b3', 'd4'],
  'A7':      ['a3', 'c#4', 'e4', 'g4'],
  'D7':      ['d3', 'f#3', 'a3', 'c4'],
};

export const CHORD_NAMES = Object.keys(CHORDS);

// Escalas (todas comienzan en C; el usuario puede transponer mentalmente).
export const SCALES: Record<string, string[]> = {
  'C major':    ['c3','d3','e3','f3','g3','a3','b3','c4'],
  'C minor':    ['c3','d3','eb3','f3','g3','ab3','bb3','c4'],
  'C dorian':   ['c3','d3','eb3','f3','g3','a3','bb3','c4'],
  'C phrygian': ['c3','db3','eb3','f3','g3','ab3','bb3','c4'],
  'C lydian':   ['c3','d3','e3','f#3','g3','a3','b3','c4'],
  'A minor':    ['a3','b3','c4','d4','e4','f4','g4','a4'],
  'D dorian':   ['d3','e3','f3','g3','a3','b3','c4','d4'],
};

export const SCALE_NAMES = Object.keys(SCALES);
