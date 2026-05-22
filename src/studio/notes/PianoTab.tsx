// Mini-piano SVG de 2 octavas (c3..b4). Click sobre teclas las
// agrega/quita del array de notas.

const WHITE = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const SHARP_AFTER: Record<string, string> = {
  c: 'c#',
  d: 'd#',
  f: 'f#',
  g: 'g#',
  a: 'a#',
};
const OCTAVES = [3, 4];

type Key = { id: string; type: 'white' | 'black'; x: number; w: number };

const WHITE_W = 26;
const BLACK_W = 16;
const HEIGHT = 90;

function buildKeys(): Key[] {
  const keys: Key[] = [];
  let x = 0;
  for (const oct of OCTAVES) {
    for (const w of WHITE) {
      keys.push({ id: `${w}${oct}`, type: 'white', x, w: WHITE_W });
      x += WHITE_W;
    }
  }
  // posición de teclas negras: detrás de cada blanca correspondiente
  let bx = 0;
  for (const oct of OCTAVES) {
    for (const w of WHITE) {
      const sharp = SHARP_AFTER[w];
      if (sharp) {
        keys.push({
          id: `${sharp}${oct}`,
          type: 'black',
          x: bx + WHITE_W - BLACK_W / 2,
          w: BLACK_W,
        });
      }
      bx += WHITE_W;
    }
  }
  return keys;
}

const KEYS = buildKeys();
const TOTAL_W = WHITE.length * OCTAVES.length * WHITE_W;

export function PianoTab({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const set = new Set(value);

  const toggle = (id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    // mantener orden por pitch
    onChange(Array.from(next).sort(notePitchCompare));
  };

  return (
    <div className="notes-piano">
      <svg width={TOTAL_W} height={HEIGHT} viewBox={`0 0 ${TOTAL_W} ${HEIGHT}`}>
        {/* blancas primero, negras encima */}
        {KEYS.filter((k) => k.type === 'white').map((k) => {
          const active = set.has(k.id);
          return (
            <g key={k.id} onClick={() => toggle(k.id)} style={{ cursor: 'pointer' }}>
              <rect
                x={k.x}
                y={0}
                width={k.w - 1}
                height={HEIGHT}
                fill={active ? 'var(--accent)' : '#f6f7fb'}
                stroke="#0e0f12"
                strokeWidth="1"
                rx="2"
              />
              <text
                x={k.x + k.w / 2}
                y={HEIGHT - 6}
                textAnchor="middle"
                fontSize="9"
                fill={active ? '#fff' : '#666'}
                style={{ pointerEvents: 'none', fontFamily: 'ui-monospace, monospace' }}
              >
                {k.id}
              </text>
            </g>
          );
        })}
        {KEYS.filter((k) => k.type === 'black').map((k) => {
          const active = set.has(k.id);
          return (
            <g key={k.id} onClick={() => toggle(k.id)} style={{ cursor: 'pointer' }}>
              <rect
                x={k.x}
                y={0}
                width={k.w}
                height={HEIGHT * 0.6}
                fill={active ? 'var(--accent)' : '#1c1f26'}
                stroke="#0e0f12"
                strokeWidth="1"
                rx="2"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const PITCH: Record<string, number> = {
  c: 0, 'c#': 1, db: 1,
  d: 2, 'd#': 3, eb: 3,
  e: 4,
  f: 5, 'f#': 6, gb: 6,
  g: 7, 'g#': 8, ab: 8,
  a: 9, 'a#': 10, bb: 10,
  b: 11,
};

function notePitchCompare(a: string, b: string): number {
  const pa = parseNote(a);
  const pb = parseNote(b);
  return pa - pb;
}

function parseNote(n: string): number {
  const m = n.match(/^([a-g](?:#|b)?)(-?\d+)$/i);
  if (!m) return 0;
  const name = m[1].toLowerCase();
  const oct = parseInt(m[2], 10);
  return oct * 12 + (PITCH[name] ?? 0);
}
