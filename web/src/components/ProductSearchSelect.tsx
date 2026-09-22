'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

export interface ProductOption {
  id: string;
  name: string;
  code?: string | null;
  hint?: string; // e.g. "30 piece" (stock in the chosen warehouse)
}

interface ProductSearchSelectProps {
  options: ProductOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
}

const MAX_RESULTS = 100;

const normalize = (s: string) => (s || '').toLowerCase().replace(/[‘’ʻʼ`']/g, "'").trim();

/**
 * Searchable product picker (combobox). Type any part of the name or code;
 * several words narrow the result ("вискозиметр 0,99"). Keyboard: ↑ ↓ Enter Esc.
 * The list is rendered at <body> level so it is never clipped by a scrolling modal.
 */
export const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Mahsulot nomi yoki kodi bo‘yicha qidiring...',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; bottom: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return options.slice(0, MAX_RESULTS);
    const out: ProductOption[] = [];
    for (const o of options) {
      const hay = normalize(`${o.name} ${o.code || ''}`);
      if (tokens.every((t) => hay.includes(t))) {
        out.push(o);
        if (out.length >= MAX_RESULTS) break;
      }
    }
    return out;
  }, [options, query]);

  const updateRect = () => {
    const r = boxRef.current?.getBoundingClientRect();
    if (r) setRect({ left: r.left, top: r.top, width: r.width, bottom: r.bottom });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateRect();
    const onMove = () => updateRect();
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (boxRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
      setQuery('');
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const choose = (o: ProductOption) => {
    onChange(o.id);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[active]) choose(filtered[active]);
      else setOpen(true);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // Open upwards when there is not enough room below.
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 400;
  const openUp = rect ? spaceBelow < 260 && rect.top > spaceBelow : false;
  const listMaxHeight = Math.max(160, Math.min(320, (openUp ? rect?.top ?? 320 : spaceBelow) - 12));

  const list =
    open && rect && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={listRef}
            role="listbox"
            style={{
              position: 'fixed',
              left: rect.left,
              width: Math.max(rect.width, 320),
              maxHeight: listMaxHeight,
              ...(openUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
              zIndex: 1000,
            }}
            className="overflow-y-auto rounded-xl border border-white/15 bg-slate-900 shadow-2xl"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-400">Hech narsa topilmadi</div>
            ) : (
              filtered.map((o, i) => (
                <button
                  type="button"
                  key={o.id}
                  data-idx={i}
                  role="option"
                  aria-selected={o.id === value}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(o)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-3 ${
                    i === active ? 'bg-indigo-600 text-white' : o.id === value ? 'bg-slate-800 text-white' : 'text-slate-200'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{o.name}</span>
                    {o.code ? (
                      <span className={`block font-mono text-[10px] ${i === active ? 'text-indigo-100' : 'text-indigo-400'}`}>
                        {o.code}
                      </span>
                    ) : null}
                  </span>
                  {o.hint ? (
                    <span className={`shrink-0 text-[11px] ${i === active ? 'text-white' : 'text-slate-400'}`}>{o.hint}</span>
                  ) : null}
                </button>
              ))
            )}
            {filtered.length >= MAX_RESULTS && (
              <div className="px-3 py-2 text-[10px] text-slate-500 border-t border-white/10">
                Birinchi {MAX_RESULTS} ta natija ko‘rsatildi — aniqroq yozing
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-1.5 w-full px-2.5 py-1.5 text-xs bg-slate-800 border rounded-lg text-white ${
          open ? 'border-indigo-500' : 'border-white/10'
        }`}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          value={open ? query : selected ? `${selected.name}${selected.hint ? ` (${selected.hint})` : ''}` : ''}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={open && selected ? selected.name : placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-slate-500"
          role="combobox"
          aria-expanded={open}
          autoComplete="off"
        />
        {open && query ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-slate-400 hover:text-white"
            aria-label="Tozalash"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )}
      </div>
      {list}
    </div>
  );
};

export default ProductSearchSelect;
