export type Preset = {
  id: string;
  label: string;
  category: string;
  code: string;
};

// Strudel usa .cpm() = cycles per minute. Como nuestros patterns tienen 4 beats
// por ciclo, los valores aquí están como `bpm / 4` para que se sientan como BPM
// real (ej: techno 128 BPM → .cpm(32)).
export const PRESETS: Preset[] = [
  // ───── Básico ─────
  {
    id: 'hello',
    category: 'Básico',
    label: 'hello beat (110 bpm)',
    code: `stack(
  s("bd ~ bd ~"),
  s("~ cp ~ cp"),
  s("hh*8").gain(0.6),
).cpm(27.5) // 110 bpm`,
  },
  {
    id: 'four-on-floor',
    category: 'Básico',
    label: 'four on the floor (120 bpm)',
    code: `stack(
  s("bd*4"),
  s("~ cp ~ cp"),
  s("hh*8").gain(0.5),
).cpm(30) // 120 bpm`,
  },
  {
    id: 'simple-melody',
    category: 'Básico',
    label: 'melodía simple (100 bpm)',
    code: `stack(
  s("bd ~ sd ~").gain(0.8),
  s("hh*8").gain(0.4),
  note("c4 e4 g4 e4 c4 e4 g4 c5").s("piano").gain(0.55),
).cpm(25) // 100 bpm`,
  },

  // ───── Rock / Metal ─────
  {
    id: 'rock-classic',
    category: 'Rock / Metal',
    label: 'rock clásico (115 bpm)',
    code: `stack(
  s("bd ~ sd ~ bd bd sd ~"),
  s("hh*8").gain(0.5),
  s("~ ~ ~ ~ ~ ~ ~ cy").gain(0.3),
  note("<e2 e2 g2 a2>(3,8)").s("sawtooth").lpf(800).gain(0.5),
).cpm(28.75) // 115 bpm`,
  },
  {
    id: 'punk',
    category: 'Rock / Metal',
    label: 'punk rápido (180 bpm)',
    code: `stack(
  s("bd bd sd sd"),
  s("hh*8").gain(0.5),
  note("<e2 a2 d3 g2>(5,8)").s("sawtooth").lpf(1200).gain(0.55),
).cpm(45) // 180 bpm`,
  },
  {
    id: 'metal-driving',
    category: 'Rock / Metal',
    label: 'metal driving (150 bpm)',
    code: `stack(
  s("bd*2 sd bd*2 sd"),
  s("hh*16").gain(0.45),
  s("~ ~ ~ ~ ~ ~ ~ cy").gain(0.4),
  note("<e1 e1 g1 b1>(7,8)").s("sawtooth").lpf(600).gain(0.6),
).cpm(37.5) // 150 bpm`,
  },
  {
    id: 'stadium-rock',
    category: 'Rock / Metal',
    label: 'rock estadio (128 bpm)',
    code: `stack(
  s("bd ~ sd ~ bd ~ sd sd"),
  s("hh*8").gain(0.5),
  s("~ ~ ~ ~ ~ ~ ~ cy").gain(0.4),
  note("<e2 b2 a2 e2>").s("sawtooth").lpf(1500).gain(0.55),
).cpm(32) // 128 bpm`,
  },
  {
    id: 'blues-shuffle',
    category: 'Rock / Metal',
    label: 'blues shuffle (95 bpm)',
    code: `stack(
  s("bd ~ ~ sd ~ ~ bd ~ ~ sd ~ ~"),
  s("hh ~ hh hh ~ hh hh ~ hh hh ~ hh").gain(0.45),
  note("<e2 g2 a2 b2 a2 g2>").s("sawtooth").lpf(1000).gain(0.5),
).cpm(23.75) // 95 bpm`,
  },

  // ───── Pop ─────
  {
    id: 'pop-modern',
    category: 'Pop',
    label: 'pop moderno (118 bpm)',
    code: `stack(
  s("bd ~ ~ ~ ~ ~ sd ~"),
  s("hh*16").gain(0.4),
  note("<Cmaj7 G Am F>").voicing().s("piano").gain(0.5),
  note("<c2 g1 a1 f1>").s("gm_electric_bass_finger").gain(0.6),
).cpm(29.5) // 118 bpm`,
  },
  {
    id: 'pop-disco',
    category: 'Pop',
    label: 'pop disco (118 bpm)',
    code: `stack(
  s("bd*4"),
  s("~ cp ~ cp"),
  s("hh*8").gain(0.5),
  note("<c3 e3 g3 b3 c4 b3 g3 e3>*2").s("piano").gain(0.5),
  note("<c2 c2 g2 c2>").s("gm_electric_bass_finger").gain(0.6),
).cpm(29.5) // 118 bpm`,
  },
  {
    id: 'pop-snap',
    category: 'Pop',
    label: 'pop con snaps (104 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ ~ sd ~").gain(0.7),
  s("hh*8").gain(0.4),
  note("<Cmaj7 Am7 Fmaj7 G7>").voicing().s("piano").gain(0.45),
).cpm(26) // 104 bpm`,
  },

  // ───── Hip-Hop ─────
  {
    id: 'lofi',
    category: 'Hip-Hop',
    label: 'lo-fi hip-hop (84 bpm)',
    code: `stack(
  s("bd ~ ~ ~ ~ ~ sd ~").gain(0.8),
  s("hh*8").gain(0.4),
  note("<Cmaj7 Am7 Fmaj7 Em7>").voicing().s("piano").room(0.4).gain(0.5),
  note("<c2 c2 g2 e2>").s("gm_electric_bass_finger").lpf(500).gain(0.5),
).cpm(21) // 84 bpm`,
  },
  {
    id: 'boom-bap',
    category: 'Hip-Hop',
    label: 'boom-bap (92 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ ~ sd ~ ~ ~ sd ~"),
  s("hh hh*2 hh hh*2").gain(0.5),
  note("<c3 eb3 g3 bb3>*2").s("piano").gain(0.5),
).cpm(23) // 92 bpm`,
  },
  {
    id: 'trap-808',
    category: 'Hip-Hop',
    label: 'trap 808 (140 bpm)',
    code: `stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~"),
  s("~ ~ sd ~ ~ ~ sd ~"),
  s("hh*16").gain(0.4),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.5),
  note("<c1 c1 g1 eb1>*2").s("sine").gain(0.7),
).bank("RolandTR808").cpm(35) // 140 bpm`,
  },
  {
    id: 'drill',
    category: 'Hip-Hop',
    label: 'drill (140 bpm)',
    code: `stack(
  s("bd ~ ~ ~ bd ~ ~ ~"),
  s("~ ~ sd ~ ~ ~ sd ~"),
  s("hh hh ~ hh*3 hh hh ~ hh*3").gain(0.45),
  note("<c1 ~ c1 ~ g0 ~ eb1 ~>*2").s("sine").gain(0.7),
).cpm(35) // 140 bpm`,
  },
  {
    id: 'jazz-hop',
    category: 'Hip-Hop',
    label: 'jazz-hop (88 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ sd ~"),
  s("hh hh*2 hh hh*2").gain(0.45),
  note("<Cmaj9 Am9 Dm9 G7>").voicing().s("piano").room(0.4).gain(0.5),
  note("<c2 a1 d2 g1>").s("gm_acoustic_bass").gain(0.6),
).cpm(22) // 88 bpm`,
  },

  // ───── Electrónica ─────
  {
    id: 'tr909',
    category: 'Electrónica',
    label: 'tr-909 house (124 bpm)',
    code: `stack(
  s("bd*4").gain(0.9),
  s("~ sd ~ sd"),
  s("hh*8").gain(0.5),
  s("~ ~ ~ oh"),
).bank("RolandTR909").cpm(31) // 124 bpm`,
  },
  {
    id: 'deep-house',
    category: 'Electrónica',
    label: 'deep house (122 bpm)',
    code: `stack(
  s("bd*4").gain(0.9),
  s("~ ~ ~ oh").gain(0.5),
  s("hh*8").gain(0.4),
  note("<c2 c2 g1 a1>").s("gm_electric_bass_finger").lpf(700).gain(0.6),
  note("<Cmaj7 Am7>").voicing().s("piano").gain(0.4),
).bank("RolandTR909").cpm(30.5) // 122 bpm`,
  },
  {
    id: 'techno-dark',
    category: 'Electrónica',
    label: 'techno oscuro (132 bpm)',
    code: `stack(
  s("bd*4").gain(0.95),
  s("~ ~ ~ oh"),
  s("hh*16").gain(0.4),
  note("c1 ~ c1 ~ eb1 ~ c1 ~").s("sawtooth").lpf(400).gain(0.7),
).bank("RolandTR909").cpm(33) // 132 bpm`,
  },
  {
    id: 'minimal-techno',
    category: 'Electrónica',
    label: 'minimal techno (126 bpm)',
    code: `stack(
  s("bd ~ ~ ~ bd ~ ~ ~"),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.5),
  s("hh*16").gain(0.35),
  note("c2 ~ ~ ~ g1 ~ ~ ~").s("sawtooth").lpf(600).gain(0.55),
).bank("RolandTR909").cpm(31.5) // 126 bpm`,
  },
  {
    id: 'trance',
    category: 'Electrónica',
    label: 'trance épico (138 bpm)',
    code: `stack(
  s("bd*4").gain(0.95),
  s("~ ~ ~ oh"),
  s("hh*16").gain(0.4),
  note("<c2 c2 ab1 bb1>*2").s("supersaw").gain(0.5),
  note("<c4,eb4,g4 ab3,c4,eb4 f3,ab3,c4 bb3,d4,f4>")
    .s("supersaw").room(0.7).gain(0.45),
).cpm(34.5) // 138 bpm`,
  },
  {
    id: 'acid',
    category: 'Electrónica',
    label: 'acid bass (128 bpm)',
    code: `stack(
  note("<c2 c2 eb2 g2 c2 bb1 g1 eb2>*4")
    .s("sawtooth")
    .lpf(sine.range(400, 2000).slow(8))
    .resonance(15)
    .gain(0.6),
  s("bd*4"),
  s("~ ~ ~ oh").gain(0.4),
).cpm(32) // 128 bpm`,
  },
  {
    id: 'dubstep',
    category: 'Electrónica',
    label: 'dubstep half-time (140 bpm)',
    code: `stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~"),
  s("hh*8").gain(0.4),
  note("<c1 c1 eb1 g1>*2").s("square").lpf(sine.range(200, 1500).slow(4))
    .resonance(10).gain(0.65),
).cpm(35) // 140 bpm`,
  },
  {
    id: 'dnb',
    category: 'Electrónica',
    label: 'drum & bass (174 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ sd ~"),
  s("hh*16").gain(0.4),
  s("~ ~ ~ ~ ~ ~ ~ cp").gain(0.5),
  note("c2 ~ eb2 ~ g1 ~ c2 ~").s("sawtooth").lpf(500).gain(0.5),
).cpm(43.5) // 174 bpm`,
  },
  {
    id: 'jungle',
    category: 'Electrónica',
    label: 'jungle break (170 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ ~ sd ~ ~ ~ sd ~"),
  s("hh*16").gain(0.4),
  note("<c2 c2 eb2 c2 g1 c2 eb2 c2>").s("sawtooth").lpf(450).gain(0.6),
).cpm(42.5) // 170 bpm`,
  },
  {
    id: 'garage',
    category: 'Electrónica',
    label: 'UK garage (130 bpm)',
    code: `stack(
  s("bd ~ ~ sd ~ ~ bd*2 ~"),
  s("~ hh hh hh*2").gain(0.45),
  note("<c3 eb3 g3 bb3>*2").s("piano").room(0.3).gain(0.45),
  note("<c2 c2 g1 ab1>").s("gm_synth_bass_1").gain(0.6),
).cpm(32.5) // 130 bpm`,
  },
  {
    id: 'breakbeat',
    category: 'Electrónica',
    label: 'breakbeat (140 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ ~ sd ~ ~ sd ~ ~"),
  s("hh*16").gain(0.4),
).cpm(35) // 140 bpm`,
  },
  {
    id: 'idm-glitch',
    category: 'Electrónica',
    label: 'IDM glitch (105 bpm)',
    code: `stack(
  s("bd ~ ~ ~ sd ~ ~ ~ ~ ~ bd*3 ~ ~ ~ sd ~"),
  s("hh*16").degrade.gain(0.4),
  s("~ ~ ~ ~ cp*2 ~ ~ ~").gain(0.4),
  note("<c4 eb4 g4 a4>?").s("piano").rev.gain(0.5),
).cpm(26.25) // 105 bpm`,
  },

  // ───── Latin ─────
  {
    id: 'reggaeton',
    category: 'Latin',
    label: 'reggaetón dembow (95 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ ~ sd ~ ~ ~ sd ~"),
  s("hh*8").gain(0.4),
).bank("RolandTR909").cpm(23.75) // 95 bpm`,
  },
  {
    id: 'cumbia',
    category: 'Latin',
    label: 'cumbia (95 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~").gain(0.8),
  s("~ cp ~ cp").gain(0.6),
  s("~ rim ~ rim ~ rim ~ rim").gain(0.5),
  note("<c4 e4 g4 e4>*2").s("gm_acoustic_guitar_nylon").gain(0.5),
).cpm(23.75) // 95 bpm`,
  },
  {
    id: 'bossa',
    category: 'Latin',
    label: 'bossa nova (120 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ bd ~"),
  s("~ rim ~ rim ~ rim ~ rim").gain(0.6),
  s("hh*8").gain(0.4),
  note("<Cmaj7 Dm7 G7 Cmaj7>").voicing().s("gm_acoustic_guitar_nylon").gain(0.5),
).cpm(30) // 120 bpm`,
  },
  {
    id: 'samba',
    category: 'Latin',
    label: 'samba (104 bpm)',
    code: `stack(
  s("bd ~ bd ~ ~ bd ~ ~"),
  s("~ rim ~ rim ~ rim ~ rim").gain(0.6),
  s("hh*16").gain(0.4),
  note("<Cmaj7 A7 Dm7 G7>").voicing().s("gm_acoustic_guitar_nylon").gain(0.5),
).cpm(26) // 104 bpm`,
  },
  {
    id: 'salsa',
    category: 'Latin',
    label: 'salsa (190 bpm)',
    code: `stack(
  s("bd ~ bd ~ bd bd"),
  s("~ rim ~ rim ~ rim").gain(0.55),
  s("hh*12").gain(0.4),
  note("<c3 e3 g3 c4 g3 e3>*2").s("piano").gain(0.5),
  note("<c2 g1 c2 a1>").s("gm_acoustic_bass").gain(0.6),
).cpm(47.5) // 190 bpm`,
  },
  {
    id: 'bachata',
    category: 'Latin',
    label: 'bachata (125 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ ~ ~"),
  s("~ ~ ~ rim ~ ~ ~ rim").gain(0.55),
  s("hh*8").gain(0.4),
  note("<Cmaj7 Em7 Am7 G7>").voicing().s("gm_acoustic_guitar_nylon").gain(0.5),
).cpm(31.25) // 125 bpm`,
  },
  {
    id: 'merengue',
    category: 'Latin',
    label: 'merengue (160 bpm)',
    code: `stack(
  s("bd bd bd bd"),
  s("rim ~ rim ~").gain(0.6),
  s("hh*16").gain(0.4),
  note("<c4 e4 g4 e4>*2").s("gm_acoustic_guitar_nylon").gain(0.5),
).cpm(40) // 160 bpm`,
  },
  {
    id: 'bolero',
    category: 'Latin',
    label: 'bolero (75 bpm)',
    code: `stack(
  s("bd ~ ~ bd ~ ~ ~ ~").gain(0.7),
  s("~ rim ~ rim ~ rim ~ rim").gain(0.5),
  s("hh*8").gain(0.4),
  note("<Cm Fm Gm Cm>").voicing().s("gm_acoustic_guitar_nylon").gain(0.5),
).cpm(18.75) // 75 bpm`,
  },

  // ───── Jazz / Acústico ─────
  {
    id: 'jazz-swing',
    category: 'Jazz / Acústico',
    label: 'jazz swing (130 bpm)',
    code: `stack(
  s("bd ~ ~ ~ sd ~ ~ ~"),
  s("hh ~ hh hh*2 hh ~ hh hh*2").gain(0.4),
  s("~ ~ rim ~ ~ ~ rim ~").gain(0.4),
  note("<Cmaj7 A7 Dm7 G7>").voicing().s("piano").gain(0.5),
  note("<c2 a1 d2 g1>").s("gm_acoustic_bass").gain(0.6),
).cpm(32.5) // 130 bpm`,
  },
  {
    id: 'jazz-ballad',
    category: 'Jazz / Acústico',
    label: 'balada jazz (68 bpm)',
    code: `stack(
  s("bd ~ ~ ~ sd ~ ~ ~").gain(0.6),
  s("hh*4").gain(0.4),
  note("<Cmaj9 Em7 Am7 Dm7 G7>").voicing().s("piano").room(0.5).gain(0.55),
  note("<c2 e2 a1 d2 g1>").s("gm_acoustic_bass").gain(0.55),
).cpm(17) // 68 bpm`,
  },
  {
    id: 'piano-arp',
    category: 'Jazz / Acústico',
    label: 'piano arp (96 bpm)',
    code: `stack(
  note("<c3 g3 a3 f3>(5,8)")
    .s("piano").room(0.6).gain(0.6),
  s("bd*2 ~ bd ~").gain(0.7),
  s("hh*8").gain(0.4),
).cpm(24) // 96 bpm`,
  },
  {
    id: 'balada-piano',
    category: 'Jazz / Acústico',
    label: 'balada piano (70 bpm)',
    code: `stack(
  s("bd ~ ~ ~ sd ~ ~ ~").gain(0.7),
  s("hh*4").gain(0.4),
  note("<Cmaj7 Am7 Fmaj7 G7>").voicing().s("piano").room(0.5).gain(0.55),
).cpm(17.5) // 70 bpm`,
  },
  {
    id: 'violin-arp',
    category: 'Jazz / Acústico',
    label: 'violín arpegio (92 bpm)',
    code: `stack(
  note("<c4 e4 g4 b4 c5 b4 g4 e4>*2")
    .s("gm_violin").room(0.7).gain(0.55),
  note("<c2 c2 g2 c2>").s("gm_cello").gain(0.5),
).cpm(23) // 92 bpm`,
  },
  {
    id: 'strings-quartet',
    category: 'Jazz / Acústico',
    label: 'cuarteto cuerdas (60 bpm)',
    code: `stack(
  note("<c5 e5 g5 c5>").s("gm_violin").gain(0.5),
  note("<g4 c5 e5 g4>").s("gm_viola").gain(0.45),
  note("<c4 c4 g3 c4>").s("gm_cello").gain(0.5),
  note("<c3 c3 g2 c3>").s("gm_contrabass").gain(0.55),
).cpm(15) // 60 bpm`,
  },

  // ───── Ambient / Cinematic ─────
  {
    id: 'ambient',
    category: 'Ambient / Cinematic',
    label: 'ambient pad (80 bpm)',
    code: `note("<c3 e3 g3 b3>(5,8)")
  .s("gm_choir_aahs")
  .room(0.9).delay(0.5).gain(0.5).slow(4)
  .cpm(20) // 80 bpm`,
  },
  {
    id: 'strings-pad',
    category: 'Ambient / Cinematic',
    label: 'strings pad (72 bpm)',
    code: `stack(
  note("<c3,e3,g3 a2,c3,e3 f2,a2,c3 g2,b2,d3>")
    .s("gm_tremolo_strings").room(0.9).gain(0.5).slow(2),
  note("<c2 a1 f1 g1>").s("gm_cello").gain(0.5),
).cpm(18) // 72 bpm`,
  },
  {
    id: 'interstellar',
    category: 'Ambient / Cinematic',
    label: 'interestelar épico (80 bpm)',
    code: `stack(
  note("<c3,g3 c3,g3 ab2,eb3 ab2,eb3>")
    .s("pipeorgan_loud").room(0.95).gain(0.45).slow(4),
  note("<c2 c2 ab1 ab1>").s("gm_cello").gain(0.5).slow(2),
  s("bd ~ ~ ~ ~ ~ ~ ~").gain(0.5),
  s("~ ~ ~ ~ ~ ~ ~ cy").gain(0.3),
).cpm(20) // 80 bpm`,
  },
  {
    id: 'sci-fi-pulse',
    category: 'Ambient / Cinematic',
    label: 'pulso sci-fi (90 bpm)',
    code: `stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.7),
  s("hh*16").gain(0.3),
  note("<c2 c2 g1 ab1>(5,8)").s("supersaw").lpf(800).gain(0.55),
  note("<c4,eb4,g4 ab3,c4,eb4>").s("gm_pad_warm").room(0.8).gain(0.4),
).cpm(22.5) // 90 bpm`,
  },
  {
    id: 'dark-drone',
    category: 'Ambient / Cinematic',
    label: 'drone oscuro (60 bpm)',
    code: `stack(
  note("c2").s("sine").gain(0.5),
  note("<c3,eb3,g3 c3,f3,ab3>").s("gm_pad_warm").room(0.95).gain(0.4).slow(8),
  s("~ ~ ~ ~ ~ ~ ~ cy").gain(0.2),
).cpm(15) // 60 bpm`,
  },
  {
    id: 'trailer-build',
    category: 'Ambient / Cinematic',
    label: 'trailer build (100 bpm)',
    code: `stack(
  s("lt mt ht ~ lt mt ht*2"),
  s("bd ~ ~ ~ bd ~ ~ ~"),
  s("sd sd*2 sd*4 sd*8").gain(0.6),
  s("cy*2 cy*4 cy*8 cy*16").gain(0.4),
  note("<c2 c2 ab1 ab1>").s("gm_cello").gain(0.6),
).cpm(25) // 100 bpm`,
  },

  // ───── Multi-segmento ─────
  {
    id: 'arpegio-multi',
    category: 'Multi-segmento',
    label: 'arpegio multi-segmento (110 bpm)',
    code: `stack(
  arrange(
    [4, s("bd ~ sd ~, hh*8").bank("RolandTR909")],
    [4, s("bd*4, ~ cp ~ cp, hh*8").bank("RolandTR909")],
    [4, s("bd*2 sd cp, hh*16").bank("RolandTR909")],
  ),
  arrange(
    [4, note("<c3 e3 g3 b3>*2").s("piano").gain(0.5)],
    [4, note("<a2 c3 e3 a3>*2").s("piano").gain(0.5)],
    [4, note("<f2 a2 c3 f3>*2").s("piano").gain(0.5)],
  ),
).cpm(27.5) // 110 bpm`,
  },
  {
    id: 'verso-coro',
    category: 'Multi-segmento',
    label: 'verso → coro (118 bpm)',
    code: `stack(
  arrange(
    [8, s("bd ~ ~ ~ ~ ~ sd ~, hh*8")],
    [8, s("bd*4, ~ cp ~ cp, hh*16")],
  ),
  arrange(
    [8, note("<c2 c2 g1 a1>").s("gm_electric_bass_finger").gain(0.6)],
    [8, note("<c2 f2 g2 ab2>*2").s("gm_electric_bass_finger").gain(0.7)],
  ),
).cpm(29.5) // 118 bpm`,
  },
];
