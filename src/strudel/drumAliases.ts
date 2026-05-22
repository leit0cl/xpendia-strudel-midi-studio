import { samples as sdSamples } from 'superdough';

// Short-name aliases mapped to the CamelCase machine name shipped by
// tidal-drum-machines. Strudel docs and examples frequently use short
// flat names like `linn_bd` / `dmx_oh` / `tr808_sd`; we register those
// pointing at the same audio files so `s("linn_bd")` just works.
const PREFIX_MAP: Record<string, string> = {
  // Linn family
  linn: 'LinnLM1',
  linn1: 'LinnLM1',
  linn2: 'LinnLM2',
  linndrum: 'LinnDrum',
  linn9000: 'Linn9000',
  akailinn: 'AkaiLinn',
  // Oberheim
  dmx: 'OberheimDMX',
  oberheim: 'OberheimDMX',
  // Roland TR family
  tr808: 'RolandTR808', '808': 'RolandTR808',
  tr909: 'RolandTR909', '909': 'RolandTR909',
  tr707: 'RolandTR707', '707': 'RolandTR707',
  tr606: 'RolandTR606', '606': 'RolandTR606',
  tr505: 'RolandTR505', '505': 'RolandTR505',
  tr626: 'RolandTR626', '626': 'RolandTR626',
  tr727: 'RolandTR727', '727': 'RolandTR727',
  // Roland Compurhythm
  cr78: 'RolandCompurhythm78',
  cr1000: 'RolandCompurhythm1000',
  cr8000: 'RolandCompurhythm8000',
  // Roland MC
  mc202: 'RolandMC202',
  mc303: 'RolandMC303',
  // Boss DR
  dr55: 'BossDR55',
  dr110: 'BossDR110',
  dr220: 'BossDR220',
  dr550: 'BossDR550',
  // Emu
  sp12: 'EmuSP12',
  drumulator: 'EmuDrumulator',
  // Akai MPC
  mpc60: 'AkaiMPC60',
  mpc1000: 'MPC1000',
  xr10: 'AkaiXR10',
  // Alesis
  hr16: 'AlesisHR16',
  sr16: 'AlesisSR16',
  // Korg
  kpr77: 'KorgKPR77',
  kr55: 'KorgKR55',
  ddm110: 'KorgDDM110',
  // Casio
  rz1: 'CasioRZ1',
  sk1: 'CasioSK1',
  // Misc
  mfb512: 'MFB512',
  rm50: 'YamahaRM50',
  rx21: 'YamahaRX21',
  rx5: 'YamahaRX5',
  ry30: 'YamahaRY30',
  sds5: 'SimmonsSDS5',
  sds400: 'SimmonsSDS400',
};

const TDM_URL = 'https://strudel.b-cdn.net/tidal-drum-machines.json';

/**
 * Fetches the tidal-drum-machines manifest and registers short aliases
 * (linn_bd, dmx_oh, tr808_sd, …) that resolve to the same WAVs as the
 * existing CamelCase keys. Idempotent: safe to call once at boot.
 */
export async function registerDrumAliases(): Promise<void> {
  let json: Record<string, unknown>;
  try {
    const res = await fetch(TDM_URL);
    if (!res.ok) return;
    json = await res.json();
  } catch {
    return;
  }

  const base = typeof json._base === 'string' ? json._base : '';
  const aliases: Record<string, string[]> = {};

  for (const [key, files] of Object.entries(json)) {
    if (key === '_base' || !Array.isArray(files)) continue;
    const us = key.indexOf('_');
    if (us < 0) continue;
    const machine = key.slice(0, us);
    const role = key.slice(us + 1);

    for (const [short, full] of Object.entries(PREFIX_MAP)) {
      if (full === machine) {
        aliases[`${short}_${role}`] = (files as string[]).map((f) =>
          /^https?:/i.test(f) ? f : base + f,
        );
      }
    }
  }

  if (Object.keys(aliases).length === 0) return;
  await sdSamples(aliases);
}
