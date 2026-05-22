import localforage from 'localforage';
import type { StudioState } from '../studio/types';

export type SongKind = 'code-song' | 'studio-song';

export interface SavedSongBase {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface CodeSong extends SavedSongBase {
  kind: 'code-song';
  code: string;
}

export interface StudioSong extends SavedSongBase {
  kind: 'studio-song';
  state: StudioState;
}

export type SavedSong = CodeSong | StudioSong;

const store = localforage.createInstance({
  name: 'xpendia-studio',
  storeName: 'my-music',
  description: 'Xpendia Studio — local music library',
});

function genId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function listSongs(): Promise<SavedSong[]> {
  const all: SavedSong[] = [];
  await store.iterate<SavedSong, void>((value) => {
    if (value && (value.kind === 'code-song' || value.kind === 'studio-song')) {
      all.push(value);
    }
  });
  // newest first
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getSong(id: string): Promise<SavedSong | null> {
  const v = await store.getItem<SavedSong>(id);
  return v ?? null;
}

export async function saveCodeSong(
  name: string,
  code: string,
  id?: string,
): Promise<CodeSong> {
  const now = Date.now();
  const existing = id ? await getSong(id) : null;
  const song: CodeSong = {
    kind: 'code-song',
    id: id ?? genId(),
    name: name.trim() || 'Untitled',
    code,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await store.setItem(song.id, song);
  return song;
}

export async function saveStudioSong(
  name: string,
  state: StudioState,
  id?: string,
): Promise<StudioSong> {
  const now = Date.now();
  const existing = id ? await getSong(id) : null;
  const song: StudioSong = {
    kind: 'studio-song',
    id: id ?? genId(),
    name: name.trim() || 'Untitled',
    state,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await store.setItem(song.id, song);
  return song;
}

export async function deleteSong(id: string): Promise<void> {
  await store.removeItem(id);
}

export async function renameSong(id: string, name: string): Promise<void> {
  const existing = await getSong(id);
  if (!existing) return;
  const next: SavedSong = {
    ...existing,
    name: name.trim() || existing.name,
    updatedAt: Date.now(),
  };
  await store.setItem(id, next);
}
