import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { BookA, ChartCandlestick, CornerDownLeft, GraduationCap, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/components/ui';
import { GLOSSARY } from '@/content/glossary';
import { MODULES } from '@/content/lessons';
import { displaySymbol, INSTRUMENTS } from '@/lib/data/instruments';
import { useCommandPalette } from './commandPaletteStore';
import { NAV_ITEMS } from './nav';
import { instrumentTag, symbolPath } from './SymbolSearch';

interface Command {
  id: string;
  group: 'Pages' | 'Symbols' | 'Lessons' | 'Glossary';
  title: string;
  subtitle?: string;
  /** Lower-case text the query is matched against. */
  haystack: string;
  icon: ReactNode;
  to: string;
}

const GROUP_ORDER: Command['group'][] = ['Pages', 'Symbols', 'Lessons', 'Glossary'];
const MAX_PER_GROUP = 6;

function buildCommands(pathname: string): Command[] {
  const pages: Command[] = NAV_ITEMS.map((item) => {
    const Icon = item.icon;
    return {
      id: `page-${item.id}`,
      group: 'Pages',
      title: item.label,
      haystack: `${item.label} ${item.keywords ?? ''}`.toLowerCase(),
      icon: <Icon aria-hidden className="size-4" />,
      to: item.to,
    };
  });
  const symbols: Command[] = INSTRUMENTS.map((i) => ({
    id: `symbol-${i.kind}-${i.symbol}`,
    group: 'Symbols',
    title: displaySymbol(i),
    subtitle: `${i.name} · ${instrumentTag(i)}`,
    haystack: `${i.symbol} ${i.base} ${i.name} ${instrumentTag(i)}`.toLowerCase(),
    icon: <ChartCandlestick aria-hidden className="size-4" />,
    to: symbolPath(i, pathname),
  }));
  const lessons: Command[] = MODULES.flatMap((m) =>
    m.lessons.map((l) => ({
      id: `lesson-${m.id}-${l.id}`,
      group: 'Lessons' as const,
      title: l.title,
      subtitle: m.title,
      haystack: `${l.title} ${l.summary} ${m.title}`.toLowerCase(),
      icon: <GraduationCap aria-hidden className="size-4" />,
      to: `/learn/${m.id}/${l.id}`,
    })),
  );
  const glossary: Command[] = GLOSSARY.map((g) => ({
    id: `term-${g.id}`,
    group: 'Glossary',
    title: g.term,
    subtitle: g.definition,
    haystack: `${g.term} ${g.aliases.join(' ')}`.toLowerCase(),
    icon: <BookA aria-hidden className="size-4" />,
    to: `/glossary#${g.id}`,
  }));
  return [...pages, ...symbols, ...lessons, ...glossary];
}

/** Every word of the query must appear; titles that start with the query rank first. */
function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const out: Command[] = [];
  for (const group of GROUP_ORDER) {
    const inGroup = commands.filter((c) => c.group === group);
    const matched = words.length === 0 ? (group === 'Pages' ? inGroup : []) : inGroup.filter((c) => words.every((w) => c.haystack.includes(w)));
    matched.sort((a, b) => Number(b.title.toLowerCase().startsWith(q)) - Number(a.title.toLowerCase().startsWith(q)));
    out.push(...(words.length === 0 ? matched : matched.slice(0, MAX_PER_GROUP)));
  }
  return out;
}

/** Ctrl/Cmd+K: search pages, symbols, lessons and glossary terms. */
export function CommandPalette() {
  const open = useCommandPalette((s) => s.open);
  const setOpen = useCommandPalette((s) => s.setOpen);
  const toggle = useCommandPalette((s) => s.toggle);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      setQuery('');
      setActive(0);
      el.showModal();
    }
    if (!open && el.open) el.close();
  }, [open]);

  const commands = useMemo(() => buildCommands(pathname), [pathname]);
  const results = useMemo(() => filterCommands(commands, query), [commands, query]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const run = (command: Command) => {
    setOpen(false);
    navigate(command.to);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClose={() => setOpen(false)}
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
      className="fixed inset-0 m-0 flex size-full max-h-none max-w-none items-start justify-center border-0 bg-transparent p-3 pt-[10dvh]"
    >
      <div className="flex max-h-[70dvh] w-full max-w-xl flex-col overflow-hidden rounded-card bg-raised shadow-raised animate-slide-up">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search aria-hidden className="size-4 shrink-0 text-muted" />
          <input
            autoFocus
            role="combobox"
            aria-label="Search symbols, lessons, glossary terms and pages"
            aria-expanded
            aria-controls="command-palette-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Search symbols, lessons, terms, pages"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-muted focus-visible:outline-0"
          />
          <kbd className="num rounded-sm border border-border px-1 text-[11px] text-muted">Esc</kbd>
        </div>

        <div ref={listRef} id="command-palette-list" role="listbox" aria-label="Results" className="overflow-y-auto py-1">
          {results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted">
              Nothing matches "{query}". Try a symbol like BTC, or a term like leverage.
            </p>
          )}
          {results.map((command, i) => {
            const firstOfGroup = i === 0 || results[i - 1].group !== command.group;
            return (
              <div key={command.id}>
                {firstOfGroup && (
                  <div aria-hidden className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                    {command.group}
                  </div>
                )}
                <div
                  id={`cmd-${command.id}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(command)}
                  className={cn(
                    'mx-1 flex cursor-pointer items-center gap-2.5 rounded-control px-2 py-1.5 text-sm',
                    i === active && 'bg-accent/15',
                  )}
                >
                  <span className="shrink-0 text-muted">{command.icon}</span>
                  <span className="shrink-0 text-fg">{command.title}</span>
                  {command.subtitle && <span className="min-w-0 flex-1 truncate text-xs text-muted">{command.subtitle}</span>}
                  {i === active && <CornerDownLeft aria-hidden className="ml-auto size-3.5 shrink-0 text-muted" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
