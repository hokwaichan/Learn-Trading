import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button, DataTable, EmptyState, Pnl, toast, type Column } from '@/components/ui';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatMoney, formatSignedMoney } from '@/lib/format';
import { nearestExpiry } from '@/lib/pricing/strategy';
import { priceKey } from '@/lib/trading/engine';
import { useAccount, useMarket } from '@/stores';
import type { Position, Strategy } from '@/types';

const DAY_MS = 86_400_000;

/** '+1 C 100 · -1 C 110', with the underlying leg first when there is one. */
export function legsSummary(strategy: Strategy): string {
  const parts = strategy.legs.map((l) => `${l.side === 'buy' ? '+' : '-'}${l.quantity} ${l.contract.type === 'call' ? 'C' : 'P'} ${l.contract.strike}`);
  if (strategy.stock) parts.unshift(`${strategy.stock.side === 'buy' ? '+' : '-'}${strategy.stock.quantity} ${strategy.underlying.replace(/USDT$/, '')}`);
  return parts.join(' · ');
}

/** Open option strategies on the main paper account, on every underlying. */
export function OptionPositions() {
  const all = useAccount((s) => s.accounts.main.positions);
  const closeStrategy = useAccount((s) => s.closeStrategy);
  const prices = useMarket((s) => s.lastPrices);
  const positions = all.filter((p) => p.option);
  const now = Date.now();

  const columns: Column<Position>[] = [
    {
      id: 'name',
      header: 'Strategy',
      cell: (p) => {
        const { strategy } = p.option!;
        const instrument = findInstrument(strategy.underlying, 'spot');
        return (
          <span className="flex flex-col leading-tight">
            <span className="font-medium text-fg">{strategy.name}</span>
            <Link to={`/options/${strategy.underlying}`} className="num text-[11px] text-muted underline-offset-2 hover:underline">
              {instrument ? displaySymbol(instrument) : strategy.underlying}
            </Link>
          </span>
        );
      },
      sortValue: (p) => p.option!.strategy.name,
    },
    { id: 'legs', header: 'Legs', cell: (p) => <span className="num text-xs text-muted">{legsSummary(p.option!.strategy)}</span>, hideOnPhone: true },
    {
      id: 'expiry',
      header: 'Expires',
      numeric: true,
      cell: (p) => {
        const expiry = nearestExpiry(p.option!.strategy);
        if (expiry == null) return '–';
        const days = (expiry - now) / DAY_MS;
        return days <= 0 ? <span className="text-warning-text">Settling</span> : days < 1 ? 'Today' : `${Math.ceil(days)}d`;
      },
      sortValue: (p) => nearestExpiry(p.option!.strategy) ?? 0,
    },
    { id: 'cost', header: 'Cost', numeric: true, hideOnPhone: true, cell: (p) => (p.entryPrice >= 0 ? formatMoney(p.entryPrice) : `${formatMoney(-p.entryPrice)} credit`) },
    { id: 'pnl', header: 'P&L', numeric: true, cell: (p) => <Pnl value={p.option!.markValue - p.entryPrice} />, sortValue: (p) => p.option!.markValue - p.entryPrice },
    {
      id: 'actions',
      header: '',
      align: 'right',
      cell: (p) => {
        const { strategy } = p.option!;
        const spot = prices[priceKey('spot', strategy.underlying)];
        return (
          <Button
            size="sm"
            disabled={spot == null}
            aria-label={`Close ${strategy.name}`}
            onClick={() => {
              const events = closeStrategy('main', p.id, spot!, findInstrument(strategy.underlying, 'spot')?.tickSize);
              const closed = events.find((e) => e.type === 'trade_closed');
              if (closed?.type === 'trade_closed') toast.info('Strategy closed', `${strategy.name}: ${formatSignedMoney(closed.trade.netPnl)}`);
            }}
          >
            Close
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      label="Open option positions"
      dense
      columns={columns}
      rows={positions}
      rowKey={(p) => p.id}
      empty={
        <EmptyState
          className="py-6"
          icon={<Layers />}
          title="No open option positions"
          description="Build a strategy and press Open paper position. It is then valued by the model as price and time move, and settled in cash at expiry."
        />
      }
    />
  );
}
