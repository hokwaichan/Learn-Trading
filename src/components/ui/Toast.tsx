import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { create } from 'zustand';
import { cn } from './cn';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastStore {
  items: ToastItem[];
  push: (item: Omit<ToastItem, 'id'>, durationMs: number) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

const useToastStore = create<ToastStore>((set, get) => ({
  items: [],
  push: (item, durationMs) => {
    const id = nextId++;
    set((s) => ({ items: [...s.items.slice(-3), { ...item, id }] }));
    if (durationMs > 0) window.setTimeout(() => get().dismiss(id), durationMs);
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

/** Show a toast from anywhere: toast.success('Order filled', 'Bought 0.01 BTC'). */
export const toast = {
  info: (title: string, description?: string) => useToastStore.getState().push({ tone: 'info', title, description }, 4000),
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'success', title, description }, 4000),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'warning', title, description }, 7000),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'error', title, description }, 8000),
};

const ICONS = {
  info: <Info aria-hidden className="size-4 text-accent-text" />,
  success: <CheckCircle2 aria-hidden className="size-4 text-up-text" />,
  warning: <AlertTriangle aria-hidden className="size-4 text-warning-text" />,
  error: <XCircle aria-hidden className="size-4 text-down-text" />,
};

/** Mount once in the app shell. */
export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-4 md:bottom-12 md:items-end"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' || t.tone === 'warning' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-card bg-raised px-3 py-2.5 shadow-raised animate-slide-up',
          )}
        >
          <span className="mt-0.5 shrink-0">{ICONS[t.tone]}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-fg">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-muted">{t.description}</p>}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-sm p-0.5 text-muted hover:text-fg"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
