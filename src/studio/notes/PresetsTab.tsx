import { CHORDS, CHORD_NAMES, SCALES, SCALE_NAMES } from './chords';

export function PresetsTab({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  // Detectar si el valor actual coincide con un preset (para resaltarlo)
  const current = JSON.stringify(value);

  return (
    <div className="notes-presets">
      <div className="notes-group">
        <h4>Acordes</h4>
        <div className="chip-grid">
          {CHORD_NAMES.map((name) => {
            const sel = JSON.stringify(CHORDS[name]) === current;
            return (
              <button
                key={name}
                type="button"
                className={`chip ${sel ? 'sel' : ''}`}
                onClick={() => onChange(CHORDS[name])}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="notes-group">
        <h4>Escalas</h4>
        <div className="chip-grid">
          {SCALE_NAMES.map((name) => {
            const sel = JSON.stringify(SCALES[name]) === current;
            return (
              <button
                key={name}
                type="button"
                className={`chip ${sel ? 'sel' : ''}`}
                onClick={() => onChange(SCALES[name])}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
