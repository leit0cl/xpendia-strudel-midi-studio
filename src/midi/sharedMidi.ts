// Shared in-memory MIDI buffer used to hand off a file loaded in the inline
// player to the converter dialog. No persistence needed.

let buffer: ArrayBuffer | null = null;
let fileName: string | null = null;
const listeners = new Set<() => void>();

export function setSharedMidi(buf: ArrayBuffer | null, name: string | null) {
  buffer = buf;
  fileName = name;
  for (const cb of listeners) cb();
}

export function getSharedMidi() {
  return { buffer, fileName };
}

export function subscribeSharedMidi(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
