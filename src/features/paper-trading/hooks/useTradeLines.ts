import { useMemo } from 'react';
import type { PriceLine } from '@/components/chart';
import { formatQty } from '@/lib/format';
import { liquidationPriceOf, type Prices } from '@/lib/trading/engine';
import { useAccount, useMarket } from '@/stores';
import type { AccountId, Instrument } from '@/types';

const NO_PRICES: Prices = {};

/** Lines to draw on a chart for an instrument: the open position's entry, stop, target and liquidation price, and any waiting orders. */
export function useTradeLines(instrument: Instrument, accountId: AccountId = 'main'): PriceLine[] {
  const account = useAccount((s) => s.accounts[accountId]);
  // A cross position's liquidation price moves with the other positions, so it needs live prices.
  const hasCross = account.positions.some((p) => p.futures?.marginMode === 'cross');
  const prices = useMarket((s) => (hasCross ? s.lastPrices : NO_PRICES));
  return useMemo(() => {
    const lines: PriceLine[] = [];
    const mine = (x: { symbol: string; kind: Instrument['kind'] }) => x.symbol === instrument.symbol && x.kind === instrument.kind;
    const qty = (n: number) => formatQty(n, instrument.stepSize);

    for (const p of account.positions.filter(mine)) {
      lines.push({ price: p.entryPrice, title: `${p.direction === 'long' ? 'Long' : 'Short'} ${qty(p.quantity)}`, tone: 'accent' });
      if (p.stopLoss != null) lines.push({ price: p.stopLoss, title: 'Stop-loss', tone: 'down', dashed: true });
      if (p.takeProfit != null) lines.push({ price: p.takeProfit, title: 'Take-profit', tone: 'up', dashed: true });
      const liquidation = liquidationPriceOf(account, p, prices);
      if (liquidation != null && liquidation > 0) lines.push({ price: liquidation, title: 'Liquidation', tone: 'warning' });
    }
    for (const o of account.orders.filter((o) => o.status === 'open' && mine(o))) {
      const price = o.type === 'limit' ? o.limitPrice : o.stopPrice;
      if (price != null) lines.push({ price, title: `${o.side === 'buy' ? 'Buy' : 'Sell'} ${o.type} ${qty(o.quantity)}`, tone: 'muted', dashed: true });
    }
    return lines;
  }, [account, instrument, prices]);
}
