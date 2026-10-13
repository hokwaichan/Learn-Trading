import {
  cloneElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface AnchorProps {
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  'aria-describedby'?: string;
}

export interface TooltipProps {
  content: ReactNode;
  side?: Side;
  /** Wider box that wraps, for definitions rather than labels. */
  rich?: boolean;
  children: ReactElement<AnchorProps>;
}

const GAP = 6;
const MARGIN = 8;

/** Positions a floating box next to an anchor and keeps it inside the viewport. */
export function placeFloating(anchor: DOMRect, box: { width: number; height: number }, side: Side) {
  let top: number;
  let left: number;
  if (side === 'top' || side === 'bottom') {
    left = anchor.left + anchor.width / 2 - box.width / 2;
    top = side === 'top' ? anchor.top - box.height - GAP : anchor.bottom + GAP;
    if (top < MARGIN) top = anchor.bottom + GAP;
    if (top + box.height > window.innerHeight - MARGIN) top = anchor.top - box.height - GAP;
  } else {
    top = anchor.top + anchor.height / 2 - box.height / 2;
    left = side === 'left' ? anchor.left - box.width - GAP : anchor.right + GAP;
    if (left < MARGIN) left = anchor.right + GAP;
    if (left + box.width > window.innerWidth - MARGIN) left = anchor.left - box.width - GAP;
  }
  return {
    top: Math.max(MARGIN, Math.min(top, window.innerHeight - box.height - MARGIN)),
    left: Math.max(MARGIN, Math.min(left, window.innerWidth - box.width - MARGIN)),
  };
}

/** Shows on hover and on keyboard focus; hides on Escape. */
export function Tooltip({ content, side = 'top', rich, children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<Element | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);

  const show = useCallback((target: Element, delay: number) => {
    anchorRef.current = target;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  }, []);

  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
    setPos(null);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !boxRef.current) return;
    setPos(placeFloating(anchorRef.current.getBoundingClientRect(), boxRef.current.getBoundingClientRect(), side));
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', hide, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', hide, true);
    };
  }, [open, side, hide]);

  if (!content) return children;

  const anchor = cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      show(e.currentTarget, 300);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      if (e.currentTarget.matches(':focus-visible')) show(e.currentTarget, 0);
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      hide();
    },
    'aria-describedby': open ? id : children.props['aria-describedby'],
  });

  return (
    <>
      {anchor}
      {open &&
        createPortal(
          <div
            ref={boxRef}
            id={id}
            role="tooltip"
            style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? 'visible' : 'hidden' }}
            className={cn(
              'pointer-events-none fixed z-[70] rounded-control bg-raised text-fg shadow-raised animate-fade-in',
              rich ? 'max-w-72 px-3 py-2 text-[13px] leading-snug' : 'px-2 py-1 text-xs whitespace-nowrap',
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
