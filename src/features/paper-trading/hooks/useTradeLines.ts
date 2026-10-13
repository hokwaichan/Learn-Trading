import { useMemo } from 'react';
import type { PriceLine } from '@/components/chart';
import { formatQty } from '@/lib/format';
import { useAccount } from '@/stores';
import type { AccountId, Instrument } from '@/types';

/** Lines to draw on a chart for an instrument: the open position's entry, stop and target, and any waiting orders. */
export function useTradeLines(instrument: Instrument, accountId: AccountId = 'main'): PriceLine[] {
  const account = useAccount((s) => s.accounts[accountId]);
  return useMemo(() => {
    const lines: PriceLine[] = [];
    const mine = (x: { symbol: string; kind: Instrument['kind'] }) => x.symbol === instrument.symbol && x.kind === instrument.kind;
    const qty = (n: number) => formatQty(n, instrument.stepSize);

    for (const p of account.positions.filter(mine)) {
      lines.push({ price: p.entryPrice, title: `${p.direction === 'long' ? 'Long' : 'Short'} ${qty(p.quantity)}`, tone: 'accent' });
      if (p.stopLoss != null) lines.push({ price: p.stopLoss, title: 'Stop-loss', tone: 'down', dashed: true });
      if (p.takeProfit != null) lines.push({ price: p.takeProfit, title: 'Take-profit', tone: 'up', dashed: true });
    }
    for (const o of account.orders.filter((o) => o.status === 'open' && mine(o))) {
      const price = o.type === 'limit' ? o.limitPrice : o.stopPrice;
      if (price != null) lines.push({ price, title: `${o.side === 'buy' ? 'Buy' : 'Sell'} ${o.type} ${qty(o.quantity)}`, tone: 'muted', dashed: true });
    }
    return lines;
  }, [account, instrument]);
}
