import { useMemo } from 'react';
import type { StringsParams } from '../types';
import { SLOWS, STRINGS_INSTRUMENTS } from '../presets';
import { NotesPicker } from '../notes/NotesPicker';
import { useMelodicSounds } from '../../strudel/useSounds';
import { Select, type SelectGroup, type SelectOption } from '../../components/Select';

const STRING_KEYWORDS = /(string|violin|viola|cello|contrabass|harp|choir|voice|strings|bowed|tremolo|pizz)/i;

export function StringsForm({
  params,
  onChange,
}: {
  params: StringsParams;
  onChange: (p: StringsParams) => void;
}) {
  const set = <K extends keyof StringsParams>(k: K, v: StringsParams[K]) =>
    onChange({ ...params, [k]: v });

  const runtimeSounds = useMelodicSounds();
  const extra = useMemo(() => {
    const curatedIds = new Set(STRINGS_INSTRUMENTS.map((i) => i.id));
    return runtimeSounds
      .filter((s) => !curatedIds.has(s.name) && STRING_KEYWORDS.test(s.name))
      .map((s) => s.name);
  }, [runtimeSounds]);

  const instrumentOptions = useMemo<SelectGroup[]>(() => {
    const groups: SelectGroup[] = [
      {
        label: 'Curados',
        options: STRINGS_INSTRUMENTS.map((i) => ({ value: i.id, label: i.label })),
      },
    ];
    if (extra.length > 0) {
      groups.push({
        label: `Otros packs (${extra.length})`,
        options: extra.map((name) => ({ value: name, label: name })),
      });
    }
    return groups;
  }, [extra]);

  const slowOptions: SelectOption[] = SLOWS.map((s) => ({
    value: String(s.id),
    label: s.label,
  }));

  return (
    <div className="form-grid">
      <label className="full">
        <span>Notas (acorde)</span>
        <NotesPicker value={params.notes} onChange={(notes) => set('notes', notes)} />
      </label>
      <label>
        <span>Instrumento</span>
        <Select
          value={params.instrument}
          onChange={(v) => set('instrument', v)}
          options={instrumentOptions}
          searchable
          ariaLabel="Instrumento de cuerdas"
        />
      </label>
      <label>
        <span>Lento</span>
        <Select
          value={String(params.slow)}
          onChange={(v) => set('slow', parseFloat(v))}
          options={slowOptions}
          ariaLabel="Lento"
        />
      </label>
      <label>
        <span>Reverb</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={params.reverb}
          onChange={(e) => set('reverb', parseFloat(e.target.value))}
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={params.tremolo}
          onChange={(e) => set('tremolo', e.target.checked)}
        />
        <span>Trémolo</span>
      </label>
    </div>
  );
}
