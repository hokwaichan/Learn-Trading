import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button, IconButton } from './Button';
import { cn } from './cn';

interface DialogShellProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/**
 * Native <dialog>: the browser traps focus, restores it on close, closes on
 * Escape and makes the rest of the page inert.
 */
function DialogShell({ open, onClose, labelledBy, className, children }: DialogShellProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      // showModal focuses the first control (the Close button) unless told otherwise.
      el.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // A click that lands on the dialog element itself is on the backdrop.
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className={cn('m-0 max-h-none max-w-none border-0 bg-transparent p-0', className)}
    >
      {children}
    </dialog>
  );
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** 'warning' is for destructive or risky confirmations. */
  tone?: 'default' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  children: ReactNode;
}

const WIDTHS = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({ open, onClose, title, tone = 'default', size = 'md', footer, children }: ModalProps) {
  const titleId = useId();
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      className="fixed inset-0 grid size-full place-items-center p-4"
    >
      <div
        className={cn(
          'flex max-h-[min(85dvh,720px)] w-full flex-col rounded-card bg-raised shadow-raised animate-slide-up',
          WIDTHS[size],
          tone === 'warning' && 'border-t-2 border-warning',
        )}
      >
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          {tone === 'warning' && <AlertTriangle aria-hidden className="size-4 shrink-0 text-warning-text" />}
          <h2 id={titleId} className="flex-1 text-sm font-semibold text-fg">
            {title}
          </h2>
          <IconButton label="Close" size="sm" icon={<X className="size-4" />} onClick={onClose} />
        </header>
        <div className="overflow-y-auto px-4 py-4 text-sm text-fg">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-border px-4 py-3">{footer}</footer>}
      </div>
    </DialogShell>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
}

/** Warning-coloured confirmation for every destructive or risky action. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      tone="warning"
      size="sm"
      footer={
        <>
          <Button data-autofocus onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Fill most of the screen instead of sizing to content. */
  tall?: boolean;
}

/** Phone replacement for side and bottom panels. */
export function BottomSheet({ open, onClose, title, children, tall }: BottomSheetProps) {
  const titleId = useId();
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      className="fixed inset-0 flex size-full flex-col justify-end"
    >
      <div
        className={cn(
          'flex w-full flex-col rounded-t-card bg-raised shadow-raised animate-slide-up',
          'pb-[env(safe-area-inset-bottom)]',
          tall ? 'h-[85dvh]' : 'max-h-[85dvh]',
        )}
      >
        <div aria-hidden className="mx-auto mt-2 h-1 w-9 rounded-full bg-border" />
        <header className="flex items-center gap-2 px-4 py-2">
          <h2 id={titleId} className="flex-1 text-sm font-semibold text-fg">
            {title}
          </h2>
          <IconButton label="Close" size="sm" icon={<X className="size-4" />} onClick={onClose} />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </DialogShell>
  );
}
