import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from './cn';

export interface Column<Row> {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Provide to make the column sortable. */
  sortValue?: (row: Row) => number | string;
  align?: 'left' | 'right';
  /** Monospace tabular figures (prices, quantities, P&L). */
  numeric?: boolean;
  /** Hide below the md breakpoint to keep phone tables readable. */
  hideOnPhone?: boolean;
  className?: string;
}

export interface DataTableProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Names the table for screen readers. */
  label: string;
  onRowClick?: (row: Row) => void;
  initialSort?: { id: string; dir: 'asc' | 'desc' };
  /** Rendered instead of the body when there are no rows. */
  empty?: ReactNode;
  dense?: boolean;
  className?: string;
}

/** Sortable table with a sticky header. Scrolls inside its own container. */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  label,
  onRowClick,
  initialSort,
  empty,
  dense,
  className,
}: DataTableProps<Row>) {
  const [sort, setSort] = useState(initialSort ?? null);

  const sorted = useMemo(() => {
    const col = sort && columns.find((c) => c.id === sort.id);
    if (!sort || !col?.sortValue) return rows;
    const value = col.sortValue;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [rows, columns, sort]);

  const toggle = (id: string) =>
    setSort((s) => (s?.id === id ? { id, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { id, dir: 'desc' }));

  const pad = dense ? 'px-3 py-1.5' : 'px-3 py-2';

  return (
    <div className={cn('overflow-auto', className)}>
      <table aria-label={label} className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.id === col.id;
              return (
                <th
                  key={col.id}
                  scope="col"
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={cn(
                    'sticky top-0 z-10 border-b border-border bg-surface text-xs font-medium whitespace-nowrap text-muted',
                    pad,
                    col.align === 'right' || col.numeric ? 'text-right' : 'text-left',
                    col.hideOnPhone && 'hidden md:table-cell',
                  )}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggle(col.id)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm hover:text-fg',
                        active && 'text-fg',
                      )}
                    >
                      {col.header}
                      {active ? (
                        sort.dir === 'asc' ? (
                          <ArrowUp aria-hidden className="size-3" />
                        ) : (
                          <ArrowDown aria-hidden className="size-3" />
                        )
                      ) : (
                        <ChevronsUpDown aria-hidden className="size-3 opacity-60" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        {sorted.length > 0 && (
          <tbody>
            {sorted.map((row) => (
              <tr
                key={rowKey(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                className={cn(
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-raised focus-visible:bg-raised',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      'border-b border-border whitespace-nowrap text-fg',
                      pad,
                      col.numeric && 'num',
                      col.align === 'right' || col.numeric ? 'text-right' : 'text-left',
                      col.hideOnPhone && 'hidden md:table-cell',
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {sorted.length === 0 && empty}
    </div>
  );
}
