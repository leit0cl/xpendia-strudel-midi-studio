import { useMemo } from 'react';
import type { PadParams } from '../types';
import { PAD_INSTRUMENTS, SLOWS } from '../presets';
import { NotesPicker } from '../notes/NotesPicker';
import { useMelodicSounds } from '../../strudel/useSounds';
import { Select, type SelectGroup, type SelectOption } from '../../components/Select';

export function PadForm({
  params,
  onChange,
}: {
  params: PadParams;
  onChange: (p: PadParams) => void;
}) {
  const set = <K extends keyof PadParams>(k: K, v: PadParams[K]) =>
    onChange({ ...params, [k]: v });

  const runtimeSounds = useMelodicSounds();
  const extra = useMemo(() => {
    const curatedIds = new Set(PAD_INSTRUMENTS.map((i) => i.id));
    return runtimeSounds.filter((s) => !curatedIds.has(s.name)).map((s) => s.name);
  }, [runtimeSounds]);

  const instrumentOptions = useMemo<SelectGroup[]>(() => {
    const groups: SelectGroup[] = [
      {
        label: 'Curados',
        options: PAD_INSTRUMENTS.map((i) => ({ value: i.id, label: i.label })),
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
          ariaLabel="Instrumento"
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
    </div>
  );
}
