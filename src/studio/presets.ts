export type DrumBank = { id: string; label: string; category: string };

export const DRUM_BANKS: DrumBank[] = [
  // Roland
  { category: 'Roland', id: 'RolandTR909', label: 'TR-909' },
  { category: 'Roland', id: 'RolandTR808', label: 'TR-808' },
  { category: 'Roland', id: 'RolandTR707', label: 'TR-707' },
  { category: 'Roland', id: 'RolandTR727', label: 'TR-727 (latin)' },
  { category: 'Roland', id: 'RolandTR606', label: 'TR-606' },
  { category: 'Roland', id: 'RolandTR626', label: 'TR-626' },
  { category: 'Roland', id: 'RolandTR505', label: 'TR-505' },
  { category: 'Roland', id: 'RolandTR77', label: 'TR-77' },
  { category: 'Roland', id: 'RolandTR33', label: 'TR-33' },
  { category: 'Roland', id: 'RolandTR55', label: 'TR-55' },
  { category: 'Roland', id: 'RolandCompurhythm1000', label: 'CR-1000' },
  { category: 'Roland', id: 'RolandCompurhythm78', label: 'CR-78' },
  { category: 'Roland', id: 'RolandCompurhythm8000', label: 'CR-8000' },
  { category: 'Roland', id: 'RolandMC202', label: 'MC-202' },
  { category: 'Roland', id: 'RolandMC909', label: 'MC-909' },

  // Linn / Akai
  { category: 'Linn / Akai', id: 'LinnLM1', label: 'LinnDrum LM-1' },
  { category: 'Linn / Akai', id: 'LinnLM2', label: 'LinnDrum LM-2' },
  { category: 'Linn / Akai', id: 'AkaiLinn', label: 'Akai Linn' },
  { category: 'Linn / Akai', id: 'AkaiMPC60', label: 'MPC60' },
  { category: 'Linn / Akai', id: 'AkaiXR10', label: 'Akai XR10' },

  // Korg
  { category: 'Korg', id: 'KorgKPR77', label: 'KPR-77' },
  { category: 'Korg', id: 'KorgKR55', label: 'KR-55' },
  { category: 'Korg', id: 'KorgMinipops', label: 'Mini Pops' },
  { category: 'Korg', id: 'KorgPoly61', label: 'Poly-61' },
  { category: 'Korg', id: 'KorgT3', label: 'T3' },

  // Yamaha
  { category: 'Yamaha', id: 'YamahaRX21', label: 'RX-21' },
  { category: 'Yamaha', id: 'YamahaRX5', label: 'RX-5' },
  { category: 'Yamaha', id: 'YamahaRY30', label: 'RY-30' },

  // Boss
  { category: 'Boss', id: 'BossDR55', label: 'DR-55' },
  { category: 'Boss', id: 'BossDR110', label: 'DR-110' },
  { category: 'Boss', id: 'BossDR220', label: 'DR-220' },
  { category: 'Boss', id: 'BossDR550', label: 'DR-550' },
  { category: 'Boss', id: 'BossDR660', label: 'DR-660' },

  // Alesis
  { category: 'Alesis', id: 'AlesisHR16', label: 'HR-16' },
  { category: 'Alesis', id: 'AlesisSR16', label: 'SR-16' },

  // E-MU / Oberheim / Sequential
  { category: 'Vintage', id: 'EmuDrumulator', label: 'E-mu Drumulator' },
  { category: 'Vintage', id: 'EmuSP12', label: 'E-mu SP-12' },
  { category: 'Vintage', id: 'EmuModular', label: 'E-mu Modular' },
  { category: 'Vintage', id: 'OberheimDMX', label: 'Oberheim DMX' },
  { category: 'Vintage', id: 'SequentialCircuitsDrumtraks', label: 'Drumtraks' },
  { category: 'Vintage', id: 'SequentialCircuitsTom', label: 'Sequential Tom' },

  // Casio / otros
  { category: 'Otros', id: 'CasioRZ1', label: 'Casio RZ-1' },
  { category: 'Otros', id: 'MFB512', label: 'MFB-512' },
  { category: 'Otros', id: 'ViscoSpaceDrum', label: 'Visco Space Drum' },
  { category: 'Otros', id: 'RhythmAce', label: 'Rhythm Ace' },

  // Default
  { category: 'Default', id: 'dirt', label: 'Dirt (default)' },
];

export type DrumPattern = {
  id: string;
  label: string;
  category: string;
  pattern: string;
};

export const DRUM_PATTERN_LIST: DrumPattern[] = [
  // Rock
  { category: 'Rock', id: 'rock-basic', label: 'rock básico', pattern: 'bd ~ sd ~, hh*8' },
  { category: 'Rock', id: 'rock-driving', label: 'rock empuje', pattern: 'bd ~ bd sd, hh*8' },
  { category: 'Rock', id: 'rock-power', label: 'rock potente', pattern: 'bd bd sd ~, hh*8' },
  { category: 'Rock', id: 'rock-half', label: 'rock half-time', pattern: 'bd ~ ~ sd, hh*4' },
  { category: 'Rock', id: 'rock-shuffle', label: 'rock shuffle', pattern: 'bd ~ ~ sd, hh*6' },
  { category: 'Rock', id: 'rock-stadium', label: 'rock estadio', pattern: 'bd ~ sd ~ bd ~ sd sd, hh*8, ~ ~ ~ ~ ~ ~ ~ cy' },
  { category: 'Rock', id: 'punk', label: 'punk', pattern: 'bd bd sd sd, hh*8' },
  { category: 'Rock', id: 'metal', label: 'metal doble', pattern: 'bd*2 sd bd*2 sd, hh*16' },

  // Pop
  { category: 'Pop', id: 'pop-basic', label: 'pop básico', pattern: 'bd ~ sd ~, hh*8' },
  { category: 'Pop', id: 'pop-disco', label: 'pop disco', pattern: 'bd*4, ~ cp ~ cp, hh*8' },
  { category: 'Pop', id: 'pop-clap', label: 'pop con palmas', pattern: 'bd ~ ~ bd ~ ~ ~ ~, ~ ~ cp ~, hh*8' },
  { category: 'Pop', id: 'pop-modern', label: 'pop moderno', pattern: 'bd ~ ~ ~ ~ ~ sd ~, hh*16' },
  { category: 'Pop', id: 'pop-dance', label: 'pop bailable', pattern: 'bd*4, ~ ~ sd ~ ~ ~ sd ~, hh*16' },
  { category: 'Pop', id: 'pop-snap', label: 'pop con snaps', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ ~ sd ~, hh*8' },

  // Balada
  { category: 'Balada', id: 'ballad-soft', label: 'balada suave', pattern: 'bd ~ ~ ~ sd ~ ~ ~, hh*4' },
  { category: 'Balada', id: 'ballad-classic', label: 'balada clásica', pattern: 'bd ~ ~ ~ ~ ~ sd ~, hh*4' },
  { category: 'Balada', id: 'ballad-6-8', label: 'balada 6/8', pattern: 'bd ~ ~ sd ~ ~, hh*6' },
  { category: 'Balada', id: 'ballad-power', label: 'power ballad', pattern: 'bd ~ sd ~ ~ ~ sd ~, hh*8' },
  { category: 'Balada', id: 'ballad-rim', label: 'balada con rim', pattern: 'bd ~ ~ ~ rim ~ ~ ~, hh*8' },
  { category: 'Balada', id: 'ballad-modern', label: 'balada moderna', pattern: 'bd ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ sd ~, hh*8' },
  { category: 'Balada', id: 'ballad-arena', label: 'balada arena', pattern: 'bd ~ sd ~ ~ ~ sd ~, hh*4, ~ ~ ~ cy' },
  { category: 'Balada', id: 'ballad-country', label: 'balada country', pattern: 'bd ~ rim ~ sd ~ rim ~, hh*8' },
  { category: 'Balada', id: 'slow-rock', label: 'slow rock', pattern: 'bd ~ ~ ~ sd ~ ~ ~ bd ~ bd ~ sd ~ ~ ~, hh*8' },

  // Bolero
  { category: 'Bolero', id: 'bolero', label: 'bolero clásico', pattern: 'bd ~ ~ bd ~ ~ ~ ~, ~ rim ~ rim ~ rim ~ rim, hh*8' },
  { category: 'Bolero', id: 'bolero-ranchero', label: 'bolero ranchero', pattern: 'bd ~ ~ sd ~ ~ bd ~, hh*4' },
  { category: 'Bolero', id: 'bolero-son', label: 'bolero-son', pattern: 'bd ~ ~ bd ~ bd ~ ~, ~ rim ~ rim ~ ~ rim ~' },
  { category: 'Bolero', id: 'bolero-trio', label: 'bolero trío', pattern: 'bd ~ ~ ~ rim ~ ~ ~ bd ~ ~ ~ sd ~ ~ ~, hh*4' },

  // Tango/Vals
  { category: 'Tango/Vals', id: 'vals', label: 'vals 3/4', pattern: 'bd ~ ~ rim rim ~, hh*3' },
  { category: 'Tango/Vals', id: 'vals-lento', label: 'vals lento', pattern: 'bd ~ ~ ~ rim ~, hh*6' },
  { category: 'Tango/Vals', id: 'tango', label: 'tango clásico', pattern: 'bd ~ bd ~ sd ~ ~ ~, hh*4' },
  { category: 'Tango/Vals', id: 'milonga', label: 'milonga', pattern: 'bd ~ ~ bd sd ~ ~ sd, hh*8' },

  // Latin lento
  { category: 'Latin lento', id: 'son-cubano', label: 'son cubano', pattern: 'bd ~ ~ bd ~ bd ~ ~, ~ rim ~ ~ rim ~ rim ~' },
  { category: 'Latin lento', id: 'rumba-lenta', label: 'rumba lenta', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ rim ~ rim ~ rim ~ ~' },
  { category: 'Latin lento', id: 'bossa-lenta', label: 'bossa lenta', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ rim ~ rim ~ rim ~ rim' },
  { category: 'Latin lento', id: 'chacarera', label: 'chacarera', pattern: 'bd ~ bd ~ ~ sd ~ ~, rim*6' },

  // Latin
  { category: 'Latin', id: 'bossa', label: 'bossa nova', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ rim ~ rim ~ rim ~ rim' },
  { category: 'Latin', id: 'samba', label: 'samba', pattern: 'bd ~ bd ~ ~ bd ~ ~, hh*8' },
  { category: 'Latin', id: 'cumbia', label: 'cumbia', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ cp ~ cp' },
  { category: 'Latin', id: 'reggaeton', label: 'reggaetón (dembow)', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ ~ sd ~, hh*8' },
  { category: 'Latin', id: 'salsa', label: 'salsa', pattern: 'bd ~ bd ~ bd bd, ~ rim ~ rim ~ rim' },
  { category: 'Latin', id: 'merengue', label: 'merengue', pattern: 'bd bd bd bd, rim ~ rim ~' },
  { category: 'Latin', id: 'bachata', label: 'bachata', pattern: 'bd ~ ~ bd ~ ~ ~ ~, ~ ~ ~ rim ~ ~ ~ rim' },

  // Electrónica
  { category: 'Electro', id: '4-floor', label: 'four on floor', pattern: 'bd*4, hh*8, ~ cp ~ cp' },
  { category: 'Electro', id: 'house', label: 'house', pattern: 'bd*4, ~ ~ ~ oh, ~ cp ~ cp' },
  { category: 'Electro', id: 'techno', label: 'techno', pattern: 'bd*4, ~ ~ ~ oh, hh*16' },
  { category: 'Electro', id: 'minimal', label: 'minimal', pattern: 'bd ~ ~ ~ ~ ~ ~ ~, ~ ~ ~ ~ sd ~ ~ ~' },
  { category: 'Electro', id: 'garage', label: 'UK garage', pattern: 'bd ~ ~ sd, ~ hh hh hh*2' },
  { category: 'Electro', id: 'dnb', label: 'drum & bass', pattern: 'bd ~ ~ bd ~ ~ sd ~, hh*8' },
  { category: 'Electro', id: 'breakbeat', label: 'breakbeat', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ ~ sd ~ ~ sd ~ ~, hh*16' },
  { category: 'Electro', id: 'trap', label: 'trap', pattern: 'bd ~ ~ ~ ~ ~ sd ~, hh*16, ~ cp ~ ~' },
  { category: 'Electro', id: 'dubstep', label: 'dubstep half', pattern: 'bd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~, hh*8' },

  // Hip-hop / Funk
  { category: 'Hip-hop', id: 'hip-hop', label: 'hip-hop boom-bap', pattern: 'bd ~ ~ bd ~ ~ bd ~, ~ ~ sd ~ ~ ~ sd ~, hh hh*2 hh hh*2' },
  { category: 'Hip-hop', id: 'hip-hop-laid', label: 'hip-hop laid back', pattern: 'bd ~ ~ ~ ~ ~ sd ~, hh*8' },
  { category: 'Hip-hop', id: 'funk', label: 'funk', pattern: 'bd ~ ~ bd ~ sd ~ ~, hh*16' },
  { category: 'Hip-hop', id: 'jazz-funk', label: 'jazz funk', pattern: 'bd ~ ~ bd ~ ~ sd ~, hh*8' },

  // Jazz / Otros
  { category: 'Jazz', id: 'jazz-swing', label: 'jazz swing', pattern: 'bd ~ ~ ~ sd ~ ~ ~, hh*6' },
  { category: 'Jazz', id: 'waltz', label: 'vals', pattern: 'bd ~ ~ sd ~ ~, hh*3' },
  { category: 'Jazz', id: 'bossa-jazz', label: 'bossa jazz', pattern: 'bd ~ ~ bd ~ bd ~ ~, ~ rim ~ rim' },
  { category: 'Jazz', id: 'ska', label: 'ska', pattern: 'bd ~ ~ bd, ~ hh ~ hh' },
  { category: 'Jazz', id: 'reggae', label: 'reggae one-drop', pattern: '~ ~ bd ~ ~ ~ ~ ~, ~ ~ sd ~ ~ ~ sd ~, hh*8' },

  // Espacial / Cinemático
  { category: 'Espacial', id: 'interstellar', label: 'interestelar', pattern: 'bd ~ ~ ~ ~ ~ ~ ~, ~ ~ ~ ~ lt ~ ~ ~, ~ ~ ~ ~ ~ ~ ~ cy' },
  { category: 'Espacial', id: 'cosmic-pulse', label: 'pulso cósmico', pattern: 'bd ~ ~ bd ~ ~ ~ ~, ~ ~ ~ ~ ~ ~ ~ cy, sh*8' },
  { category: 'Espacial', id: 'pulsar', label: 'pulsar', pattern: 'bd ~ ~ ~ bd ~ ~ ~, hh*16' },
  { category: 'Espacial', id: 'nebula', label: 'nebulosa', pattern: '~ ~ ~ ~ ~ ~ ~ ~, ~ ~ ~ ~ ~ ~ ~ cy, sh*16' },
  { category: 'Espacial', id: 'stargate', label: 'stargate', pattern: 'bd ~ ~ ~ ~ ~ sd ~, ~ ~ ~ ~ ~ ~ ~ cy, hh*4' },
  { category: 'Espacial', id: 'event-horizon', label: 'horizonte de sucesos', pattern: 'bd*2 ~ ~ ~ ~ ~ ~ ~, ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ cy ~' },
  { category: 'Espacial', id: 'trailer-hit', label: 'trailer hit', pattern: 'bd ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~, cy ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~' },
  { category: 'Espacial', id: 'zimmer-toms', label: 'toms épicos (Zimmer)', pattern: 'lt ~ lt ~ mt ~ ht ~, bd ~ ~ bd ~ ~ ~ ~' },
  { category: 'Espacial', id: 'tom-build', label: 'tom build', pattern: 'lt mt ht ~ lt mt ht*2, hh*8' },
  { category: 'Espacial', id: 'rolling-thunder', label: 'rolling thunder', pattern: 'lt*2 mt*2 ht*2 sd*4, ~ ~ ~ cy' },
  { category: 'Espacial', id: 'asteroid', label: 'asteroide', pattern: 'bd ~ bd*2 ~ ~ sd ~ bd, hh*8, ~ ~ ~ ~ ~ ~ ~ cy' },
  { category: 'Espacial', id: 'supernova', label: 'supernova', pattern: 'bd*2 sd*4 bd*2 sd*8, cy*2, hh*16' },
  { category: 'Espacial', id: 'vacuum', label: 'vacío', pattern: '~ ~ ~ ~ ~ ~ ~ bd, ~ ~ cy ~ ~ ~ ~ ~' },

  // Redobles / Fills
  { category: 'Redobles', id: 'snare-roll', label: 'redoble snare', pattern: 'sd*16, ~ ~ ~ cy' },
  { category: 'Redobles', id: 'snare-roll-build', label: 'redoble creciente', pattern: 'sd sd*2 sd*4 sd*8, ~ ~ ~ cy' },
  { category: 'Redobles', id: 'snare-roll-fast', label: 'redoble rápido', pattern: 'sd*32' },
  { category: 'Redobles', id: 'tom-fill', label: 'fill de toms', pattern: 'ht*2 mt*2 lt*2 bd*2' },
  { category: 'Redobles', id: 'fill-classic', label: 'fill clásico', pattern: 'sd*2 sd*2 ht ht mt mt lt lt' },
  { category: 'Redobles', id: 'fill-half', label: 'fill medio compás', pattern: 'bd ~ sd ~ bd ~ sd ~, ~ ~ ~ ~ ~ ht mt lt' },
  { category: 'Redobles', id: 'fill-flam', label: 'fill flam', pattern: 'sd*2 sd ht*2 ht mt*2 mt lt*2 lt' },
  { category: 'Redobles', id: 'cymbal-swell', label: 'platillo creciente', pattern: 'cy*2 cy*4 cy*8 cy*16' },
  { category: 'Redobles', id: 'kick-roll', label: 'redoble de bombo', pattern: 'bd*16, ~ ~ ~ cy' },

  // Mínimos
  { category: 'Básico', id: 'kick-only', label: 'sólo bombo', pattern: 'bd*4' },
  { category: 'Básico', id: 'four-snare', label: 'sólo caja', pattern: 'sd*4' },
  { category: 'Básico', id: 'hat-roll', label: 'sólo hi-hat', pattern: 'hh*16' },
  { category: 'Básico', id: 'rest', label: 'silencio', pattern: '~' },
];

export const DRUM_PATTERNS: Record<string, string> = Object.fromEntries(
  DRUM_PATTERN_LIST.map((p) => [p.id, p.pattern]),
);

export const ARPEGGIO_DIRECTIONS = [
  { id: 'up', label: 'sube' },
  { id: 'down', label: 'baja' },
  { id: 'updown', label: 'sube y baja' },
  { id: 'random', label: 'aleatorio' },
] as const;

export const SPEEDS = [
  { id: 0.25, label: '×0.25' },
  { id: 0.5, label: '×0.5' },
  { id: 1, label: '×1' },
  { id: 2, label: '×2' },
  { id: 4, label: '×4' },
  { id: 8, label: '×8' },
];

export const SLOWS = [
  { id: 1, label: '×1' },
  { id: 2, label: '×2' },
  { id: 4, label: '×4' },
  { id: 8, label: '×8' },
];

// Instrumentos melódicos. Los de samples (piano, VCSL) cargan confiable.
// Los gm_* dependen de los soundfonts y pueden fallar en la primera vuelta
// mientras se descarga el .sf2.
export const MELODIC_INSTRUMENTS = [
  // Samples reales (más confiables)
  { id: 'piano', label: 'Piano (Salamander)' },
  { id: 'steinway', label: 'Piano Steinway' },
  { id: 'kawai', label: 'Piano Kawai' },
  { id: 'fmpiano', label: 'FM Piano' },
  { id: 'piano1', label: 'Piano 1' },
  { id: 'clavisynth', label: 'Clavisynth' },
  { id: 'organ_full', label: 'Órgano (full)' },
  { id: 'organ_4inch', label: 'Órgano 4"' },
  { id: 'organ_8inch', label: 'Órgano 8"' },
  { id: 'pipeorgan_loud', label: 'Órgano de tubo' },
  { id: 'harp', label: 'Arpa' },
  { id: 'folkharp', label: 'Arpa folk' },
  { id: 'marimba', label: 'Marimba' },
  { id: 'vibraphone', label: 'Vibráfono' },
  { id: 'kalimba', label: 'Kalimba' },
  { id: 'glockenspiel', label: 'Glockenspiel' },
  { id: 'tubularbells', label: 'Campanas tubulares' },
  { id: 'sax', label: 'Saxo' },
  { id: 'sax_vib', label: 'Saxo (vibrato)' },
  { id: 'harmonica', label: 'Armónica' },
  { id: 'ocarina', label: 'Ocarina' },
  { id: 'recorder_alto_sus', label: 'Flauta dulce alto' },
  { id: 'recorder_soprano_sus', label: 'Flauta dulce soprano' },
  { id: 'dantranh', label: 'Đàn tranh (cítara)' },
  { id: 'balafon', label: 'Balafón' },
  // Soundfonts GM (pueden no sonar la primera vez por lazy-load)
  { id: 'gm_piano', label: 'Piano GM' },
  { id: 'gm_violin', label: 'Violín GM' },
  { id: 'gm_viola', label: 'Viola GM' },
  { id: 'gm_cello', label: 'Chelo GM' },
  { id: 'gm_pizzicato_strings', label: 'Pizzicato GM' },
  { id: 'gm_trumpet', label: 'Trompeta GM' },
  { id: 'gm_flute', label: 'Flauta GM' },
  { id: 'gm_alto_sax', label: 'Saxo alto GM' },
  { id: 'gm_acoustic_guitar_nylon', label: 'Guitarra GM' },
  // Synths
  { id: 'sawtooth', label: 'Saw (synth)' },
  { id: 'square', label: 'Square (synth)' },
  { id: 'triangle', label: 'Triangle (synth)' },
  { id: 'sine', label: 'Sine (synth)' },
  { id: 'supersaw', label: 'Supersaw' },
];

export const BASS_INSTRUMENTS = [
  // Soundfonts GM de bajos
  { id: 'gm_acoustic_bass', label: 'Bajo acústico GM' },
  { id: 'gm_electric_bass_finger', label: 'Bajo eléctrico (dedo) GM' },
  { id: 'gm_electric_bass_pick', label: 'Bajo eléctrico (pick) GM' },
  { id: 'gm_fretless_bass', label: 'Bajo fretless GM' },
  { id: 'gm_slap_bass_1', label: 'Slap bass 1 GM' },
  { id: 'gm_slap_bass_2', label: 'Slap bass 2 GM' },
  { id: 'gm_synth_bass_1', label: 'Synth bass 1 GM' },
  { id: 'gm_synth_bass_2', label: 'Synth bass 2 GM' },
  { id: 'gm_contrabass', label: 'Contrabajo GM' },
  { id: 'gm_cello', label: 'Chelo GM' },
  { id: 'gm_tuba', label: 'Tuba GM' },
  // Synths útiles para bajo
  { id: 'sawtooth', label: 'Saw (synth)' },
  { id: 'square', label: 'Square (synth)' },
  { id: 'triangle', label: 'Triangle (synth)' },
  { id: 'sine', label: 'Sine (sub)' },
  { id: 'supersaw', label: 'Supersaw' },
];

export const STRINGS_INSTRUMENTS = [
  // GM strings
  { id: 'gm_string_ensemble_1', label: 'Ensemble cuerdas 1 GM' },
  { id: 'gm_string_ensemble_2', label: 'Ensemble cuerdas 2 GM' },
  { id: 'gm_tremolo_strings', label: 'Cuerdas trémolo GM' },
  { id: 'gm_pizzicato_strings', label: 'Pizzicato GM' },
  { id: 'gm_synth_strings_1', label: 'Synth strings 1 GM' },
  { id: 'gm_synth_strings_2', label: 'Synth strings 2 GM' },
  { id: 'gm_orchestral_harp', label: 'Arpa orquestal GM' },
  { id: 'gm_violin', label: 'Violín GM' },
  { id: 'gm_viola', label: 'Viola GM' },
  { id: 'gm_cello', label: 'Chelo GM' },
  { id: 'gm_contrabass', label: 'Contrabajo GM' },
  // Pads basados en strings/coros
  { id: 'gm_pad_bowed', label: 'Pad arco GM' },
  { id: 'gm_pad_warm', label: 'Pad cálido GM' },
  { id: 'gm_choir_aahs', label: 'Coro aahs GM' },
  { id: 'gm_voice_oohs', label: 'Voz oohs GM' },
  // Samples
  { id: 'vibraphone_bowed', label: 'Vibráfono arco' },
  { id: 'wineglass', label: 'Copa vibrante' },
];

export const PAD_INSTRUMENTS = [
  // Samples reales
  { id: 'pipeorgan_loud', label: 'Órgano de tubo' },
  { id: 'pipeorgan_quiet', label: 'Órgano (quiet)' },
  { id: 'organ_full', label: 'Órgano (full)' },
  { id: 'vibraphone_bowed', label: 'Vibráfono arco' },
  { id: 'wineglass', label: 'Copa vibrante' },
  { id: 'wineglass_slow', label: 'Copa lenta' },
  { id: 'didgeridoo', label: 'Didgeridoo' },
  { id: 'handbells', label: 'Campanas' },
  { id: 'tubularbells', label: 'Campanas tubulares' },
  // Soundfonts GM
  { id: 'gm_tremolo_strings', label: 'Cuerdas trémolo GM' },
  { id: 'gm_choir_aahs', label: 'Coro GM' },
  { id: 'gm_pad_warm', label: 'Pad cálido GM' },
  { id: 'gm_pad_bowed', label: 'Pad arco GM' },
  { id: 'gm_pad_halo', label: 'Pad halo GM' },
  { id: 'gm_pad_new_age', label: 'Pad new age GM' },
  { id: 'gm_synth_choir', label: 'Synth choir GM' },
  { id: 'gm_voice_oohs', label: 'Voz oohs GM' },
  // Synths
  { id: 'sawtooth', label: 'Saw (synth)' },
];

export const DEFAULT_STUDIO = {
  bpm: 110,
  tracks: [
    {
      id: 't1',
      type: 'drums' as const,
      name: 'Drums',
      muted: false,
      volume: 0.9,
      segments: [
        {
          id: 's1',
          bars: 4,
          params: { bank: 'RolandTR909', pattern: '4-floor', accent: 0.7 },
        },
      ],
    },
  ],
};
