import type { DrumsParams } from '../types';
import { DRUM_BANKS, DRUM_PATTERN_LIST } from '../presets';
import { useMemo } from 'react';
import { Select, type SelectGroup } from '../../components/Select';

export function DrumsForm({
  params,
  onChange,
}: {
  params: DrumsParams;
  onChange: (p: DrumsParams) => void;
}) {
  const set = <K extends keyof DrumsParams>(k: K, v: DrumsParams[K]) =>
    onChange({ ...params, [k]: v });

  const bankGroups = useMemo<SelectGroup[]>(() => {
    const m = new Map<string, { value: string; label: string }[]>();
    for (const b of DRUM_BANKS) {
      if (!m.has(b.category)) m.set(b.category, []);
      m.get(b.category)!.push({ value: b.id, label: b.label });
    }
    return Array.from(m.entries()).map(([label, options]) => ({ label, options }));
  }, []);

  const patternGroups = useMemo<SelectGroup[]>(() => {
    const m = new Map<string, { value: string; label: string }[]>();
    for (const p of DRUM_PATTERN_LIST) {
      if (!m.has(p.category)) m.set(p.category, []);
      m.get(p.category)!.push({ value: p.id, label: p.label });
    }
    return Array.from(m.entries()).map(([label, options]) => ({ label, options }));
  }, []);

  return (
    <div className="form-grid">
      <label>
        <span>Banco</span>
        <Select
          value={params.bank}
          onChange={(v) => set('bank', v)}
          options={bankGroups}
          searchable
          ariaLabel="Banco de batería"
        />
      </label>
      <label>
        <span>Patrón</span>
        <Select
          value={params.pattern}
          onChange={(v) => set('pattern', v)}
          options={patternGroups}
          searchable
          ariaLabel="Patrón de batería"
        />
      </label>
      <label>
        <span>Intensidad</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={params.accent}
          onChange={(e) => set('accent', parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
}
