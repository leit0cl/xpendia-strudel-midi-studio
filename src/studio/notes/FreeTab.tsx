import { useEffect, useState } from 'react';

const NOTE_RE = /^([a-g](?:#|b)?)(-?\d+)?$/i;

function parse(text: string): { ok: true; notes: string[] } | { ok: false; error: string } {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { ok: true, notes: [] };
  for (const t of tokens) {
    if (!NOTE_RE.test(t)) {
      return { ok: false, error: `nota inválida: "${t}"` };
    }
  }
  return { ok: true, notes: tokens.map((t) => t.toLowerCase()) };
}

export function FreeTab({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [text, setText] = useState(value.join(' '));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(value.join(' '));
  }, [value]);

  const apply = (t: string) => {
    setText(t);
    const r = parse(t);
    if (r.ok) {
      setError(null);
      onChange(r.notes);
    } else {
      setError(r.error);
    }
  };

  return (
    <div className="notes-free">
      <textarea
        value={text}
        onChange={(e) => apply(e.target.value)}
        spellCheck={false}
        rows={3}
        placeholder="ej: c3 e3 g3 b3"
      />
      {error && <div className="notes-error">{error}</div>}
      <p className="notes-help">
        Notas separadas por espacio: <code>c d eb f g ab</code> o con octava{' '}
        <code>c3 e3 g3</code>.
      </p>
    </div>
  );
}
