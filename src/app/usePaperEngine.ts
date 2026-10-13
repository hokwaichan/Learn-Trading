import { useEffect } from 'react';
import { announceTradeEvents } from '@/features/paper-trading';
import { findInstrument } from '@/lib/data';
import { nearestExpiry } from '@/lib/pricing/strategy';
import { priceKey, tick } from '@/lib/trading/engine';
import { fetchCandleRange, streamPrice, useAccount, useMarket } from '@/stores';
import type { Account, Instrument } from '@/types';

/** Instruments the main account has a stake in: open positions and waiting orders. */
function instrumentsInPlay(account: Account): Instrument[] {
  const keys = new Set<string>();
  for (const p of account.positions) keys.add(priceKey(p.kind, p.symbol));
  for (const o of account.orders) if (o.status === 'open') keys.add(priceKey(o.kind, o.symbol));
  // An option strategy is valued from its underlying's spot price.
  for (const p of account.positions) if (p.option) keys.add(priceKey('spot', p.option.strategy.underlying));
  return [...keys]
    .map((key) => {
      const [kind, symbol] = key.split(':');
      return findInstrument(symbol, kind as Instrument['kind']);
    })
    .filter((i): i is Instrument => Boolean(i));
}

/** How recently an expiry must have passed for the live price to stand in for the price at expiry. */
const EXPIRY_GRACE_MS = 5 * 60_000;

/**
 * The underlying's price when an option expired. If the app was closed at
 * the time, this is the close of the hourly candle that ended at the expiry.
 */
async function priceAtExpiry(underlying: string, expiry: number): Promise<number | undefined> {
  const instrument = findInstrument(underlying, 'spot');
  if (!instrument) return undefined;
  const live = useMarket.getState().lastPrices[priceKey('spot', underlying)];
  if (Date.now() - expiry < EXPIRY_GRACE_MS) return live;
  try {
    const candles = await fetchCandleRange(instrument, instrument.timeframes.includes('1h') ? '1h' : '1d', { from: expiry - 3_600_000, limit: 1 });
    const candle = candles.find((c) => c.time * 1000 < expiry);
    return candle?.close ?? live;
  } catch {
    return live;
  }
}

/** Revalues option strategies at the latest prices and settles any that have expired. */
async function updateOptions(): Promise<void> {
  const store = useAccount.getState();
  const positions = store.accounts.main.positions.filter((p) => p.option);
  if (positions.length === 0) return;
  store.markOptions('main', (underlying) => useMarket.getState().lastPrices[priceKey('spot', underlying)]);
  const due = positions.filter((p) => (nearestExpiry(p.option!.strategy) ?? Infinity) <= Date.now());
  if (due.length === 0) return;
  const found = new Map<string, number | undefined>();
  for (const p of due) {
    const { underlying } = p.option!.strategy;
    const expiry = nearestExpiry(p.option!.strategy)!;
    found.set(`${underlying}:${expiry}`, await priceAtExpiry(underlying, expiry));
  }
  announceTradeEvents(useAccount.getState().settleOptions('main', (underlying, expiry) => found.get(`${underlying}:${expiry}`)));
}

/**
 * Runs the paper-trading engine for the main account while the app is open.
 * Mount once, in the app shell.
 *
 * It keeps a price stream open for every symbol with a position or a waiting
 * order, whichever page is showing, and passes each new price to the engine
 * so limit orders, stop-losses, take-profits and liquidations trigger.
 * It also charges funding on futures positions, and revalues and settles
 * option strategies.
 *
 * Nothing runs while the app is closed: orders are checked against the
 * current price when it is next opened, not against what happened in between.
 */
export function usePaperEngine() {
  const account = useAccount((s) => s.accounts.main);
  const inPlay = instrumentsInPlay(account)
    .map((i) => priceKey(i.kind, i.symbol))
    .sort()
    .join(',');

  // Keep a stream open for each symbol in play.
  useEffect(() => {
    if (!inPlay) return;
    const stops = inPlay.split(',').map((key) => {
      const [kind, symbol] = key.split(':');
      const instrument = findInstrument(symbol, kind as Instrument['kind']);
      return instrument ? streamPrice(instrument) : () => {};
    });
    return () => stops.forEach((stop) => stop());
  }, [inPlay]);

  // Pass every price change to the engine.
  useEffect(() => {
    return useMarket.subscribe((state, previous) => {
      if (state.lastPrices === previous.lastPrices) return;
      const main = useAccount.getState().accounts.main;
      for (const instrument of instrumentsInPlay(main)) {
        const key = priceKey(instrument.kind, instrument.symbol);
        const price = state.lastPrices[key];
        if (price == null || price === previous.lastPrices[key]) continue;
        announceTradeEvents(useAccount.getState().onBar('main', instrument.symbol, instrument.kind, tick(price, Date.now()), state.lastPrices));
      }
      // Option strategies follow their underlying's price.
      if (main.positions.some((p) => p.option)) useAccount.getState().markOptions('main', (underlying) => state.lastPrices[priceKey('spot', underlying)]);
    });
  }, []);

  // Revalue option strategies as prices and time move, and settle them at expiry.
  const hasOptions = account.positions.some((p) => p.option);
  useEffect(() => {
    if (!hasOptions) return;
    void updateOptions();
    const timer = setInterval(() => void updateOptions(), 30_000);
    return () => clearInterval(timer);
  }, [hasOptions]);

  // Charge funding on futures positions as each funding time passes, including any missed while the app was closed.
  const hasFutures = account.positions.some((p) => p.futures);
  useEffect(() => {
    if (!hasFutures) return;
    const charge = () => announceTradeEvents(useAccount.getState().fund('main'));
    charge();
    const timer = setInterval(charge, 60_000);
    return () => clearInterval(timer);
  }, [hasFutures]);
}
