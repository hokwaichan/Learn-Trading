import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from './cn';

export interface ResizablePanelProps {
  /** Which edge of the layout the panel is docked to. The drag handle sits on the opposite edge. */
  dock: 'left' | 'right' | 'bottom';
  defaultSize: number;
  minSize: number;
  maxSize: number;
  /** Size and collapsed state are remembered under this key. */
  storageKey: string;
  /** Names the panel for screen readers, e.g. 'Order panel'. */
  label: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** Shown in place of the panel while collapsed (a slim bar with an expand button). */
  collapsedContent?: ReactNode;
  className?: string;
  children: ReactNode;
}

const STEP = 16;

function readSize(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(`tradeschool.panel.${key}`);
    const n = raw == null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

/**
 * A docked panel with a draggable edge. Keyboard: focus the handle, then use
 * the arrow keys to resize and Enter to collapse or expand.
 */
export function ResizablePanel({
  dock,
  defaultSize,
  minSize,
  maxSize,
  storageKey,
  label,
  collapsed,
  onCollapsedChange,
  collapsedContent,
  className,
  children,
}: ResizablePanelProps) {
  const clamp = useCallback((n: number) => Math.max(minSize, Math.min(maxSize, n)), [minSize, maxSize]);
  const [size, setSize] = useState(() => clamp(readSize(storageKey, defaultSize)));
  const drag = useRef<{ start: number; size: number } | null>(null);
  const horizontal = dock !== 'bottom';

  useEffect(() => {
    try {
      localStorage.setItem(`tradeschool.panel.${storageKey}`, String(size));
    } catch {
      // Storage can be unavailable (private mode); the panel still works.
    }
  }, [size, storageKey]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (collapsed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { start: horizontal ? e.clientX : e.clientY, size };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = (horizontal ? e.clientX : e.clientY) - drag.current.start;
    // Dragging away from the docked edge grows the panel.
    setSize(clamp(drag.current.size + (dock === 'left' ? delta : -delta)));
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const grow = dock === 'left' ? 'ArrowRight' : dock === 'right' ? 'ArrowLeft' : 'ArrowUp';
    const shrink = dock === 'left' ? 'ArrowLeft' : dock === 'right' ? 'ArrowRight' : 'ArrowDown';
    if (e.key === grow) setSize((s) => clamp(s + STEP));
    else if (e.key === shrink) setSize((s) => clamp(s - STEP));
    else if (e.key === 'Enter') onCollapsedChange(!collapsed);
    else return;
    e.preventDefault();
  };

  const handle = (
    <div
      role="separator"
      tabIndex={0}
      aria-label={`Resize ${label}`}
      aria-orientation={horizontal ? 'vertical' : 'horizontal'}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      aria-valuenow={Math.round(size)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => onCollapsedChange(!collapsed)}
      onKeyDown={onKeyDown}
      className={cn(
        'group relative z-10 shrink-0 touch-none bg-border transition-colors duration-150',
        'hover:bg-accent focus-visible:bg-accent focus-visible:outline-0',
        horizontal ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
        collapsed && 'cursor-default',
      )}
    >
      {/* Wider invisible hit area so the 1px line is easy to grab. */}
      <span className={cn('absolute', horizontal ? 'inset-y-0 -left-1 w-2' : 'inset-x-0 -top-1 h-2')} />
    </div>
  );

  const body = (
    <div
      role="region"
      aria-label={label}
      style={collapsed ? undefined : horizontal ? { width: size } : { height: size }}
      className={cn('min-h-0 min-w-0 shrink-0 overflow-hidden bg-surface', className)}
    >
      {collapsed ? collapsedContent : children}
    </div>
  );

  return (
    <div className={cn('flex min-h-0 min-w-0 shrink-0', horizontal ? 'flex-row' : 'flex-col')}>
      {dock === 'left' ? (
        <>
          {body}
          {handle}
        </>
      ) : (
        <>
          {handle}
          {body}
        </>
      )}
    </div>
  );
}
