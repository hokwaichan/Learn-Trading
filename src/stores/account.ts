import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMigrate } from '@/lib/migrate';
import { createAccount, resetAccount } from '@/lib/trading/account';
import type { Account, AccountId } from '@/types';

export const ACCOUNT_VERSION = 1;

interface AccountData {
  /** 'main' is the live paper account; 'replay' is used only inside Replay. */
  accounts: Record<AccountId, Account>;
}

interface AccountStore extends AccountData {
  reset: (id: AccountId) => void;
}

function defaults(): AccountData {
  const now = Date.now();
  return { accounts: { main: createAccount('main', now), replay: createAccount('replay', now) } };
}

export const useAccount = create<AccountStore>()(
  persist(
    (set) => ({
      ...defaults(),
      reset: (id) =>
        set((s) => ({ accounts: { ...s.accounts, [id]: resetAccount(s.accounts[id], Date.now()) } })),
    }),
    {
      name: 'tradeschool.account',
      version: ACCOUNT_VERSION,
      migrate: createMigrate<AccountData>(ACCOUNT_VERSION, defaults()) as (p: unknown, v: number) => AccountStore,
      partialize: ({ accounts }) => ({ accounts }),
    },
  ),
);
