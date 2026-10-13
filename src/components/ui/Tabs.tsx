import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from './cn';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
  /** Small count or status shown after the label. */
  badge?: ReactNode;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Names the tab list for screen readers. */
  label: string;
  /** Prefix shared with the matching TabPanel ids. */
  idBase: string;
  variant?: 'underline' | 'pill';
  className?: string;
  /** Extra controls on the right edge of the tab strip. */
  trailing?: ReactNode;
}

/** Arrow keys move between tabs; Home and End jump to the ends. */
export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  label,
  idBase,
  variant = 'underline',
  className,
  trailing,
}: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next: number;
    if (e.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        variant === 'underline' && 'border-b border-border px-2',
        className,
      )}
    >
      <div role="tablist" aria-label={label} className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {items.map((item, i) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${idBase}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm transition-colors duration-150',
                variant === 'underline'
                  ? cn(
                      '-mb-px h-9 border-b-2 px-2',
                      selected ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg',
                    )
                  : cn(
                      'h-7 rounded-control px-2.5',
                      selected ? 'bg-raised text-fg' : 'text-muted hover:text-fg',
                    ),
              )}
            >
              {item.icon}
              {item.label}
              {item.badge != null && <span className="num text-xs text-muted">{item.badge}</span>}
            </button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}

export interface TabPanelProps {
  idBase: string;
  id: string;
  active: boolean;
  className?: string;
  children: ReactNode;
}

export function TabPanel({ idBase, id, active, className, children }: TabPanelProps) {
  if (!active) return null;
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${id}`}
      aria-labelledby={`${idBase}-tab-${id}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
