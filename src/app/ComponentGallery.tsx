import { useState, type ReactNode } from 'react';
import { Inbox, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  Badge,
  BottomSheet,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  GlossaryTerm,
  IconButton,
  Input,
  Modal,
  Page,
  PageHeader,
  Pnl,
  ProgressBar,
  ResizablePanel,
  Select,
  Skeleton,
  Slider,
  Spinner,
  StatTile,
  Switch,
  TabPanel,
  Tabs,
  toast,
  Tooltip,
  type Column,
} from '@/components/ui';
import { formatPrice } from '@/lib/format';

interface DemoRow {
  symbol: string;
  side: 'Long' | 'Short';
  qty: number;
  entry: number;
  pnl: number;
}

const ROWS: DemoRow[] = [
  { symbol: 'BTC/USDT', side: 'Long', qty: 0.05, entry: 67120.5, pnl: 142.3 },
  { symbol: 'ETH/USDT', side: 'Short', qty: 1.2, entry: 3480.1, pnl: -56.75 },
  { symbol: 'SOL/USDT', side: 'Long', qty: 14, entry: 152.34, pnl: 0 },
];

const COLUMNS: Column<DemoRow>[] = [
  { id: 'symbol', header: 'Symbol', cell: (r) => r.symbol, sortValue: (r) => r.symbol },
  {
    id: 'side',
    header: 'Side',
    cell: (r) => <Badge tone={r.side === 'Long' ? 'up' : 'down'}>{r.side}</Badge>,
    sortValue: (r) => r.side,
  },
  { id: 'qty', header: 'Quantity', numeric: true, cell: (r) => r.qty, sortValue: (r) => r.qty, hideOnPhone: true },
  { id: 'entry', header: 'Entry', numeric: true, cell: (r) => formatPrice(r.entry), sortValue: (r) => r.entry },
  { id: 'pnl', header: 'P&L', numeric: true, cell: (r) => <Pnl value={r.pnl} />, sortValue: (r) => r.pnl },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card title={title}>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </Card>
  );
}

/** Every shared component in one place, for checking themes and keyboard use. */
export function ComponentGallery() {
  const [tab, setTab] = useState('positions');
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [leverage, setLeverage] = useState(5);
  const [mode, setMode] = useState('isolated');
  const [on, setOn] = useState(true);
  const [price, setPrice] = useState('67120.50');
  const [collapsed, setCollapsed] = useState(false);
  const priceError = Number(price) > 0 ? undefined : 'Enter a price above zero.';

  return (
    <Page>
      <PageHeader
        title="Component gallery"
        description="The shared building blocks used on every screen. Try them with the keyboard and in both themes."
      />

      <Section title="Button and IconButton">
        <Button variant="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="buy">Buy / Long</Button>
        <Button variant="sell">Sell / Short</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm" icon={<Plus aria-hidden className="size-3.5" />}>
          Small
        </Button>
        <IconButton label="Edit" icon={<Pencil className="size-4" />} />
        <IconButton label="Delete" icon={<Trash2 className="size-4" />} />
        <IconButton label="Active tool" active icon={<Pencil className="size-4" />} />
      </Section>

      <Card title="Input, Select, Slider and Switch">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Limit price"
            numeric
            prefix="$"
            suffix="USDT"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={priceError}
            hint="The most you are willing to pay."
          />
          <Select
            label="Margin mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'isolated', label: 'Isolated' },
              { value: 'cross', label: 'Cross' },
            ]}
          />
          <Slider label="Leverage" min={1} max={20} value={leverage} onChange={setLeverage} format={(v) => `${v}x`} />
          <Switch label="Reduce only" description="Can only shrink a position." checked={on} onChange={setOn} />
        </div>
      </Card>

      <Section title="Badge, P&L, Tooltip and GlossaryTerm">
        <Badge>Neutral</Badge>
        <Badge tone="up">Long</Badge>
        <Badge tone="down">Short</Badge>
        <Badge tone="warning">Simulated</Badge>
        <Badge tone="accent">New</Badge>
        <Pnl value={1250.4} />
        <Pnl value={-310.05} />
        <Pnl value={0} />
        <Pnl value={0.0342} format="pct" />
        <Tooltip content="Tooltips appear on hover and on keyboard focus.">
          <Button size="sm">Hover or focus me</Button>
        </Tooltip>
        <p className="text-sm">
          Using <GlossaryTerm id="leverage">leverage</GlossaryTerm> means a small price move can trigger{' '}
          <GlossaryTerm id="liquidation">liquidation</GlossaryTerm>.
        </p>
      </Section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total return" value="+12.40%" tone="up" sub="vs +8.10% buy and hold" />
        <StatTile label="Win rate" value="54.0%" sub="27 of 50 trades" />
        <StatTile label="Max drawdown" value="-9.80%" tone="down" />
        <StatTile label="Profit factor" value="1.62" />
      </div>

      <Card title="Tabs and DataTable" flush>
        <Tabs
          label="Account"
          idBase="gallery"
          value={tab}
          onChange={setTab}
          items={[
            { id: 'positions', label: 'Positions', badge: ROWS.length },
            { id: 'orders', label: 'Orders', badge: 0 },
            { id: 'history', label: 'History' },
          ]}
        />
        <TabPanel idBase="gallery" id="positions" active={tab === 'positions'}>
          <DataTable
            label="Demo positions"
            columns={COLUMNS}
            rows={ROWS}
            rowKey={(r) => r.symbol}
            onRowClick={(r) => toast.info(`Clicked ${r.symbol}`)}
            initialSort={{ id: 'pnl', dir: 'desc' }}
          />
        </TabPanel>
        <TabPanel idBase="gallery" id="orders" active={tab === 'orders'}>
          <DataTable
            label="Demo orders"
            columns={COLUMNS}
            rows={[]}
            rowKey={(r) => r.symbol}
            empty={
              <EmptyState
                icon={<Inbox />}
                title="No open orders"
                description="Limit and stop orders you place will wait here until they fill."
              />
            }
          />
        </TabPanel>
        <TabPanel idBase="gallery" id="history" active={tab === 'history'}>
          <ErrorState message="Could not load trade history. Check your connection." onRetry={() => toast.info('Retrying')} />
        </TabPanel>
      </Card>

      <Section title="Modal, ConfirmDialog, BottomSheet and Toast">
        <Button onClick={() => setModal(true)}>Open modal</Button>
        <Button variant="warning" onClick={() => setConfirm(true)}>
          Risky action
        </Button>
        <Button onClick={() => setSheet(true)}>Open bottom sheet</Button>
        <Button onClick={() => toast.success('Order filled', 'Bought 0.05 BTC at 67,120.50')}>Success toast</Button>
        <Button onClick={() => toast.warning('No stop-loss', 'This trade has no stop-loss attached.')}>Warning toast</Button>
        <Button onClick={() => toast.error('Order rejected', 'Not enough free margin.')}>Error toast</Button>
      </Section>

      <Card title="ProgressBar, Spinner and Skeleton">
        <div className="flex flex-col gap-4">
          <ProgressBar label="Module progress" value={0.4} showValue />
          <ProgressBar label="Distance to liquidation" value={0.82} tone="warning" showValue />
          <div className="flex items-center gap-6">
            <Spinner label="Loading candles" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="ResizablePanel" flush>
        <div className="flex h-56">
          <div className="grid flex-1 place-items-center text-sm text-muted">
            Drag the divider, or focus it and use the arrow keys. Enter collapses it.
          </div>
          <ResizablePanel
            dock="right"
            label="Demo panel"
            storageKey="gallery"
            defaultSize={260}
            minSize={160}
            maxSize={420}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            collapsedContent={
              <Button variant="ghost" size="sm" className="m-1" onClick={() => setCollapsed(false)}>
                Show
              </Button>
            }
          >
            <div className="p-3 text-sm text-fg">
              <p>Side panel</p>
              <Button size="sm" className="mt-2" onClick={() => setCollapsed(true)}>
                Collapse
              </Button>
            </div>
          </ResizablePanel>
        </div>
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="A modal dialog"
        footer={
          <Button variant="primary" onClick={() => setModal(false)}>
            Done
          </Button>
        }
      >
        Focus is trapped inside while this is open. Press Escape or click outside to close.
      </Modal>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => toast.warning('Confirmed')}
        title="Use 15x leverage?"
        confirmLabel="Use 15x"
      >
        A move of about 6.3% against you would wipe out this position.
      </ConfirmDialog>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="A bottom sheet">
        <p className="px-4 pb-6 text-sm text-muted">On phones, the workspace side and bottom panels open as sheets like this.</p>
      </BottomSheet>
    </Page>
  );
}
