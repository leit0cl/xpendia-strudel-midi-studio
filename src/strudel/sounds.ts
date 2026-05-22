// Helpers para leer el registry global de sonidos de superdough en runtime.
// Cuando el usuario activa un pack nuevo de la comunidad, esos samples
// aparecen aquí automáticamente.

import { soundMap } from 'superdough';

export type SoundInfo = {
  name: string;
  type?: string; // 'sample' | 'soundfont' | 'synth' (heurística)
  tag?: string;
};

// Heurística para detectar nombres "melódicos" (instrumentos con pitch)
// vs nombres puramente percusivos.
const DRUM_HINTS = /^(bd|sd|hh|cp|oh|cy|rim|lt|mt|ht|sh|cl|perc|kick|snare|hat|clap|cym|tom|ride|crash|conga|bongo|cowbell|shaker|tambour|click|claves?|stick|tabla|darbuka|cajon|gong|woodblock|agogo)$/i;
const KNOWN_MELODIC = new Set([
  'piano', 'piano1', 'kawai', 'steinway', 'fmpiano', 'clavisynth',
  'organ_full', 'organ_4inch', 'organ_8inch', 'pipeorgan_loud', 'pipeorgan_quiet',
  'harp', 'folkharp', 'marimba', 'vibraphone', 'vibraphone_bowed',
  'kalimba', 'kalimba2', 'kalimba3', 'kalimba4', 'kalimba5',
  'glockenspiel', 'tubularbells', 'tubularbells2',
  'sax', 'sax_vib', 'sax_stacc', 'saxello', 'saxello_vib', 'saxello_stacc',
  'harmonica', 'harmonica_soft', 'harmonica_vib',
  'ocarina', 'ocarina_vib', 'ocarina_small',
  'recorder_alto_sus', 'recorder_soprano_sus', 'recorder_alto_vib',
  'recorder_bass_sus', 'recorder_tenor_sus',
  'dantranh', 'dantranh_tremolo', 'balafon', 'balafon_soft', 'balafon_hard',
  'wineglass', 'wineglass_slow', 'didgeridoo', 'handbells', 'super64',
]);

function readMap(): Record<string, { onTrigger: unknown; data: { type?: string; tag?: string } }> {
  try {
    const m = soundMap as unknown as { get?: () => Record<string, { onTrigger: unknown; data: { type?: string; tag?: string } }> };
    return m.get?.() ?? {};
  } catch {
    return {};
  }
}

export function listAllSounds(): SoundInfo[] {
  const map = readMap();
  return Object.entries(map)
    .map(([name, val]) => ({
      name,
      type: val?.data?.type,
      tag: val?.data?.tag,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function listMelodicSounds(): SoundInfo[] {
  const all = listAllSounds();
  return all.filter((s) => {
    if (s.type === 'soundfont') return true;
    if (s.type === 'synth') return true;
    if (DRUM_HINTS.test(s.name)) return false;
    if (KNOWN_MELODIC.has(s.name)) return true;
    // bank-prefixed (RolandTR909_*) → no melodic
    if (/^(roland|akai|linn|casio|mpc|alesis|korg|emu)/i.test(s.name)) return false;
    // sample y no es percusivo conocido → asumimos melódico/sample crudo
    return s.type === 'sample';
  });
}

export function listDrumSounds(): SoundInfo[] {
  const all = listAllSounds();
  return all.filter((s) => {
    if (DRUM_HINTS.test(s.name)) return true;
    if (s.tag === 'drum-machines') return true;
    return false;
  });
}
