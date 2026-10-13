import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';
import { formatSignedMoney, formatSignedPct } from '@/lib/format';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** Buttons or links on the right of the header. */
  actions?: ReactNode;
  /** Remove body padding, e.g. when the card holds a table or chart. */
  flush?: boolean;
  as?: 'section' | 'div' | 'article';
}

export function Card({ title, actions, flush, as: Tag = 'section', className, children, ...rest }: CardProps) {
  return (
    <Tag className={cn('rounded-card border border-border bg-surface', className)} {...rest}>
      {(title || actions) && (
        <header className="flex min-h-10 items-center justify-between gap-2 border-b border-border px-4 py-2">
          <h2 className="text-sm font-semibold text-fg">{title}</h2>
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </header>
      )}
      <div className={cn(!flush && 'p-4')}>{children}</div>
    </Tag>
  );
}

export type Tone = 'neutral' | 'up' | 'down' | 'warning' | 'accent';

const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-fg',
  up: 'text-up-text',
  down: 'text-down-text',
  warning: 'text-warning-text',
  accent: 'text-accent-text',
};

export function toneOf(value: number): Tone {
  return value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
}

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  /** Secondary line under the value. */
  sub?: ReactNode;
  tone?: Tone;
  className?: string;
}

export function StatTile({ label, value, sub, tone = 'neutral', className }: StatTileProps) {
  return (
    <div className={cn('rounded-card border border-border bg-surface px-4 py-3', className)}>
      <div className="text-xs text-muted">{label}</div>
      <div className={cn('num mt-1 text-xl font-medium', TONE_TEXT[tone])}>{value}</div>
      {sub && <div className="num mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export interface PnlProps {
  value: number;
  /** 'money' prints +$1.00; 'pct' takes a fraction and prints +1.00%. */
  format?: 'money' | 'pct';
  decimals?: number;
  className?: string;
}

/** A profit or loss figure. Always carries a + or - sign as well as colour. */
export function Pnl({ value, format = 'money', decimals = 2, className }: PnlProps) {
  const text = format === 'money' ? formatSignedMoney(value, decimals) : formatSignedPct(value, decimals);
  const zero = !/[1-9]/.test(text);
  return <span className={cn('num', TONE_TEXT[zero ? 'neutral' : toneOf(value)], className)}>{text}</span>;
}

export interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const BADGE_TONES: Record<Tone, string> = {
  neutral: 'border-border text-muted',
  up: 'border-up/40 bg-up/10 text-up-text',
  down: 'border-down/40 bg-down/10 text-down-text',
  warning: 'border-warning/40 bg-warning/10 text-warning-text',
  accent: 'border-accent/40 bg-accent/10 text-accent-text',
};

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[11px] font-medium whitespace-nowrap',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
  label: string;
  tone?: Exclude<Tone, 'neutral'>;
  /** Show the percentage as text beside the bar. */
  showValue?: boolean;
  className?: string;
}

const BAR_TONES: Record<Exclude<Tone, 'neutral'>, string> = {
  accent: 'bg-accent',
  up: 'bg-up',
  down: 'bg-down',
  warning: 'bg-warning',
};

export function ProgressBar({ value, label, tone = 'accent', showValue, className }: ProgressBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-150', BAR_TONES[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && <span className="num w-9 text-right text-xs text-muted">{pct}%</span>}
    </div>
  );
}
