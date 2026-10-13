import type { GlossaryEntry } from '@/types';

/**
 * Glossary entries. To add a term, append an object here: it appears on the
 * Glossary page, in the command palette, and is auto-linked wherever `term`
 * or one of its `aliases` appears in lesson text.
 */
export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'candle',
    term: 'Candlestick',
    aliases: ['candle', 'candles', 'candlesticks'],
    definition:
      'One bar on a price chart showing four prices for a period of time: the open, the high, the low and the close.',
    seeAlso: ['timeframe', 'ohlc'],
  },
  {
    id: 'ohlc',
    term: 'OHLC',
    aliases: [],
    definition: 'Short for open, high, low, close: the four prices that describe one candlestick.',
    seeAlso: ['candle'],
  },
  {
    id: 'timeframe',
    term: 'Timeframe',
    aliases: ['timeframes'],
    definition: 'How much time one candlestick covers, such as 1 minute, 1 hour or 1 day.',
    seeAlso: ['candle'],
  },
  {
    id: 'long',
    term: 'Long',
    aliases: ['going long', 'long position'],
    definition: 'Buying something because you expect its price to rise; you profit if it goes up.',
    seeAlso: ['short'],
  },
  {
    id: 'short',
    term: 'Short',
    aliases: ['going short', 'short position', 'shorting'],
    definition:
      'Selling something you have borrowed because you expect its price to fall; you profit if it goes down.',
    seeAlso: ['long'],
  },
  {
    id: 'leverage',
    term: 'Leverage',
    aliases: ['leveraged'],
    definition:
      'Controlling a position larger than your own money by borrowing the rest; it multiplies both gains and losses.',
    seeAlso: ['margin', 'liquidation'],
  },
  {
    id: 'margin',
    term: 'Margin',
    aliases: [],
    definition: 'The money you put up as a deposit to open and hold a leveraged position.',
    seeAlso: ['leverage', 'liquidation'],
  },
  {
    id: 'liquidation',
    term: 'Liquidation',
    aliases: ['liquidated', 'liquidation price'],
    definition:
      'When losses use up your margin and the exchange closes your position for you, usually at a total loss of that margin.',
    seeAlso: ['margin', 'leverage'],
  },
  {
    id: 'stop-loss',
    term: 'Stop-loss',
    aliases: ['stop loss', 'stop-losses', 'stop losses'],
    definition: 'An order that closes your position automatically if price moves against you to a level you chose.',
    seeAlso: ['take-profit', 'risk-reward'],
  },
  {
    id: 'take-profit',
    term: 'Take-profit',
    aliases: ['take profit'],
    definition: 'An order that closes your position automatically once price reaches your profit target.',
    seeAlso: ['stop-loss'],
  },
  {
    id: 'risk-reward',
    term: 'Risk/reward ratio',
    aliases: ['risk/reward', 'risk-reward', 'risk reward'],
    definition:
      'How much you could gain on a trade compared with how much you could lose; 1:2 means risking $1 to make $2.',
    seeAlso: ['stop-loss', 'take-profit'],
  },
  {
    id: 'pnl',
    term: 'P&L',
    aliases: ['profit and loss', 'PnL'],
    definition:
      'Profit and loss. Unrealised P&L is on a position that is still open; realised P&L is locked in once you close it.',
    seeAlso: [],
  },
  {
    id: 'spread',
    term: 'Spread',
    aliases: ['bid/ask spread', 'bid-ask spread'],
    definition:
      'The gap between the highest price a buyer will pay (the bid) and the lowest price a seller will accept (the ask).',
    seeAlso: ['slippage'],
  },
  {
    id: 'slippage',
    term: 'Slippage',
    aliases: [],
    definition: 'The difference between the price you expected and the price your order actually filled at.',
    seeAlso: ['spread'],
  },
  {
    id: 'paper-trading',
    term: 'Paper trading',
    aliases: ['paper trade', 'paper account'],
    definition: 'Practising trades with pretend money at real prices, so mistakes cost nothing.',
    seeAlso: [],
  },
];

const BY_ID = new Map(GLOSSARY.map((e) => [e.id, e]));

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return BY_ID.get(id);
}
