import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { create } from 'zustand';
import { t } from '@/i18n';
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
  dismiss: (id) => set((s) => ({ items: s.items.filter((item) => item.id !== id) })),
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
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:top-14 md:right-4 md:bottom-auto md:items-end"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role={item.tone === 'error' || item.tone === 'warning' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-card bg-raised px-3 py-2.5 shadow-raised animate-slide-up',
          )}
        >
          <span className="mt-0.5 shrink-0">{ICONS[item.tone]}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-fg">{item.title}</p>
            {item.description && <p className="mt-0.5 text-xs text-muted">{item.description}</p>}
          </div>
          <button
            type="button"
            aria-label={t('Dismiss')}
            onClick={() => dismiss(item.id)}
            className="shrink-0 rounded-sm p-0.5 text-muted hover:text-fg"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
