import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
};

type Items = SelectOption[] | SelectGroup[];

function isGrouped(items: Items): items is SelectGroup[] {
  return items.length > 0 && (items[0] as SelectGroup).options !== undefined;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar…',
  searchable,
  className,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Items;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const flat = useMemo<{ option: SelectOption; group?: string }[]>(() => {
    const acc: { option: SelectOption; group?: string }[] = [];
    if (isGrouped(options)) {
      for (const g of options) for (const o of g.options) acc.push({ option: o, group: g.label });
    } else {
      for (const o of options) acc.push({ option: o });
    }
    return acc;
  }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flat;
    return flat.filter(
      ({ option, group }) =>
        option.label.toLowerCase().includes(q) ||
        option.value.toLowerCase().includes(q) ||
        (group ?? '').toLowerCase().includes(q),
    );
  }, [flat, query]);

  const selected = flat.find((f) => f.option.value === value)?.option;

  const updatePos = useCallback(() => {
    const t = triggerRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
    const handler = () => updatePos();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIdx(-1);
      return;
    }
    const idx = filtered.findIndex((f) => f.option.value === value);
    setActiveIdx(idx >= 0 ? idx : 0);
    if (searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const commit = (v: string) => {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) commit(item.option.value);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(filtered.length - 1);
    }
  };

  const renderList = () => {
    if (filtered.length === 0) {
      return <div className="ui-select-empty">Sin resultados</div>;
    }
    const rows: React.ReactNode[] = [];
    let lastGroup: string | undefined = undefined;
    filtered.forEach((f, i) => {
      if (f.group && f.group !== lastGroup) {
        rows.push(
          <div key={`g-${f.group}-${i}`} className="ui-select-group">
            {f.group}
          </div>,
        );
        lastGroup = f.group;
      }
      const isActive = i === activeIdx;
      const isSelected = f.option.value === value;
      rows.push(
        <div
          key={`o-${f.option.value}`}
          data-idx={i}
          role="option"
          aria-selected={isSelected}
          className={
            'ui-select-option' +
            (isActive ? ' active' : '') +
            (isSelected ? ' selected' : '')
          }
          onMouseEnter={() => setActiveIdx(i)}
          onMouseDown={(e) => {
            e.preventDefault();
            commit(f.option.value);
          }}
        >
          <span className="ui-select-option-label">{f.option.label}</span>
          {f.option.hint && <span className="ui-select-option-hint">{f.option.hint}</span>}
          {isSelected && <span className="ui-select-check">✓</span>}
        </div>,
      );
    });
    return rows;
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={'ui-select-trigger' + (className ? ' ' + className : '') + (open ? ' open' : '')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={'ui-select-value' + (selected ? '' : ' placeholder')}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="ui-select-caret" aria-hidden>
          ▾
        </span>
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={popupRef}
            className="ui-select-popup"
            style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
            role="listbox"
            id={listId}
            onKeyDown={onKeyDown}
          >
            {searchable && (
              <div className="ui-select-search">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIdx(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Buscar…"
                />
              </div>
            )}
            <div className="ui-select-list" ref={listRef}>
              {renderList()}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
