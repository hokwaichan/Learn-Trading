import type { ReactNode } from 'react';
import { ClipboardList, History, Lightbulb, PanelBottomClose, PanelRightClose, ReceiptText, Star, Wallet } from 'lucide-react';
import { IconButton, TabPanel, Tabs } from '@/components/ui';
import { HistoryTable, OrdersTable, PositionsTable } from '@/features/paper-trading';
import { t } from '@/i18n';
import type { Prices } from '@/lib/trading/engine';
import { useAccount } from '@/stores';
import type { AccountId } from '@/types';

export type RightTab = 'order' | 'explain' | 'watchlist';
export type BottomTab = 'positions' | 'orders' | 'history';

export const RIGHT_TABS: { id: RightTab; label: string; icon: ReactNode }[] = [
  { id: 'order', label: t('Order'), icon: <ReceiptText aria-hidden className="size-3.5" /> },
  { id: 'explain', label: t('Explain'), icon: <Lightbulb aria-hidden className="size-3.5" /> },
  { id: 'watchlist', label: t('Watchlist'), icon: <Star aria-hidden className="size-3.5" /> },
];

export const BOTTOM_TABS: { id: BottomTab; label: string; icon: ReactNode }[] = [
  { id: 'positions', label: t('Positions'), icon: <Wallet aria-hidden className="size-3.5" /> },
  { id: 'orders', label: t('Orders'), icon: <ClipboardList aria-hidden className="size-3.5" /> },
  { id: 'history', label: t('History'), icon: <History aria-hidden className="size-3.5" /> },
];

/** Which account the tables show, and (in Replay) the prices and clock to use instead of the live ones. */
export interface AccountView {
  accountId: AccountId;
  prices?: Prices;
  now?: number;
}

export function BottomTabContent({ tab, accountId, prices, now }: { tab: BottomTab } & AccountView) {
  if (tab === 'positions') return <PositionsTable accountId={accountId} prices={prices} now={now} />;
  if (tab === 'orders') return <OrdersTable accountId={accountId} prices={prices} />;
  return <HistoryTable accountId={accountId} />;
}

/** Counts shown on the account tabs. */
function useTabCounts(accountId: AccountId): Record<BottomTab, number | undefined> {
  const all = useAccount((s) => s.accounts[accountId].positions);
  const positions = all.filter((p) => !p.option);
  const waiting = useAccount((s) => s.accounts[accountId].orders.filter((o) => o.status === 'open').length);
  const attached = positions.reduce((n, p) => n + (p.stopLoss != null ? 1 : 0) + (p.takeProfit != null ? 1 : 0), 0);
  return { positions: positions.length, orders: waiting + attached, history: undefined };
}

export interface RightPanelProps {
  /** The tabs to show; Replay leaves out the watchlist. */
  tabs: typeof RIGHT_TABS;
  tab: RightTab;
  onTab: (tab: RightTab) => void;
  onCollapse: () => void;
  content: Record<RightTab, ReactNode>;
}

export function RightPanel({ tabs, tab, onTab, onCollapse, content }: RightPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs
        label={t('Side panel')}
        idBase="ws-right"
        items={tabs}
        value={tab}
        onChange={onTab}
        className="shrink-0"
        trailing={<IconButton size="sm" label={t('Collapse side panel')} icon={<PanelRightClose className="size-4" />} onClick={onCollapse} />}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {tabs.map((item) => (
          <TabPanel key={item.id} idBase="ws-right" id={item.id} active={tab === item.id}>
            {content[item.id]}
          </TabPanel>
        ))}
      </div>
    </div>
  );
}

export interface BottomPanelProps extends AccountView {
  tab: BottomTab;
  onTab: (tab: BottomTab) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function BottomPanel({ tab, onTab, collapsed, onToggle, ...account }: BottomPanelProps) {
  const counts = useTabCounts(account.accountId);
  return (
    <div className="flex h-full flex-col">
      <Tabs
        label={t('Account')}
        idBase="ws-bottom"
        items={BOTTOM_TABS.map((item) => ({ ...item, badge: counts[item.id] || undefined }))}
        value={tab}
        onChange={(next) => {
          onTab(next);
          if (collapsed) onToggle();
        }}
        className="shrink-0"
        trailing={
          <IconButton
            size="sm"
            label={collapsed ? t('Expand account panel') : t('Collapse account panel')}
            aria-expanded={!collapsed}
            icon={<PanelBottomClose className={collapsed ? 'size-4 rotate-180' : 'size-4'} />}
            onClick={onToggle}
          />
        }
      />
      {!collapsed && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {BOTTOM_TABS.map((t) => (
            <TabPanel key={t.id} idBase="ws-bottom" id={t.id} active={tab === t.id}>
              <BottomTabContent tab={t.id} {...account} />
            </TabPanel>
          ))}
        </div>
      )}
    </div>
  );
}
