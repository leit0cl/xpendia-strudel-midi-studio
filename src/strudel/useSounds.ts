import { useEffect, useState } from 'react';
import { listMelodicSounds, type SoundInfo } from './sounds';

// Re-lee el registry cada N ms mientras el componente esté montado.
// Es lo más simple y suficiente — superdough no expone un evento "sound added".
const POLL_MS = 1500;

export function useMelodicSounds(): SoundInfo[] {
  const [sounds, setSounds] = useState<SoundInfo[]>(() => listMelodicSounds());
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setSounds((prev) => {
        const next = listMelodicSounds();
        // evitar re-render si no cambió la cantidad
        if (next.length === prev.length) return prev;
        return next;
      });
    };
    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);
  return sounds;
}
