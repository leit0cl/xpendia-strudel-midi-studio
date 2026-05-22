import { useEffect, useState } from 'react';
import { AWESOME_PACKS, DEFAULT_PACKS, type SamplePack } from '../strudel/sample-packs';
import { ensurePack } from '../strudel/engine';
import { loadEnabledPacks, saveEnabledPacks } from '../persistence';

type State = Record<string, 'idle' | 'loading' | 'loaded' | 'error'>;

export function PacksPanel({
  open,
  onClose,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  onChange?: (count: number) => void;
}) {
  const [state, setState] = useState<State>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // hidratar estado inicial: lo guardado en localStorage queda como 'loading'
  // hasta confirmar (ya boot lo va a haber cargado en background).
  useEffect(() => {
    if (!open) return;
    const enabled = loadEnabledPacks();
    setState((prev) => {
      const next = { ...prev };
      for (const id of enabled) {
        if (!next[id]) next[id] = 'loaded';
      }
      return next;
    });
  }, [open]);

  async function toggle(pack: SamplePack) {
    const current = state[pack.id] ?? 'idle';
    if (current === 'loading') return;
    if (current === 'loaded') {
      // unload no es soportado por Strudel; sólo lo sacamos del listado guardado
      const newState = { ...state, [pack.id]: 'idle' as const };
      setState(newState);
      const enabled = loadEnabledPacks().filter((id) => id !== pack.id);
      saveEnabledPacks(enabled);
      onChange?.(countLoaded(newState));
      return;
    }
    setState((s) => ({ ...s, [pack.id]: 'loading' }));
    setErrors((e) => {
      const { [pack.id]: _, ...rest } = e;
      return rest;
    });
    try {
      await ensurePack(pack.shortcut);
      setState((s) => {
        const next = { ...s, [pack.id]: 'loaded' as const };
        onChange?.(countLoaded(next));
        return next;
      });
      const enabled = Array.from(new Set([...loadEnabledPacks(), pack.id]));
      saveEnabledPacks(enabled);
    } catch (e) {
      setState((s) => ({ ...s, [pack.id]: 'error' as const }));
      setErrors((er) => ({
        ...er,
        [pack.id]: String(e instanceof Error ? e.message : e),
      }));
    }
  }

  if (!open) return null;

  return (
    <div className="packs-backdrop" onClick={onClose}>
      <div className="packs-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Sample Packs</h2>
          <button type="button" className="ghost" onClick={onClose}>
            ✕
          </button>
        </header>

        <section className="packs-group">
          <h3>Default (siempre cargados)</h3>
          <ul className="packs-list">
            {DEFAULT_PACKS.map((p) => (
              <li key={p.id} className="loaded">
                <span className="check">✓</span>
                <div className="meta">
                  <strong>{p.label}</strong>
                  {p.description && <em>{p.description}</em>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="packs-group">
          <h3>Comunidad (awesome-strudel)</h3>
          <p className="packs-help">
            Cargá los packs que quieras tener disponibles. Se descargan al activarlos
            y se recuerdan en futuras sesiones.
          </p>
          <ul className="packs-list">
            {AWESOME_PACKS.map((p) => {
              const st = state[p.id] ?? 'idle';
              return (
                <li
                  key={p.id}
                  className={st}
                  onClick={() => toggle(p)}
                  role="button"
                >
                  <span className="check">
                    {st === 'loaded' ? '✓' : st === 'loading' ? '…' : st === 'error' ? '✕' : '☐'}
                  </span>
                  <div className="meta">
                    <strong>{p.label}</strong>
                    {p.description && <em>{p.description}</em>}
                    {st === 'error' && errors[p.id] && (
                      <span className="pack-error">{errors[p.id]}</span>
                    )}
                    <span className="pack-shortcut">{p.shortcut}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

function countLoaded(state: State): number {
  return Object.values(state).filter((v) => v === 'loaded').length;
}
