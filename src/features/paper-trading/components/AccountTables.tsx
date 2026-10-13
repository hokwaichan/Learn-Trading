import { useMemo, useState } from 'react';
import { ClipboardList, History, Pencil, Wallet, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, DataTable, EmptyState, IconButton, Input, Modal, Pnl, toast, type Column } from '@/components/ui';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatPrice, formatQty, formatSignedMoney } from '@/lib/format';
import { priceKey, unrealizedPnl, type Prices } from '@/lib/trading/engine';
import { useAccount, useMarket } from '@/stores';
import type { AccountId, Order, Position, Trade } from '@/types';

interface TableProps {
  accountId?: AccountId;
  /** Overrides live prices, for Replay. */
  prices?: Prices;
  /** The time to stamp on closes, for Replay. Defaults to now. */
  now?: number;
}

const tick = (symbol: string, kind: Position['kind']) => findInstrument(symbol, kind)?.tickSize ?? 0.01;
const step = (symbol: string, kind: Position['kind']) => findInstrument(symbol, kind)?.stepSize ?? 0.0001;
const nameOf = (symbol: string, kind: Position['kind']) => {
  const instrument = findInstrument(symbol, kind);
  return instrument ? displaySymbol(instrument) : symbol;
};
const pathOf = (symbol: string, kind: Position['kind']) => `${kind === 'perpetual' ? '/futures' : '/charts'}/${symbol}`;

function SymbolCell({ symbol, kind }: { symbol: string; kind: Position['kind'] }) {
  return (
    <Link to={pathOf(symbol, kind)} className="num font-medium text-fg underline-offset-4 hover:underline">
      {nameOf(symbol, kind)}
    </Link>
  );
}

function SideBadge({ long, labels = ['Long', 'Short'] }: { long: boolean; labels?: [string, string] }) {
  return <Badge tone={long ? 'up' : 'down'}>{long ? labels[0] : labels[1]}</Badge>;
}

// ── Edit stops ─────────────────────────────────────────────────────────

function EditStopsDialog({ position, price, accountId, onClose }: { position: Position; price: number; accountId: AccountId; onClose: () => void }) {
  const setStops = useAccount((s) => s.setStops);
  const [stop, setStop] = useState(position.stopLoss != null ? String(position.stopLoss) : '');
  const [target, setTarget] = useState(position.takeProfit != null ? String(position.takeProfit) : '');
  const [error, setError] = useState<string | null>(null);
  const parse = (text: string) => (text.trim() === '' ? undefined : Number(text));
  const t = tick(position.symbol, position.kind);

  const save = () => {
    const stopLoss = parse(stop);
    const takeProfit = parse(target);
    if ([stopLoss, takeProfit].some((v) => v != null && !(v > 0))) return setError('Enter prices above zero, or leave a field empty to remove it.');
    const problem = setStops(accountId, position.id, { stopLoss, takeProfit }, price);
    if (problem) return setError(problem);
    toast.success('Stops updated', `${nameOf(position.symbol, position.kind)}: stop ${stopLoss != null ? formatPrice(stopLoss, t) : 'none'}, target ${takeProfit != null ? formatPrice(takeProfit, t) : 'none'}`);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title={`Stops for ${nameOf(position.symbol, position.kind)} ${position.direction}`}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save}>
            Save
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <p className="text-xs text-muted">
          Entry <span className="num text-fg">{formatPrice(position.entryPrice, t)}</span>, current price <span className="num text-fg">{formatPrice(price, t)}</span>. Leave a
          field empty to remove it.
        </p>
        <Input label="Stop-loss" numeric data-autofocus value={stop} onChange={(e) => setStop(e.target.value)} hint={position.direction === 'long' ? 'Below the current price' : 'Above the current price'} />
        <Input label="Take-profit" numeric value={target} onChange={(e) => setTarget(e.target.value)} hint={position.direction === 'long' ? 'Above the current price' : 'Below the current price'} />
        {error && (
          <p role="alert" className="text-xs text-down-text">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

// ── Positions ──────────────────────────────────────────────────────────

/** Open positions with live profit or loss. */
export function PositionsTable({ accountId = 'main', prices: override, now }: TableProps) {
  const positions = useAccount((s) => s.accounts[accountId].positions);
  const close = useAccount((s) => s.close);
  const live = useMarket((s) => s.lastPrices);
  const prices = override ?? live;
  const [editing, setEditing] = useState<string | null>(null);

  const mark = (p: Position) => prices[priceKey(p.kind, p.symbol)] ?? p.entryPrice;
  const editingPosition = positions.find((p) => p.id === editing);

  const columns: Column<Position>[] = [
    { id: 'symbol', header: 'Symbol', cell: (p) => <SymbolCell symbol={p.symbol} kind={p.kind} />, sortValue: (p) => p.symbol },
    { id: 'side', header: 'Side', cell: (p) => <SideBadge long={p.direction === 'long'} /> },
    { id: 'qty', header: 'Quantity', numeric: true, cell: (p) => formatQty(p.quantity, step(p.symbol, p.kind)), hideOnPhone: true },
    { id: 'entry', header: 'Entry', numeric: true, cell: (p) => formatPrice(p.entryPrice, tick(p.symbol, p.kind)), hideOnPhone: true },
    { id: 'mark', header: 'Price', numeric: true, cell: (p) => formatPrice(mark(p), tick(p.symbol, p.kind)), hideOnPhone: true },
    {
      id: 'pnl',
      header: 'P&L',
      numeric: true,
      cell: (p) => {
        const pnl = unrealizedPnl(p, mark(p));
        return (
          <span className="inline-flex flex-col items-end leading-tight">
            <Pnl value={pnl} />
            <Pnl value={pnl / (p.entryPrice * p.quantity)} format="pct" className="text-[11px]" />
          </span>
        );
      },
      sortValue: (p) => unrealizedPnl(p, mark(p)),
    },
    { id: 'stop', header: 'Stop', numeric: true, cell: (p) => (p.stopLoss != null ? formatPrice(p.stopLoss, tick(p.symbol, p.kind)) : <span className="text-warning-text">None</span>) },
    { id: 'target', header: 'Target', numeric: true, cell: (p) => (p.takeProfit != null ? formatPrice(p.takeProfit, tick(p.symbol, p.kind)) : <span className="text-muted">None</span>), hideOnPhone: true },
    {
      id: 'actions',
      header: '',
      align: 'right',
      cell: (p) => (
        <span className="inline-flex items-center gap-1">
          <IconButton size="sm" label={`Edit stops for ${nameOf(p.symbol, p.kind)}`} icon={<Pencil className="size-3.5" />} onClick={() => setEditing(p.id)} />
          <Button
            size="sm"
            aria-label={`Close ${nameOf(p.symbol, p.kind)} position`}
            onClick={() => {
              const events = close(accountId, p.id, mark(p), prices, now);
              const closed = events.find((e) => e.type === 'trade_closed');
              if (closed?.type === 'trade_closed') toast.info('Position closed', `${nameOf(p.symbol, p.kind)}: ${formatSignedMoney(closed.trade.netPnl)}`);
            }}
          >
            Close
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        label="Open positions"
        dense
        columns={columns}
        rows={positions}
        rowKey={(p) => p.id}
        empty={<EmptyState className="py-6" icon={<Wallet />} title="No open positions" description="Trades you open appear here with their live profit or loss." />}
      />
      {editingPosition && <EditStopsDialog position={editingPosition} price={mark(editingPosition)} accountId={accountId} onClose={() => setEditing(null)} />}
    </>
  );
}

// ── Orders ─────────────────────────────────────────────────────────────

interface OrderRow {
  id: string;
  symbol: string;
  kind: Order['kind'];
  buy: boolean;
  type: string;
  quantity: number;
  price: number;
  note: string;
  cancel: () => void;
}

/** Waiting limit and stop orders, plus the stop-loss and take-profit attached to each open position. */
export function OrdersTable({ accountId = 'main', prices: override }: TableProps) {
  const account = useAccount((s) => s.accounts[accountId]);
  const cancel = useAccount((s) => s.cancel);
  const setStops = useAccount((s) => s.setStops);
  const live = useMarket((s) => s.lastPrices);
  const prices = override ?? live;

  const rows = useMemo<OrderRow[]>(() => {
    const waiting = account.orders
      .filter((o) => o.status === 'open')
      .map((o): OrderRow => {
        const t = tick(o.symbol, o.kind);
        const attached = [o.stopLoss != null && `stop ${formatPrice(o.stopLoss, t)}`, o.takeProfit != null && `target ${formatPrice(o.takeProfit, t)}`].filter(Boolean);
        return {
          id: o.id,
          symbol: o.symbol,
          kind: o.kind,
          buy: o.side === 'buy',
          type: o.type === 'limit' ? 'Limit' : 'Stop',
          quantity: o.quantity,
          price: (o.type === 'limit' ? o.limitPrice : o.stopPrice) ?? 0,
          note: attached.length ? `Then ${attached.join(', ')}` : 'Opens a position',
          cancel: () => cancel(accountId, o.id),
        };
      });
    const attached = account.positions.flatMap((p): OrderRow[] => {
      const price = prices[priceKey(p.kind, p.symbol)] ?? p.entryPrice;
      const common = { symbol: p.symbol, kind: p.kind, buy: p.direction === 'short', quantity: p.quantity, note: `Closes the ${p.direction}` };
      return [
        ...(p.stopLoss != null ? [{ ...common, id: `${p.id}-sl`, type: 'Stop-loss', price: p.stopLoss, cancel: () => void setStops(accountId, p.id, { takeProfit: p.takeProfit }, price) }] : []),
        ...(p.takeProfit != null ? [{ ...common, id: `${p.id}-tp`, type: 'Take-profit', price: p.takeProfit, cancel: () => void setStops(accountId, p.id, { stopLoss: p.stopLoss }, price) }] : []),
      ];
    });
    return [...waiting, ...attached];
  }, [account, accountId, cancel, setStops, prices]);

  const columns: Column<OrderRow>[] = [
    { id: 'symbol', header: 'Symbol', cell: (r) => <SymbolCell symbol={r.symbol} kind={r.kind} /> },
    { id: 'side', header: 'Side', cell: (r) => <SideBadge long={r.buy} labels={['Buy', 'Sell']} /> },
    { id: 'type', header: 'Type', cell: (r) => r.type },
    { id: 'qty', header: 'Quantity', numeric: true, cell: (r) => formatQty(r.quantity, step(r.symbol, r.kind)), hideOnPhone: true },
    { id: 'price', header: 'Price', numeric: true, cell: (r) => formatPrice(r.price, tick(r.symbol, r.kind)) },
    { id: 'note', header: 'What it does', cell: (r) => <span className="text-muted">{r.note}</span>, hideOnPhone: true },
    {
      id: 'actions',
      header: '',
      align: 'right',
      cell: (r) => <IconButton size="sm" label={`Cancel ${r.type.toLowerCase()} order for ${nameOf(r.symbol, r.kind)}`} icon={<X className="size-3.5" />} onClick={r.cancel} />,
    },
  ];

  return (
    <DataTable
      label="Open orders"
      dense
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      empty={<EmptyState className="py-6" icon={<ClipboardList />} title="No open orders" description="Limit and stop orders wait here until price reaches them, along with any stop-loss or take-profit on an open position." />}
    />
  );
}

// ── History ────────────────────────────────────────────────────────────

const REASONS: Record<Trade['exitReason'], string> = {
  manual: 'Closed by you',
  stop_loss: 'Stop-loss',
  take_profit: 'Take-profit',
  liquidation: 'Liquidated',
  expiry: 'Expired',
  assignment: 'Assigned',
  account_reset: 'Account reset',
};

const when = (time: number) =>
  new Date(time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Closed trades, newest first. */
export function HistoryTable({ accountId = 'main' }: TableProps) {
  const trades = useAccount((s) => s.accounts[accountId].trades);
  const rows = useMemo(() => [...trades].reverse(), [trades]);

  const columns: Column<Trade>[] = [
    { id: 'closed', header: 'Closed', cell: (t) => <span className="num text-muted">{when(t.closedAt)}</span>, sortValue: (t) => t.closedAt },
    { id: 'symbol', header: 'Symbol', cell: (t) => <SymbolCell symbol={t.symbol} kind={t.kind} />, sortValue: (t) => t.symbol },
    { id: 'side', header: 'Side', cell: (t) => <SideBadge long={t.direction === 'long'} /> },
    { id: 'qty', header: 'Quantity', numeric: true, cell: (t) => formatQty(t.quantity, step(t.symbol, t.kind)), hideOnPhone: true },
    { id: 'entry', header: 'Entry', numeric: true, cell: (t) => formatPrice(t.entryPrice, tick(t.symbol, t.kind)), hideOnPhone: true },
    { id: 'exit', header: 'Exit', numeric: true, cell: (t) => formatPrice(t.exitPrice, tick(t.symbol, t.kind)), hideOnPhone: true },
    { id: 'pnl', header: 'Net P&L', numeric: true, cell: (t) => <Pnl value={t.netPnl} />, sortValue: (t) => t.netPnl },
    {
      id: 'r',
      header: 'R',
      numeric: true,
      cell: (t) => (t.rMultiple != null ? <span className={t.rMultiple >= 0 ? 'text-up-text' : 'text-down-text'}>{`${t.rMultiple >= 0 ? '+' : ''}${t.rMultiple.toFixed(2)}R`}</span> : <span className="text-muted">–</span>),
      sortValue: (t) => t.rMultiple ?? 0,
      hideOnPhone: true,
    },
    { id: 'reason', header: 'Exit', cell: (t) => <span className="text-muted">{REASONS[t.exitReason]}</span>, hideOnPhone: true },
  ];

  return (
    <DataTable
      label="Trade history"
      dense
      columns={columns}
      rows={rows}
      rowKey={(t) => t.id}
      empty={<EmptyState className="py-6" icon={<History />} title="No closed trades yet" description="Every trade you close is listed here with its result after fees." />}
    />
  );
}
