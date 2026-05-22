export type PaletteItem = {
  id: string;
  label: string;
  snippet: string;
  hint?: string;
};

export type PaletteGroup = {
  id: string;
  label: string;
  items: PaletteItem[];
};

export const CATALOG: PaletteGroup[] = [
  {
    id: 'drums',
    label: 'Drums',
    items: [
      { id: 'bd', label: 'bd', snippet: 'bd', hint: 'bombo' },
      { id: 'sd', label: 'sd', snippet: 'sd', hint: 'caja' },
      { id: 'hh', label: 'hh', snippet: 'hh', hint: 'hi-hat' },
      { id: 'oh', label: 'oh', snippet: 'oh', hint: 'open hat' },
      { id: 'cp', label: 'cp', snippet: 'cp', hint: 'clap' },
      { id: 'cy', label: 'cy', snippet: 'cy', hint: 'cymbal' },
      { id: 'rim', label: 'rim', snippet: 'rim' },
      { id: 'lt', label: 'lt', snippet: 'lt', hint: 'low tom' },
      { id: 'mt', label: 'mt', snippet: 'mt', hint: 'mid tom' },
      { id: 'ht', label: 'ht', snippet: 'ht', hint: 'high tom' },
      { id: 'perc', label: 'perc', snippet: 'perc' },
      { id: 'sh', label: 'sh', snippet: 'sh', hint: 'shaker' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patrones',
    items: [
      { id: 'rest', label: '~', snippet: '~', hint: 'silencio' },
      { id: 'fast', label: '*2', snippet: '*2', hint: 'acelera 2x' },
      { id: 'slow', label: '/2', snippet: '/2', hint: 'ralentiza 2x' },
      { id: 'sub', label: '[a b]', snippet: '[a b]', hint: 'sub-secuencia' },
      { id: 'alt', label: '<a b>', snippet: '<a b>', hint: 'alterna por ciclo' },
      { id: 'eu', label: '(3,8)', snippet: '(3,8)', hint: 'euclidean' },
      { id: 'rand', label: '?', snippet: '?0.5', hint: 'probabilidad' },
    ],
  },
  {
    id: 'sources',
    label: 'Fuente',
    items: [
      { id: 's', label: 's("…")', snippet: 's("bd")', hint: 'sample' },
      { id: 'note', label: 'note("…")', snippet: 'note("c e g")', hint: 'melodía' },
      { id: 'n', label: 'n("…")', snippet: 'n("0 2 4 7")', hint: 'grado escala' },
      { id: 'stack', label: 'stack(…)', snippet: 'stack(\n  ,\n)', hint: 'apila pistas' },
    ],
  },
  {
    id: 'banks',
    label: 'Banks',
    items: [
      { id: 'tr909', label: 'TR-909', snippet: '.bank("RolandTR909")' },
      { id: 'tr808', label: 'TR-808', snippet: '.bank("RolandTR808")' },
      { id: 'tr707', label: 'TR-707', snippet: '.bank("RolandTR707")' },
      { id: 'linn', label: 'LinnDrum', snippet: '.bank("LinnLM1")' },
      { id: 'akai', label: 'AkaiLinn', snippet: '.bank("AkaiLinn")' },
      { id: 'mpc', label: 'MPC2000', snippet: '.bank("MPC2000")' },
      { id: 'casio', label: 'CasioRZ1', snippet: '.bank("CasioRZ1")' },
    ],
  },
  {
    id: 'synths',
    label: 'Synths',
    items: [
      { id: 'sine', label: 'sine', snippet: 'note("c e g").s("sine")' },
      { id: 'saw', label: 'sawtooth', snippet: 'note("c e g").s("sawtooth")' },
      { id: 'square', label: 'square', snippet: 'note("c e g").s("square")' },
      { id: 'tri', label: 'triangle', snippet: 'note("c e g").s("triangle")' },
      { id: 'supersaw', label: 'supersaw', snippet: 'note("c e g").s("supersaw")' },
    ],
  },
  {
    id: 'soundfonts',
    label: 'Soundfonts (GM)',
    items: [
      { id: 'piano', label: 'piano', snippet: 'note("c3 e3 g3").s("gm_piano")' },
      { id: 'epiano', label: 'e-piano', snippet: 'note("c3 e3 g3").s("gm_clavinet")' },
      { id: 'organ', label: 'organ', snippet: 'note("c3 e3 g3").s("gm_drawbar_organ")' },
      { id: 'church', label: 'church organ', snippet: 'note("c3 e3 g3").s("gm_church_organ")' },
      { id: 'guitar', label: 'guitar', snippet: 'note("c3 e3 g3").s("gm_acoustic_guitar_nylon")' },
      { id: 'bass', label: 'bass', snippet: 'note("c2 e2 g2").s("gm_acoustic_bass")' },
      { id: 'violin', label: 'violin', snippet: 'note("c4 e4 g4").s("gm_violin")' },
      { id: 'viola', label: 'viola', snippet: 'note("c4 e4 g4").s("gm_viola")' },
      { id: 'cello', label: 'cello', snippet: 'note("c3 e3 g3").s("gm_cello")' },
      { id: 'strings', label: 'strings', snippet: 'note("c3 e3 g3").s("gm_tremolo_strings")' },
      { id: 'pizz', label: 'pizzicato', snippet: 'note("c4 e4 g4").s("gm_pizzicato_strings")' },
      { id: 'trumpet', label: 'trumpet', snippet: 'note("c4 e4 g4").s("gm_trumpet")' },
      { id: 'sax', label: 'alto sax', snippet: 'note("c4 e4 g4").s("gm_alto_sax")' },
      { id: 'flute', label: 'flute', snippet: 'note("c5 e5 g5").s("gm_flute")' },
      { id: 'choir', label: 'choir', snippet: 'note("c3 e3 g3").s("gm_choir_aahs")' },
      { id: 'harp', label: 'harp', snippet: 'note("c4 e4 g4").s("gm_orchestral_harp")' },
      { id: 'marimba', label: 'marimba', snippet: 'note("c4 e4 g4").s("gm_marimba")' },
      { id: 'vibes', label: 'vibraphone', snippet: 'note("c4 e4 g4").s("gm_vibraphone")' },
    ],
  },
  {
    id: 'hydra',
    label: 'Hydra (visuals)',
    items: [
      { id: 'h-osc', label: 'osc', snippet: 'hydra(`osc(20,0.1,1.4).out()`)', hint: 'oscilador clásico' },
      { id: 'h-kal', label: 'kaleid', snippet: 'hydra(`osc(40,0.09).kaleid(4).out()`)', hint: 'caleidoscopio' },
      { id: 'h-feed', label: 'feedback', snippet: 'hydra(`osc().modulate(o0,.04).out()`)', hint: 'feedback loop' },
      { id: 'h-clear', label: 'clear', snippet: 'hydra(`solid().out()`)', hint: 'apagar' },
    ],
  },
  {
    id: 'midi',
    label: 'MIDI',
    items: [
      { id: 'midikeys', label: 'midikeys', snippet: 'note(midikeys()).s("piano")', hint: 'teclado del PC como MIDI' },
      { id: 'midin', label: 'midin(cc)', snippet: 'midin(74)', hint: 'lee control change' },
      { id: 'midiout', label: '.midi(…)', snippet: '.midi("IAC")', hint: 'envía a puerto MIDI' },
    ],
  },
  {
    id: 'fx',
    label: 'Efectos',
    items: [
      { id: 'gain', label: '.gain', snippet: '.gain(0.8)' },
      { id: 'pan', label: '.pan', snippet: '.pan(0.5)' },
      { id: 'speed', label: '.speed', snippet: '.speed(1)' },
      { id: 'room', label: '.room', snippet: '.room(0.4)' },
      { id: 'delay', label: '.delay', snippet: '.delay(0.3)' },
      { id: 'lpf', label: '.lpf', snippet: '.lpf(800)', hint: 'low-pass' },
      { id: 'hpf', label: '.hpf', snippet: '.hpf(200)', hint: 'high-pass' },
      { id: 'crush', label: '.crush', snippet: '.crush(8)' },
      { id: 'vowel', label: '.vowel', snippet: '.vowel("a e i")' },
      { id: 'every', label: '.every', snippet: '.every(4, rev)' },
      { id: 'fast', label: '.fast', snippet: '.fast(2)' },
      { id: 'slow', label: '.slow', snippet: '.slow(2)' },
      { id: 'jux', label: '.jux', snippet: '.jux(rev)' },
    ],
  },
];
