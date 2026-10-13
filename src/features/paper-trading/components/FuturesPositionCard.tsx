import { useEffect, useState } from 'react';
import { cn, GlossaryTerm } from '@/components/ui';
import { formatMoney, formatPrice, formatSignedMoney } from '@/lib/format';
import { liquidationPriceOf, type Prices } from '@/lib/trading/engine';
import { DEFAULT_FUNDING_RATE, FUNDING_INTERVAL_MS, fundingPayment } from '@/lib/trading/futures';
import type { Account, Instrument, Position } from '@/types';

export interface LiquidationState {
  /** Null when the position cannot be liquidated (the account covers it). */
  price: number | null;
  /** How far price is from liquidation, as a fraction of the current price. */
  distance: number | null;
  /** 0 at the entry price or better, 1 at the liquidation price. */
  used: number;
  level: 'safe' | 'caution' | 'danger';
}

/** Where a futures position stands between its entry and its liquidation price. */
export function liquidationState(account: Account, position: Position, mark: number, prices: Prices): LiquidationState {
  const raw = liquidationPriceOf(account, position, prices);
  if (raw == null || raw <= 0) return { price: null, distance: null, used: 0, level: 'safe' };
  const span = Math.abs(position.entryPrice - raw);
  const travelled = position.direction === 'long' ? position.entryPrice - mark : mark - position.entryPrice;
  const used = span > 0 ? Math.min(1, Math.max(0, travelled / span)) : 1;
  return { price: raw, distance: Math.abs(mark - raw) / mark, used, level: used >= 0.8 ? 'danger' : used >= 0.5 ? 'caution' : 'safe' };
}

const LEVEL_TEXT = { safe: 'Comfortable', caution: 'Getting close', danger: 'Near liquidation' } as const;
const LEVEL_BAR = { safe: 'bg-accent', caution: 'bg-warning', danger: 'bg-down' } as const;
const LEVEL_TONE = { safe: 'text-muted', caution: 'text-warning-text', danger: 'text-down-text' } as const;

function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}

function countdown(ms: number): string {
  const minutes = Math.max(0, Math.ceil(ms / 60_000));
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

/** Margin, liquidation distance and funding for an open futures position. */
export function FuturesPositionCard({ account, position, instrument, mark, prices }: { account: Account; position: Position; instrument: Instrument; mark: number; prices: Prices }) {
  const now = useNow(30_000);
  const futures = position.futures;
  if (!futures) return null;
  const state = liquidationState(account, position, mark, prices);
  const long = position.direction === 'long';
  const fmt = (v: number) => formatPrice(v, instrument.tickSize);
  const nextFunding = (Math.floor(now / FUNDING_INTERVAL_MS) + 1) * FUNDING_INTERVAL_MS;
  const nextPayment = fundingPayment(position.direction, mark * position.quantity, DEFAULT_FUNDING_RATE);

  return (
    <div className="mt-2 border-t border-border pt-2">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted">Leverage</dt>
        <dd className="num text-right text-fg">
          {futures.leverage}x {futures.marginMode}
        </dd>
        <dt className="text-muted">Margin in this trade</dt>
        <dd className="num text-right text-fg">{formatMoney(futures.margin)}</dd>
        <dt className="text-muted">
          <GlossaryTerm id="liquidation">Liquidation</GlossaryTerm> price
        </dt>
        <dd className="num text-right font-medium text-fg">{state.price != null ? fmt(state.price) : 'None'}</dd>
      </dl>

      {state.price != null && state.distance != null ? (
        <div className="mt-2">
          <div
            role="meter"
            aria-label="Distance to liquidation"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(state.used * 100)}
            aria-valuetext={`${LEVEL_TEXT[state.level]}: price is ${(state.distance * 100).toFixed(1)}% from liquidation`}
            className="h-2 overflow-hidden rounded-full bg-border"
          >
            <div className={cn('h-full rounded-full transition-[width] duration-150 motion-reduce:transition-none', LEVEL_BAR[state.level])} style={{ width: `${Math.max(2, state.used * 100)}%` }} />
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px]">
            <span className="text-muted">Entry</span>
            <span className={cn('font-medium', LEVEL_TONE[state.level])}>{LEVEL_TEXT[state.level]}</span>
            <span className="text-muted">Liquidation</span>
          </div>
          <p className="mt-1 text-xs text-fg">
            Price must {long ? 'fall' : 'rise'} <span className="num font-medium">{(state.distance * 100).toFixed(2)}%</span> to liquidate this position.
            {futures.marginMode === 'isolated' ? (
              <>
                {' '}
                That would lose its <span className="num">{formatMoney(futures.margin)}</span> margin and nothing more.
              </>
            ) : (
              ' In cross mode that would take most of the account with it.'
            )}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted">The account holds enough to cover this whole position, so it cannot be liquidated.</p>
      )}

      <p className="mt-2 text-xs text-muted">
        <GlossaryTerm id="funding-rate">Funding</GlossaryTerm> so far:{' '}
        <span className="num text-fg">{futures.fundingPaid === 0 ? '$0.00' : `${futures.fundingPaid > 0 ? 'paid' : 'received'} ${formatMoney(Math.abs(futures.fundingPaid))}`}</span>. Next in{' '}
        <span className="num text-fg">{countdown(nextFunding - now)}</span>: about <span className="num text-fg">{formatSignedMoney(-nextPayment)}</span>.
      </p>
    </div>
  );
}
