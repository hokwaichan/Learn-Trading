import type { ReactNode } from 'react';
import { ClipboardList, History, Lightbulb, PanelBottomClose, PanelRightClose, ReceiptText, Star, Wallet } from 'lucide-react';
import { EmptyState, IconButton, TabPanel, Tabs } from '@/components/ui';
import type { WorkspaceMode } from '@/stores';

export type RightTab = 'order' | 'explain' | 'watchlist';
export type BottomTab = 'positions' | 'orders' | 'history';

export const RIGHT_TABS: { id: RightTab; label: string; icon: ReactNode }[] = [
  { id: 'order', label: 'Order', icon: <ReceiptText aria-hidden className="size-3.5" /> },
  { id: 'explain', label: 'Explain', icon: <Lightbulb aria-hidden className="size-3.5" /> },
  { id: 'watchlist', label: 'Watchlist', icon: <Star aria-hidden className="size-3.5" /> },
];

export const BOTTOM_TABS: { id: BottomTab; label: string; icon: ReactNode }[] = [
  { id: 'positions', label: 'Positions', icon: <Wallet aria-hidden className="size-3.5" /> },
  { id: 'orders', label: 'Orders', icon: <ClipboardList aria-hidden className="size-3.5" /> },
  { id: 'history', label: 'History', icon: <History aria-hidden className="size-3.5" /> },
];

/** Order ticket stand-in until paper trading is built. */
export function OrderPlaceholder({ mode }: { mode: WorkspaceMode }) {
  return (
    <EmptyState
      icon={<ReceiptText />}
      title={mode === 'futures' ? 'Futures order ticket' : 'Order ticket'}
      description={
        mode === 'futures'
          ? 'Leverage, margin mode and the liquidation gauge arrive with the futures simulator in milestone 9.'
          : 'Market, limit and stop orders with a position-size calculator arrive with paper trading in milestone 6.'
      }
    />
  );
}

const BOTTOM_EMPTY: Record<BottomTab, { title: string; description: string }> = {
  positions: {
    title: 'No open positions',
    description: 'Trades you open will appear here with their live profit or loss. Paper trading arrives in milestone 6.',
  },
  orders: {
    title: 'No open orders',
    description: 'Limit and stop orders wait here until price reaches them. Paper trading arrives in milestone 6.',
  },
  history: {
    title: 'No trade history yet',
    description: 'Every closed trade will be listed here and logged to your journal.',
  },
};

export function BottomTabContent({ tab }: { tab: BottomTab }) {
  const icon = BOTTOM_TABS.find((t) => t.id === tab)!.icon;
  return <EmptyState className="py-6" icon={icon} {...BOTTOM_EMPTY[tab]} />;
}

export interface RightPanelProps {
  tab: RightTab;
  onTab: (tab: RightTab) => void;
  onCollapse: () => void;
  order: ReactNode;
  explain: ReactNode;
  watchlist: ReactNode;
}

export function RightPanel({ tab, onTab, onCollapse, order, explain, watchlist }: RightPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs
        label="Side panel"
        idBase="ws-right"
        items={RIGHT_TABS}
        value={tab}
        onChange={onTab}
        className="shrink-0"
        trailing={
          <IconButton
            size="sm"
            label="Collapse side panel"
            icon={<PanelRightClose className="size-4" />}
            onClick={onCollapse}
          />
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TabPanel idBase="ws-right" id="order" active={tab === 'order'}>
          {order}
        </TabPanel>
        <TabPanel idBase="ws-right" id="explain" active={tab === 'explain'}>
          {explain}
        </TabPanel>
        <TabPanel idBase="ws-right" id="watchlist" active={tab === 'watchlist'}>
          {watchlist}
        </TabPanel>
      </div>
    </div>
  );
}

export interface BottomPanelProps {
  tab: BottomTab;
  onTab: (tab: BottomTab) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function BottomPanel({ tab, onTab, collapsed, onToggle }: BottomPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs
        label="Account"
        idBase="ws-bottom"
        items={BOTTOM_TABS}
        value={tab}
        onChange={(next) => {
          onTab(next);
          if (collapsed) onToggle();
        }}
        className="shrink-0"
        trailing={
          <IconButton
            size="sm"
            label={collapsed ? 'Expand account panel' : 'Collapse account panel'}
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
              <BottomTabContent tab={t.id} />
            </TabPanel>
          ))}
        </div>
      )}
    </div>
  );
}
