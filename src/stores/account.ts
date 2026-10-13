import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMigrate } from '@/lib/migrate';
import { advance, type AdvanceResult } from '@/lib/replay/session';
import { createAccount, resetAccount } from '@/lib/trading/account';
import {
  cancelOrder,
  closePosition,
  placeOrder,
  processBar,
  setStops,
  type Bar,
  type EngineContext,
  type EngineEvent,
  type OrderRequest,
  type Prices,
} from '@/lib/trading/engine';
import { accountSnapshot } from '@/lib/trading/snapshot';
import type { Account, AccountId, AccountSnapshot, Candle, InstrumentKind } from '@/types';
import { useMarket } from './market';
import { useSettings } from './settings';

export const ACCOUNT_VERSION = 1;

interface AccountData {
  /** 'main' is the live paper account; 'replay' is used only inside Replay. */
  accounts: Record<AccountId, Account>;
}

/** What happened when an action was applied: the engine's events, in order. */
export type TradeResult = EngineEvent[];

interface AccountStore extends AccountData {
  reset: (id: AccountId) => void;
  /** Places an order at `marketPrice`. Check the returned events for a fill or a rejection. */
  place: (id: AccountId, request: OrderRequest, marketPrice: number, prices?: Prices, now?: number) => TradeResult;
  cancel: (id: AccountId, orderId: string) => TradeResult;
  close: (id: AccountId, positionId: string, marketPrice: number, prices?: Prices, now?: number) => TradeResult;
  /** Returns an error message, or null when the stops were changed. */
  setStops: (id: AccountId, positionId: string, stops: { stopLoss?: number; takeProfit?: number }, marketPrice: number) => string | null;
  /** Feeds a price update to the engine: fills waiting orders and checks stops. */
  onBar: (id: AccountId, symbol: string, kind: InstrumentKind, bar: Bar, prices?: Prices) => TradeResult;
  /** Closes every position at the given prices and cancels every waiting order. */
  flatten: (id: AccountId, prices: Prices, now: number) => void;
  /** Moves the replay account forward through newly revealed candles. */
  replayAdvance: (candles: Candle[], cursor: number, target: number, market: { symbol: string; kind: InstrumentKind; stepSeconds: number }) => AdvanceResult;
}

function defaults(): AccountData {
  const now = Date.now();
  return { accounts: { main: createAccount('main', now), replay: createAccount('replay', now) } };
}

/** Fees and slippage come from Settings; ids and the clock from the browser. */
function context(now = Date.now()): EngineContext {
  const { feeRate, slippagePct } = useSettings.getState();
  return { now, feeRate, slippagePct, newId: () => crypto.randomUUID() };
}

const livePrices = (): Prices => useMarket.getState().lastPrices;

export const useAccount = create<AccountStore>()(
  persist(
    (set, get) => {
      const apply = (id: AccountId, result: { account: Account; events: EngineEvent[] }): TradeResult => {
        if (result.account !== get().accounts[id]) set((s) => ({ accounts: { ...s.accounts, [id]: result.account } }));
        return result.events;
      };
      return {
        ...defaults(),
        reset: (id) => set((s) => ({ accounts: { ...s.accounts, [id]: resetAccount(s.accounts[id], Date.now()) } })),
        place: (id, request, marketPrice, prices = livePrices(), now) =>
          apply(id, placeOrder(get().accounts[id], request, marketPrice, prices, context(now))),
        cancel: (id, orderId) => apply(id, cancelOrder(get().accounts[id], orderId)),
        close: (id, positionId, marketPrice, prices = livePrices(), now) =>
          apply(id, closePosition(get().accounts[id], positionId, marketPrice, prices, context(now))),
        setStops: (id, positionId, stops, marketPrice) => {
          const result = setStops(get().accounts[id], positionId, stops, marketPrice);
          if (!result.error) set((s) => ({ accounts: { ...s.accounts, [id]: result.account } }));
          return result.error;
        },
        onBar: (id, symbol, kind, bar, prices = livePrices()) =>
          apply(id, processBar(get().accounts[id], symbol, kind, bar, prices, context(bar.time))),
        flatten: (id, prices, now) => {
          let account = get().accounts[id];
          for (const order of account.orders.filter((o) => o.status === 'open')) account = cancelOrder(account, order.id).account;
          for (const position of account.positions) {
            // With no price to hand (the session's data is gone), close at the entry price: no gain, no loss.
            const price = prices[`${position.kind}:${position.symbol}`] ?? position.entryPrice;
            account = closePosition(account, position.id, price, prices, context(now)).account;
          }
          apply(id, { account, events: [] });
        },
        replayAdvance: (candles, cursor, target, market) => {
          const result = advance(get().accounts.replay, candles, cursor, target, market, context);
          apply('replay', result);
          return result;
        },
      };
    },
    {
      name: 'tradeschool.account',
      version: ACCOUNT_VERSION,
      migrate: createMigrate<AccountData>(ACCOUNT_VERSION, defaults()) as (p: unknown, v: number) => AccountStore,
      partialize: ({ accounts }) => ({ accounts }),
    },
  ),
);

/** Live equity, P&L and free funds for an account, recalculated as prices move. */
export function useAccountSnapshot(id: AccountId, prices?: Prices): AccountSnapshot {
  const account = useAccount((s) => s.accounts[id]);
  const live = useMarket((s) => s.lastPrices);
  const used = prices ?? live;
  return useMemo(() => accountSnapshot(account, used, Date.now()), [account, used]);
}
