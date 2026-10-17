import type { ReactNode } from 'react';
import { cn } from '@/components/ui';
import { t } from '@/i18n';
import { formatCompact, formatPrice, formatSignedPct } from '@/lib/format';
import type { Candle } from '@/types';

export interface LegendProps {
  title: string;
  /** e.g. '1h' or '1h · Heikin-Ashi'. */
  subtitle: string;
  candle: Candle | undefined;
  /** Close of the candle before, for the change figure. */
  previousClose: number | undefined;
  tickSize: number;
  /** True for line and area charts, which only plot the close. */
  closeOnly?: boolean;
  /** Extra rows under the price readout (indicator values). */
  children?: ReactNode;
  /** Receives the element that overlay indicators render their rows into. */
  slotRef?: (el: HTMLDivElement | null) => void;
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-muted">{label}</span> <span className={cn('num', className)}>{value}</span>
    </span>
  );
}

/** Top-left readout of the candle under the crosshair (or the latest one). */
export function Legend({ title, subtitle, candle, previousClose, tickSize, closeOnly, children, slotRef }: LegendProps) {
  const base = previousClose ?? candle?.open;
  const change = candle && base ? candle.close / base - 1 : 0;
  const tone = change > 0 ? 'text-up-text' : change < 0 ? 'text-down-text' : 'text-fg';
  const price = (v: number) => formatPrice(v, tickSize);

  return (
    <div className="pointer-events-none absolute top-1.5 left-2 z-[3] flex max-w-[calc(100%-5rem)] flex-col gap-0.5 text-xs">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <span className="font-semibold text-fg">{title}</span>
        <span className="text-muted">{subtitle}</span>
        {candle && (
          <>
            {!closeOnly && (
              <>
                <Field label="O" value={price(candle.open)} className={tone} />
                <Field label="H" value={price(candle.high)} className={tone} />
                <Field label="L" value={price(candle.low)} className={tone} />
              </>
            )}
            <Field label="C" value={price(candle.close)} className={tone} />
            <span className={cn('num whitespace-nowrap', tone)}>{formatSignedPct(change)}</span>
            {candle.volume > 0 && <Field label={t('Vol')} value={formatCompact(candle.volume)} className="text-fg" />}
          </>
        )}
      </div>
      <div ref={slotRef} className="flex flex-col items-start gap-0.5" />
      {children}
    </div>
  );
}
