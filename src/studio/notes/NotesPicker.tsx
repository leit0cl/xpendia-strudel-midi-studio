import { useState } from 'react';
import { PresetsTab } from './PresetsTab';
import { PianoTab } from './PianoTab';
import { FreeTab } from './FreeTab';

type Mode = 'presets' | 'piano' | 'free';

export function NotesPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [mode, setMode] = useState<Mode>('presets');
  return (
    <div className="notes-picker">
      <div className="notes-tabs">
        {(['presets', 'piano', 'free'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`notes-tab ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'presets' ? 'presets' : m === 'piano' ? 'piano' : 'libre'}
          </button>
        ))}
      </div>
      <div className="notes-body">
        {mode === 'presets' && <PresetsTab value={value} onChange={onChange} />}
        {mode === 'piano' && <PianoTab value={value} onChange={onChange} />}
        {mode === 'free' && <FreeTab value={value} onChange={onChange} />}
      </div>
      <div className="notes-summary">
        {value.length > 0 ? value.join(' ') : <em>(sin notas)</em>}
      </div>
    </div>
  );
}
