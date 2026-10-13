import { toast } from '@/components/ui';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatPrice, formatQty, formatSignedMoney } from '@/lib/format';
import type { EngineEvent } from '@/lib/trading/engine';

const EXIT_TITLE: Record<string, string> = { stop_loss: 'Stop-loss hit', take_profit: 'Take-profit hit', liquidation: 'Position liquidated' };

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
      const text = `${name} ${trade.direction} closed at ${formatPrice(trade.exitPrice, instrument?.tickSize)}: ${formatSignedMoney(trade.netPnl)}`;
      const title = EXIT_TITLE[trade.exitReason] ?? 'Position closed';
      if (trade.netPnl >= 0) toast.success(title, text);
      else toast.warning(title, text);
      continue;
    }
    if (event.type !== 'order_filled' && event.type !== 'order_rejected') continue;
    const instrument = findInstrument(event.order.symbol, event.order.kind);
    const name = instrument ? displaySymbol(instrument) : event.order.symbol;
    if (event.type === 'order_rejected') {
      toast.error('Order rejected', `${name}: ${event.reason}`);
    } else if (!event.order.positionId && event.order.type !== 'market') {
      toast.success(
        `${event.order.type === 'limit' ? 'Limit' : 'Stop'} order filled`,
        `${event.order.side === 'buy' ? 'Bought' : 'Sold'} ${formatQty(event.order.quantity, instrument?.stepSize)} ${name} at ${formatPrice(event.price, instrument?.tickSize)}`,
      );
    }
  }
}
