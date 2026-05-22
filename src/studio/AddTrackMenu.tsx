import type { TrackType } from './types';

const TYPES: { id: TrackType; label: string; icon: string; desc: string }[] = [
  { id: 'drums', label: 'Drums', icon: '🥁', desc: 'ritmo base con bombo, caja y hi-hats' },
  { id: 'bass', label: 'Bajo', icon: '🎸', desc: 'línea grave (bajo eléctrico, contrabajo, sub)' },
  { id: 'arpeggio', label: 'Melodía', icon: '🎹', desc: 'notas en secuencia (arpegio) o acorde completo' },
  { id: 'strings', label: 'Cuerdas', icon: '🎻', desc: 'ensemble de cuerdas con arco o pizzicato' },
  { id: 'pad', label: 'Pad', icon: '🌫️', desc: 'acorde sostenido de fondo' },
];

export function AddTrackMenu({ onAdd }: { onAdd: (type: TrackType) => void }) {
  return (
    <div className="add-track-menu">
      {TYPES.map((t) => (
        <button key={t.id} type="button" className="add-track-card" onClick={() => onAdd(t.id)}>
          <span className="add-track-icon">{t.icon}</span>
          <span className="add-track-label">{t.label}</span>
          <span className="add-track-desc">{t.desc}</span>
        </button>
      ))}
    </div>
  );
}
