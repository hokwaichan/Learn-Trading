import type { Account, AccountId } from '@/types';

export const STARTING_BALANCE = 10_000;

export function createAccount(id: AccountId, now: number, resetCount = 0): Account {
  return {
    id,
    startingBalance: STARTING_BALANCE,
    cash: STARTING_BALANCE,
    positions: [],
    orders: [],
    trades: [],
    ledger: [],
    equityHistory: [{ time: now, equity: STARTING_BALANCE }],
    createdAt: now,
    resetCount,
  };
}

/** A fresh account that remembers how many times it has been reset. */
export function resetAccount(account: Account, now: number): Account {
  return createAccount(account.id, now, account.resetCount + 1);
}
