import { useTranslation } from 'react-i18next';
import { CATALOG, type PaletteItem } from './catalog';

const LS_KEY = 'xpendia.palette.open';

function loadOpen(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // First-time defaults: open the first 2 groups, collapse the rest.
  const defaults: Record<string, boolean> = {};
  CATALOG.forEach((g, i) => {
    defaults[g.id] = i < 2;
  });
  return defaults;
}

function saveOpen(map: Record<string, boolean>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {}
}

function onDragStart(e: React.DragEvent<HTMLDivElement>, item: PaletteItem) {
  e.dataTransfer.setData('text/plain', item.snippet);
  e.dataTransfer.effectAllowed = 'copy';
}

export function Palette({ onInsert }: { onInsert: (snippet: string) => void }) {
  const { t } = useTranslation();
  const openMap = loadOpen();

  return (
    <aside className="palette">
      {CATALOG.map((group) => (
        <details
          key={group.id}
          className="palette-group"
          open={openMap[group.id] !== false}
          onToggle={(e) => {
            const next = { ...openMap, [group.id]: e.currentTarget.open };
            saveOpen(next);
          }}
        >
          <summary>{t(`palette.${group.id}`, group.label)}</summary>
          <div className="palette-chips">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="chip"
                draggable
                onDragStart={(e) => onDragStart(e, item)}
                onClick={() => onInsert(item.snippet)}
                title={item.hint ?? item.snippet}
              >
                {item.label}
              </div>
            ))}
          </div>
        </details>
      ))}
    </aside>
  );
}
