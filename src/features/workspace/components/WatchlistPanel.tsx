import { useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, cn, EmptyState, Pnl, Skeleton } from '@/components/ui';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { quoteKey, useMarket } from '@/stores';
import type { Instrument } from '@/types';

const REFRESH_MS = 20_000;

function pathFor(instrument: Instrument): string {
  return `${instrument.kind === 'perpetual' ? '/futures' : '/charts'}/${instrument.symbol}`;
}

/** Saved symbols with their latest price and daily change. */
export function WatchlistPanel({ current }: { current: Instrument }) {
  const watchlist = useMarket((s) => s.watchlist);
  const quotes = useMarket((s) => s.quotes);
  const refreshQuotes = useMarket((s) => s.refreshQuotes);
  const toggleWatch = useMarket((s) => s.toggleWatch);

  useEffect(() => {
    void refreshQuotes();
    const timer = setInterval(() => void refreshQuotes(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [refreshQuotes, watchlist]);

  if (watchlist.length === 0) {
    return (
      <EmptyState
        icon={<Star />}
        title="Your watchlist is empty"
        description="Use the star next to the symbol in the toolbar to add the chart you are looking at."
      />
    );
  }

  return (
    <ul aria-label="Watchlist" className="flex flex-col">
      {watchlist.map((item) => {
        const instrument = findInstrument(item.symbol, item.kind);
        if (!instrument) return null;
        const quote = quotes[quoteKey(item)];
        const active = instrument.symbol === current.symbol && instrument.kind === current.kind;
        return (
          <li key={quoteKey(item)} className={cn('group flex items-center border-b border-border', active && 'bg-accent/10')}>
            <Link
              to={pathFor(instrument)}
              aria-current={active ? 'page' : undefined}
              className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 hover:bg-raised"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="num text-sm font-medium text-fg">{displaySymbol(instrument)}</span>
                  {instrument.kind === 'perpetual' && <Badge>Perp</Badge>}
                  {!instrument.live && <Badge>Daily</Badge>}
                </span>
                <span className="block truncate text-xs text-muted">{instrument.name}</span>
              </span>
              {quote ? (
                <span className="flex flex-col items-end">
                  <span className="num text-sm text-fg">{formatPrice(quote.last, instrument.tickSize)}</span>
                  <Pnl value={quote.changePct} format="pct" className="text-xs" />
                </span>
              ) : (
                <span className="flex flex-col items-end gap-1" aria-label="Loading price">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3 w-10" />
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={`Remove ${displaySymbol(instrument)} from watchlist`}
              onClick={() => toggleWatch(item)}
              className="mr-1 rounded-sm p-1 text-muted opacity-0 group-hover:opacity-100 hover:text-fg focus-visible:opacity-100"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
