import { toast } from '@/components/ui';
import { t } from '@/i18n';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatPrice, formatQty, formatSignedMoney } from '@/lib/format';
import type { EngineEvent } from '@/lib/trading/engine';

const EXIT_TITLE: Record<string, string> = {
  stop_loss: t('Stop-loss hit'),
  take_profit: t('Take-profit hit'),
  liquidation: t('Position liquidated'),
  expiry: t('Options expired'),
  assignment: t('Options expired: short leg assigned'),
};

/**
 * Shows a toast for things the engine did without the user pressing a
 * button: a stop-loss or take-profit closing a position, a waiting order
 * filling, or an order being rejected at fill time.
 */
export function announceTradeEvents(events: EngineEvent[]): void {
  for (const event of events) {
    if (event.type === 'trade_closed') {
      const { trade } = event;
      const instrument = findInstrument(trade.symbol, trade.kind);
      const name = instrument ? displaySymbol(instrument) : trade.symbol;
      const text =
        trade.kind === 'option'
          ? t('{strategy} on {symbol}: {pnl}', {
              strategy: trade.label ?? t('Strategy'),
              symbol: findInstrument(trade.symbol, 'spot')?.base ?? trade.symbol,
              pnl: formatSignedMoney(trade.netPnl),
            })
          : t(trade.direction === 'long' ? '{name} long closed at {price}: {pnl}' : '{name} short closed at {price}: {pnl}', {
              name,
              price: formatPrice(trade.exitPrice, instrument?.tickSize),
              pnl: formatSignedMoney(trade.netPnl),
            });
      const title = EXIT_TITLE[trade.exitReason] ?? t('Position closed');
      if (trade.exitReason === 'liquidation') toast.error(title, t('{text}. The loss reached the margin backing the position.', { text }));
      else if (trade.netPnl >= 0) toast.success(title, text);
      else toast.warning(title, text);
      continue;
    }
    if (event.type === 'funding') {
      const instrument = findInstrument(event.position.symbol, event.position.kind);
      const name = instrument ? displaySymbol(instrument) : event.position.symbol;
      const paid = event.amount >= 0;
      toast.info(
        paid ? t('Funding paid') : t('Funding received'),
        `${name} ${event.position.direction === 'long' ? t('long') : t('short')}: ${formatSignedMoney(-event.amount)}`,
      );
      continue;
    }
    if (event.type !== 'order_filled' && event.type !== 'order_rejected') continue;
    const instrument = findInstrument(event.order.symbol, event.order.kind);
    const name = instrument ? displaySymbol(instrument) : event.order.symbol;
    if (event.type === 'order_rejected') {
      toast.error(t('Order rejected'), `${name}: ${event.reason}`);
    } else if (!event.order.positionId && event.order.type !== 'market') {
      toast.success(
        event.order.type === 'limit' ? t('Limit order filled') : t('Stop order filled'),
        t(event.order.side === 'buy' ? 'Bought {qty} {name} at {price}' : 'Sold {qty} {name} at {price}', {
          qty: formatQty(event.order.quantity, instrument?.stepSize),
          name,
          price: formatPrice(event.price, instrument?.tickSize),
        }),
      );
    }
  }
}
