import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, cn } from '@/components/ui';
import { displaySymbol, instrumentsOfKind, searchInstruments } from '@/lib/data/instruments';
import type { Instrument } from '@/types';

/** Symbol pages keep their mode: searching from Futures stays in Futures. */
export function symbolPath(instrument: Instrument, pathname: string): string {
  if (instrument.kind === 'perpetual') return `/futures/${instrument.symbol}`;
  if (pathname.startsWith('/options')) return `/options/${instrument.symbol}`;
  return `/charts/${instrument.symbol}`;
}

export function instrumentTag(instrument: Instrument): string {
  if (instrument.kind === 'perpetual') return 'Perp';
  return { crypto: 'Crypto', stock: 'Stock', etf: 'ETF', forex: 'Forex' }[instrument.assetClass];
}

/** Top-bar symbol search: a combobox over every instrument. */
export function SymbolSearch({ className }: { className?: string }) {
  const listId = useId();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    // On the Futures page list perpetuals first; elsewhere spot first.
    const ordered = pathname.startsWith('/futures')
      ? [...instrumentsOfKind('perpetual'), ...instrumentsOfKind('spot')]
      : [...instrumentsOfKind('spot'), ...instrumentsOfKind('perpetual')];
    return searchInstruments(query, ordered).slice(0, 8);
  }, [query, pathname]);

  const choose = (instrument: Instrument) => {
    navigate(symbolPath(instrument, pathname));
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        role="combobox"
        aria-label="Search symbols"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder="Search symbols"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-8 w-full rounded-control border border-border bg-bg pr-2 pl-8 text-sm text-fg placeholder:text-muted focus-visible:outline-offset-0"
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Symbols"
          className="absolute top-full left-0 z-40 mt-1 w-full min-w-64 overflow-hidden rounded-card bg-raised py-1 shadow-raised animate-fade-in"
        >
          {results.length === 0 && <li className="px-3 py-2 text-sm text-muted">No symbol matches "{query}".</li>}
          {results.map((instrument, i) => (
            <li
              key={`${instrument.kind}-${instrument.symbol}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown, not click: fires before the input's blur closes the list.
              onMouseDown={(e) => {
                e.preventDefault();
                choose(instrument);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn('flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm', i === active && 'bg-accent/15')}
            >
              <span className="num w-24 shrink-0 font-medium text-fg">{displaySymbol(instrument)}</span>
              <span className="min-w-0 flex-1 truncate text-muted">{instrument.name}</span>
              <Badge>{instrumentTag(instrument)}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
