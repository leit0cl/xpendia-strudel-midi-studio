export type SamplePack = {
  id: string;
  shortcut: string;
  label: string;
  description?: string;
};

// Packs cargados siempre (CDN de strudel.cc). Se muestran como referencia.
export const DEFAULT_PACKS: SamplePack[] = [
  { id: 'dirt', shortcut: 'github:tidalcycles/dirt-samples', label: 'Dirt Samples', description: 'Set base de Tidal (bd, sd, hh, cp…)' },
  { id: 'tidal-drum-machines', shortcut: 'cdn:tidal-drum-machines', label: 'Tidal Drum Machines', description: 'TR-909, TR-808, TR-707, LinnDrum…' },
  { id: 'piano', shortcut: 'cdn:piano', label: 'Piano Salamander' },
  { id: 'vcsl', shortcut: 'cdn:vcsl', label: 'VCSL Orquestal', description: 'Sample library acústica' },
  { id: 'uzu-drumkit', shortcut: 'cdn:uzu-drumkit', label: 'UZU Drumkit' },
  { id: 'uzu-wavetables', shortcut: 'cdn:uzu-wavetables', label: 'UZU Wavetables' },
  { id: 'mridangam', shortcut: 'cdn:mridangam', label: 'Mridangam', description: 'Percusión india' },
];

// Packs de la comunidad (curados desde awesome-strudel).
export const AWESOME_PACKS: SamplePack[] = [
  { id: 'algorave-dave', shortcut: 'github:algorave-dave/samples', label: 'Algorave Dave', description: 'Colección variada de live coder' },
  { id: 'audite-marlow', shortcut: 'github:AuditeMarlow/samples', label: 'AuditeMarlow' },
  { id: 'ms-teams', shortcut: 'github:AustinOliverHaskell/ms-teams-sounds-strudel', label: 'MS Teams Sounds', description: 'Notificaciones de Teams como percusión' },
  { id: 'experimentar02', shortcut: 'github:bruveping/RepositorioDesonidosParaExperimentar02', label: 'Bruveping Experimentar', description: 'Sonidos experimentales' },
  { id: 'dough-amen', shortcut: 'github:Bubobubobubobubo/Dough-Amen', label: 'Dough Amen', description: 'Amen breaks' },
  { id: 'dough-juj', shortcut: 'github:Bubobubobubobubo/Dough-Juj', label: 'Dough Juj' },
  { id: 'eddyflux-crate', shortcut: 'github:eddyflux/crate', label: 'Eddyflux Crate', description: 'Samples del live coder eddyflux' },
  { id: 'elo-morelo', shortcut: 'github:EloMorelo/samples', label: 'EloMorelo' },
  { id: 'emrexdeger', shortcut: 'github:emrexdeger/strudelSamples', label: 'Emrexdeger' },
  { id: 'fjpolo', shortcut: 'github:fjpolo/fjpolo-Strudel', label: 'FjPolo' },
  { id: 'polifonia', shortcut: 'github:fstiffo/polifonia-samples', label: 'Polifonia' },
  { id: 'cavlp', shortcut: 'github:hvillase/cavlp-25p', label: 'Cavlp 25p' },
  { id: 'k09', shortcut: 'github:k09/samples', label: 'k09 Samples' },
  { id: 'kaiye10', shortcut: 'github:kaiye10/strudelSamples', label: 'Kaiye10' },
  { id: 'garden', shortcut: 'github:mot4i/garden', label: 'Garden (mot4i)' },
  { id: 'msl', shortcut: 'github:mysinglelise/msl-strudel-samples', label: 'MSL Strudel' },
  { id: 'nikeryms', shortcut: 'github:Nikeryms/Samples', label: 'Nikeryms' },
  { id: 'departure', shortcut: 'github:prismograph/departure', label: 'Departure', description: 'Ambient & cinematic' },
  { id: 'quantum', shortcut: 'github:QuantumVillage/quantum-music', label: 'Quantum Music' },
  { id: 'riky', shortcut: 'github:RikyBac15/samples', label: 'RikyBac15' },
  { id: 'capoeira', shortcut: 'github:salsicha/capoeira_strudel', label: 'Capoeira', description: 'Percusión de capoeira' },
  { id: 'rochormatic', shortcut: 'github:sonidosingapura/rochormatic', label: 'Rochormatic' },
  { id: 'terrorhank', shortcut: 'github:terrorhank/samples', label: 'Terrorhank' },
  { id: 'tesspilot', shortcut: 'github:tesspilot/samples', label: 'Tesspilot' },
  { id: 'todepond', shortcut: 'github:TodePond/samples', label: 'TodePond', description: 'Samples experimentales' },
  { id: 'mirus', shortcut: 'github:TristanCacqueray/mirus', label: 'Mirus', description: 'Sonidos minimalistas' },
  { id: 'graffathon25', shortcut: 'github:Veikkosuhonen/graffathon25-demo', label: 'Graffathon 25' },
  { id: 'wyan', shortcut: 'github:wyan/livecoding-samples', label: 'Livecoding (Wyan)' },
  { id: 'clean-breaks', shortcut: 'github:yaxu/clean-breaks', label: 'Clean Breaks (Yaxu)', description: 'Breakbeats limpios' },
];
