import type { StudioState } from './studio/types';

const STORAGE_KEY_CODE = 'strudel-panel:code';
const STORAGE_KEY_STUDIO = 'strudel-panel:studio';
const STORAGE_KEY_MODE = 'strudel-panel:mode';
const STORAGE_KEY_PACKS = 'strudel-panel:packs';
const URL_PARAM_CODE = 'c';
const URL_PARAM_STUDIO = 's';

export type Mode = 'studio' | 'code';

export function loadInitialCode(fallback: string): string {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(URL_PARAM_CODE);
    if (encoded) return decodeURIComponent(atob(encoded));
  } catch {
    /* ignore */
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CODE);
    if (saved && saved.trim()) return saved;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function saveCode(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY_CODE, code);
  } catch {
    /* ignore */
  }
}

// Migra tracks viejos ({...params}) a la forma nueva con `segments`.
function migrateStudio(raw: unknown): StudioState {
  const s = raw as { tracks?: unknown[]; bpm?: number };
  if (!s || !Array.isArray(s.tracks)) return raw as StudioState;
  const tracks = s.tracks.map((rawT) => {
    const t = rawT as Record<string, unknown>;
    if (Array.isArray(t.segments) && t.segments.length > 0) return t;
    const params = t.params;
    if (!params) return { ...t, segments: [] };
    return {
      ...t,
      segments: [{ id: `s-${Math.random().toString(36).slice(2, 8)}`, bars: 4, params }],
      params: undefined,
    };
  });
  return { ...s, tracks } as StudioState;
}

export function loadInitialStudio(fallback: StudioState): StudioState {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(URL_PARAM_STUDIO);
    if (encoded) {
      const decoded = decodeURIComponent(atob(encoded));
      return migrateStudio(JSON.parse(decoded));
    }
  } catch {
    /* ignore */
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_STUDIO);
    if (saved) return migrateStudio(JSON.parse(saved));
  } catch {
    /* ignore */
  }
  return fallback;
}

export function saveStudio(s: StudioState) {
  try {
    localStorage.setItem(STORAGE_KEY_STUDIO, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function loadInitialMode(fallback: Mode): Mode {
  try {
    const v = localStorage.getItem(STORAGE_KEY_MODE);
    if (v === 'studio' || v === 'code') return v;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function saveMode(m: Mode) {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, m);
  } catch {
    /* ignore */
  }
}

export function loadEnabledPacks(): string[] {
  try {
    const v = localStorage.getItem(STORAGE_KEY_PACKS);
    if (v) {
      const arr = JSON.parse(v);
      if (Array.isArray(arr)) return arr.filter((x): x is string => typeof x === 'string');
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function saveEnabledPacks(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PACKS, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function buildShareURL(code: string): string {
  const encoded = btoa(encodeURIComponent(code));
  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAM_CODE, encoded);
  url.searchParams.delete(URL_PARAM_STUDIO);
  return url.toString();
}

export function buildShareStudioURL(s: StudioState): string {
  const encoded = btoa(encodeURIComponent(JSON.stringify(s)));
  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAM_STUDIO, encoded);
  url.searchParams.delete(URL_PARAM_CODE);
  return url.toString();
}
