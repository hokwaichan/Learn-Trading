import { useEffect } from 'react';
import { announceTradeEvents } from '@/features/paper-trading';
import { findInstrument } from '@/lib/data';
import { priceKey, tick } from '@/lib/trading/engine';
import { streamPrice, useAccount, useMarket } from '@/stores';
import type { Account, Instrument } from '@/types';

/** Instruments the main account has a stake in: open positions and waiting orders. */
function instrumentsInPlay(account: Account): Instrument[] {
  const keys = new Set<string>();
  for (const p of account.positions) keys.add(priceKey(p.kind, p.symbol));
  for (const o of account.orders) if (o.status === 'open') keys.add(priceKey(o.kind, o.symbol));
  return [...keys]
    .map((key) => {
      const [kind, symbol] = key.split(':');
      return findInstrument(symbol, kind as Instrument['kind']);
    })
    .filter((i): i is Instrument => Boolean(i));
}

/**
 * Runs the paper-trading engine for the main account while the app is open.
 * Mount once, in the app shell.
 *
 * It keeps a price stream open for every symbol with a position or a waiting
 * order, whichever page is showing, and passes each new price to the engine
 * so limit orders, stop-losses and take-profits trigger.
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
    });
  }, []);
}
