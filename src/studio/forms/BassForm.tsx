import { useMemo } from 'react';
import type { BassParams } from '../types';
import { ARPEGGIO_DIRECTIONS, BASS_INSTRUMENTS, SPEEDS } from '../presets';
import { NotesPicker } from '../notes/NotesPicker';
import { useMelodicSounds } from '../../strudel/useSounds';
import { Select, type SelectGroup, type SelectOption } from '../../components/Select';

const BASS_KEYWORDS = /(bass|bajo|contrabass|tuba|sub|808|low)/i;

export function BassForm({
  params,
  onChange,
}: {
  params: BassParams;
  onChange: (p: BassParams) => void;
}) {
  const set = <K extends keyof BassParams>(k: K, v: BassParams[K]) =>
    onChange({ ...params, [k]: v });

  const mode = params.mode ?? 'arpeggio';

  const runtimeSounds = useMelodicSounds();
  const extra = useMemo(() => {
    const curatedIds = new Set(BASS_INSTRUMENTS.map((i) => i.id));
    return runtimeSounds
      .filter((s) => !curatedIds.has(s.name) && BASS_KEYWORDS.test(s.name))
      .map((s) => s.name);
  }, [runtimeSounds]);

  const instrumentOptions = useMemo<SelectGroup[]>(() => {
    const groups: SelectGroup[] = [
      {
        label: 'Curados',
        options: BASS_INSTRUMENTS.map((i) => ({ value: i.id, label: i.label })),
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

  const modeOptions: SelectOption[] = [
    { value: 'arpeggio', label: 'Línea (una a una)' },
    { value: 'chord', label: 'Bloque (todas a la vez)' },
  ];

  const directionOptions: SelectOption[] = ARPEGGIO_DIRECTIONS.map((d) => ({
    value: d.id,
    label: d.label,
  }));

  const speedOptions: SelectOption[] = SPEEDS.map((s) => ({
    value: String(s.id),
    label: s.label,
  }));

  return (
    <div className="form-grid">
      <label className="full">
        <span>Notas (octavas graves)</span>
        <NotesPicker value={params.notes} onChange={(notes) => set('notes', notes)} />
      </label>
      <label>
        <span>Modo</span>
        <Select
          value={mode}
          onChange={(v) => set('mode', v as BassParams['mode'])}
          options={modeOptions}
          ariaLabel="Modo de bajo"
        />
      </label>
      {mode === 'arpeggio' && (
        <label>
          <span>Dirección</span>
          <Select
            value={params.direction}
            onChange={(v) => set('direction', v as BassParams['direction'])}
            options={directionOptions}
            ariaLabel="Dirección"
          />
        </label>
      )}
      <label>
        <span>Velocidad</span>
        <Select
          value={String(params.speed)}
          onChange={(v) => set('speed', parseFloat(v))}
          options={speedOptions}
          ariaLabel="Velocidad"
        />
      </label>
      <label>
        <span>Instrumento</span>
        <Select
          value={params.instrument}
          onChange={(v) => set('instrument', v)}
          options={instrumentOptions}
          searchable
          ariaLabel="Instrumento de bajo"
        />
      </label>
    </div>
  );
}
