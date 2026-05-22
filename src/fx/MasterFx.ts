// Master FX/EQ state — simple ref + subscribers, persisted in localStorage.
export interface MasterFxState {
  room: number;   // 0..1 reverb send
  delay: number;  // 0..1 delay send
  lpf: number;    // hz, 200..20000 (20000 = off)
  hpf: number;    // hz, 20..2000 (20 = off)
  gain: number;   // 0..1.5 master gain
}

export const DEFAULT_FX: MasterFxState = {
  room: 0,
  delay: 0,
  lpf: 20000,
  hpf: 20,
  gain: 1,
};

const LS_KEY = 'xpendia.masterFx';

let state: MasterFxState = loadOrDefault();
const listeners = new Set<(s: MasterFxState) => void>();

function loadOrDefault(): MasterFxState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_FX };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_FX, ...parsed };
  } catch {
    return { ...DEFAULT_FX };
  }
}

export function getMasterFxState(): MasterFxState {
  return state;
}

export function setMasterFxState(patch: Partial<MasterFxState>) {
  state = { ...state, ...patch };
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  for (const cb of listeners) cb(state);
}

export function resetMasterFx() {
  setMasterFxState(DEFAULT_FX);
}

export function subscribeFx(cb: (s: MasterFxState) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
