import { useMemo, useState } from 'react';
import { ClipboardList, History, Pencil, Wallet, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, DataTable, EmptyState, IconButton, Input, Modal, Pnl, toast, Trans, type Column } from '@/components/ui';
import { intlLocale, t } from '@/i18n';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatPrice, formatQty, formatSignedMoney } from '@/lib/format';
import { liquidationPriceOf, priceKey, unrealizedPnl, type Prices } from '@/lib/trading/engine';
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
const pathOf = (symbol: string, kind: Position['kind']) => `${kind === 'perpetual' ? '/futures' : kind === 'option' ? '/options' : '/charts'}/${symbol}`;

function SymbolCell({ symbol, kind }: { symbol: string; kind: Position['kind'] }) {
  return (
    <Link to={pathOf(symbol, kind)} className="num font-medium text-fg underline-offset-4 hover:underline">
      {nameOf(symbol, kind)}
    </Link>
  );
}

function SideBadge({ long, labels = [t('Long'), t('Short')] }: { long: boolean; labels?: [string, string] }) {
  return <Badge tone={long ? 'up' : 'down'}>{long ? labels[0] : labels[1]}</Badge>;
}

// ── Edit stops ─────────────────────────────────────────────────────────

function EditStopsDialog({ position, price, accountId, onClose }: { position: Position; price: number; accountId: AccountId; onClose: () => void }) {
  const setStops = useAccount((s) => s.setStops);
  const [stop, setStop] = useState(position.stopLoss != null ? String(position.stopLoss) : '');
  const [target, setTarget] = useState(position.takeProfit != null ? String(position.takeProfit) : '');
  const [error, setError] = useState<string | null>(null);
  const parse = (text: string) => (text.trim() === '' ? undefined : Number(text));
  const tickSize = tick(position.symbol, position.kind);
  const name = nameOf(position.symbol, position.kind);
  const long = position.direction === 'long';

  const save = () => {
    const stopLoss = parse(stop);
    const takeProfit = parse(target);
    if ([stopLoss, takeProfit].some((v) => v != null && !(v > 0))) return setError(t('Enter prices above zero, or leave a field empty to remove it.'));
    const problem = setStops(accountId, position.id, { stopLoss, takeProfit }, price);
    if (problem) return setError(problem);
    toast.success(
      t('Stops updated'),
      t('{name}: stop {stop}, target {target}', {
        name,
        stop: stopLoss != null ? formatPrice(stopLoss, tickSize) : t('none'),
        target: takeProfit != null ? formatPrice(takeProfit, tickSize) : t('none'),
      }),
    );
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title={long ? t('Stops for {name} long', { name }) : t('Stops for {name} short', { name })}
      footer={
        <>
          <Button onClick={onClose}>{t('Cancel')}</Button>
          <Button variant="primary" onClick={save}>
            {t('Save')}
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
          <Trans
            text="Entry {entry}, current price {price}. Leave a field empty to remove it."
            values={{
              entry: <span className="num text-fg">{formatPrice(position.entryPrice, tickSize)}</span>,
              price: <span className="num text-fg">{formatPrice(price, tickSize)}</span>,
            }}
          />
        </p>
        <Input
          label={t('Stop-loss')}
          numeric
          data-autofocus
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          hint={long ? t('Below the current price') : t('Above the current price')}
        />
        <Input
          label={t('Take-profit')}
          numeric
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          hint={long ? t('Above the current price') : t('Below the current price')}
        />
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
  const account = useAccount((s) => s.accounts[accountId]);
  // Option strategies have their own list on the Options page.
  const positions = useMemo(() => account.positions.filter((p) => !p.option), [account.positions]);
  const close = useAccount((s) => s.close);
  const live = useMarket((s) => s.lastPrices);
  const prices = override ?? live;
  const [editing, setEditing] = useState<string | null>(null);

  const mark = (p: Position) => prices[priceKey(p.kind, p.symbol)] ?? p.entryPrice;
  const editingPosition = positions.find((p) => p.id === editing);

  const columns: Column<Position>[] = [
    { id: 'symbol', header: t('Symbol'), cell: (p) => <SymbolCell symbol={p.symbol} kind={p.kind} />, sortValue: (p) => p.symbol },
    {
      id: 'side',
      header: t('Side'),
      cell: (p) => (
        <span className="inline-flex items-center gap-1.5">
          <SideBadge long={p.direction === 'long'} />
          {p.futures && <span className="num text-[11px] text-muted">{p.futures.leverage}x</span>}
        </span>
      ),
    },
    { id: 'qty', header: t('Quantity'), numeric: true, cell: (p) => formatQty(p.quantity, step(p.symbol, p.kind)), hideOnPhone: true },
    { id: 'entry', header: t('Entry'), numeric: true, cell: (p) => formatPrice(p.entryPrice, tick(p.symbol, p.kind)), hideOnPhone: true },
    { id: 'mark', header: t('Price'), numeric: true, cell: (p) => formatPrice(mark(p), tick(p.symbol, p.kind)), hideOnPhone: true },
    {
      id: 'pnl',
      header: t('P&L'),
      numeric: true,
      cell: (p) => {
        const pnl = unrealizedPnl(p, mark(p));
        return (
          <span className="inline-flex flex-col items-end leading-tight">
            <Pnl value={pnl} />
            {/* For futures this is the return on the margin put up, which leverage multiplies. */}
            <Pnl value={pnl / (p.futures?.margin ?? p.entryPrice * p.quantity)} format="pct" className="text-[11px]" />
          </span>
        );
      },
      sortValue: (p) => unrealizedPnl(p, mark(p)),
    },
    {
      id: 'stop',
      header: t('Stop'),
      numeric: true,
      cell: (p) => (p.stopLoss != null ? formatPrice(p.stopLoss, tick(p.symbol, p.kind)) : <span className="text-warning-text">{t('None')}</span>),
    },
    {
      id: 'target',
      header: t('Target'),
      numeric: true,
      cell: (p) => (p.takeProfit != null ? formatPrice(p.takeProfit, tick(p.symbol, p.kind)) : <span className="text-muted">{t('None')}</span>),
      hideOnPhone: true,
    },
    {
      id: 'liq',
      header: t('Liq. price'),
      numeric: true,
      hideOnPhone: true,
      cell: (p) => {
        const liquidation = liquidationPriceOf(account, p, prices);
        if (liquidation == null) return <span className="text-muted">–</span>;
        return liquidation > 0 ? (
          <span className="text-warning-text">{formatPrice(liquidation, tick(p.symbol, p.kind))}</span>
        ) : (
          <span className="text-muted">{t('None')}</span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      align: 'right',
      cell: (p) => (
        <span className="inline-flex items-center gap-1">
          <IconButton size="sm" label={t('Edit stops for {name}', { name: nameOf(p.symbol, p.kind) })} icon={<Pencil className="size-3.5" />} onClick={() => setEditing(p.id)} />
          <Button
            size="sm"
            aria-label={t('Close {name} position', { name: nameOf(p.symbol, p.kind) })}
            onClick={() => {
              const events = close(accountId, p.id, mark(p), prices, now);
              const closed = events.find((e) => e.type === 'trade_closed');
              if (closed?.type === 'trade_closed') toast.info(t('Position closed'), `${nameOf(p.symbol, p.kind)}: ${formatSignedMoney(closed.trade.netPnl)}`);
            }}
          >
            {t('position::Close')}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        label={t('Open positions')}
        dense
        columns={columns}
        rows={positions}
        rowKey={(p) => p.id}
        empty={<EmptyState className="py-6" icon={<Wallet />} title={t('No open positions')} description={t('Trades you open appear here with their live profit or loss.')} />}
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
        const tickSize = tick(o.symbol, o.kind);
        const attached = [
          o.stopLoss != null && t('stop {price}', { price: formatPrice(o.stopLoss, tickSize) }),
          o.takeProfit != null && t('target {price}', { price: formatPrice(o.takeProfit, tickSize) }),
        ].filter(Boolean);
        return {
          id: o.id,
          symbol: o.symbol,
          kind: o.kind,
          buy: o.side === 'buy',
          type: o.type === 'limit' ? t('Limit') : t('order::Stop'),
          quantity: o.quantity,
          price: (o.type === 'limit' ? o.limitPrice : o.stopPrice) ?? 0,
          note: attached.length ? t('Then {orders}', { orders: attached.join(t(', ')) }) : t('Opens a position'),
          cancel: () => cancel(accountId, o.id),
        };
      });
    const attached = account.positions.flatMap((p): OrderRow[] => {
      const price = prices[priceKey(p.kind, p.symbol)] ?? p.entryPrice;
      const note = p.direction === 'long' ? t('Closes the long') : t('Closes the short');
      const common = { symbol: p.symbol, kind: p.kind, buy: p.direction === 'short', quantity: p.quantity, note };
      return [
        ...(p.stopLoss != null
          ? [{ ...common, id: `${p.id}-sl`, type: t('Stop-loss'), price: p.stopLoss, cancel: () => void setStops(accountId, p.id, { takeProfit: p.takeProfit }, price) }]
          : []),
        ...(p.takeProfit != null
          ? [{ ...common, id: `${p.id}-tp`, type: t('Take-profit'), price: p.takeProfit, cancel: () => void setStops(accountId, p.id, { stopLoss: p.stopLoss }, price) }]
          : []),
      ];
    });
    return [...waiting, ...attached];
  }, [account, accountId, cancel, setStops, prices]);

  const columns: Column<OrderRow>[] = [
    { id: 'symbol', header: t('Symbol'), cell: (r) => <SymbolCell symbol={r.symbol} kind={r.kind} /> },
    { id: 'side', header: t('Side'), cell: (r) => <SideBadge long={r.buy} labels={[t('Buy'), t('Sell')]} /> },
    { id: 'type', header: t('Type'), cell: (r) => r.type },
    { id: 'qty', header: t('Quantity'), numeric: true, cell: (r) => formatQty(r.quantity, step(r.symbol, r.kind)), hideOnPhone: true },
    { id: 'price', header: t('Price'), numeric: true, cell: (r) => formatPrice(r.price, tick(r.symbol, r.kind)) },
    { id: 'note', header: t('What it does'), cell: (r) => <span className="text-muted">{r.note}</span>, hideOnPhone: true },
    {
      id: 'actions',
      header: '',
      align: 'right',
      cell: (r) => (
        <IconButton
          size="sm"
          label={t('Cancel {type} order for {name}', { type: r.type.toLowerCase(), name: nameOf(r.symbol, r.kind) })}
          icon={<X className="size-3.5" />}
          onClick={r.cancel}
        />
      ),
    },
  ];

  return (
    <DataTable
      label={t('Open orders')}
      dense
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      empty={
        <EmptyState
          className="py-6"
          icon={<ClipboardList />}
          title={t('No open orders')}
          description={t('Limit and stop orders wait here until price reaches them, along with any stop-loss or take-profit on an open position.')}
        />
      }
    />
  );
}

// ── History ────────────────────────────────────────────────────────────

const REASONS: Record<Trade['exitReason'], string> = {
  manual: t('Closed by you'),
  stop_loss: t('Stop-loss'),
  take_profit: t('Take-profit'),
  liquidation: t('Liquidated'),
  expiry: t('Expired'),
  assignment: t('Assigned'),
  account_reset: t('Account reset'),
};

const when = (time: number) =>
  new Date(time).toLocaleString(intlLocale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Closed trades, newest first. */
export function HistoryTable({ accountId = 'main' }: TableProps) {
  const trades = useAccount((s) => s.accounts[accountId].trades);
  const rows = useMemo(() => [...trades].reverse(), [trades]);

  const columns: Column<Trade>[] = [
    { id: 'closed', header: t('Closed'), cell: (trade) => <span className="num text-muted">{when(trade.closedAt)}</span>, sortValue: (trade) => trade.closedAt },
    { id: 'symbol', header: t('Symbol'), cell: (trade) => <SymbolCell symbol={trade.symbol} kind={trade.kind} />, sortValue: (trade) => trade.symbol },
    // An option strategy shows its name; its entry and exit are what the whole strategy cost and returned.
    {
      id: 'side',
      header: t('Side'),
      cell: (trade) => (trade.kind === 'option' ? <Badge>{trade.label ?? t('Options')}</Badge> : <SideBadge long={trade.direction === 'long'} />),
    },
    {
      id: 'qty',
      header: t('Quantity'),
      numeric: true,
      cell: (trade) => (trade.kind === 'option' ? <span className="text-muted">–</span> : formatQty(trade.quantity, step(trade.symbol, trade.kind))),
      hideOnPhone: true,
    },
    { id: 'entry', header: t('Entry'), numeric: true, cell: (trade) => formatPrice(trade.entryPrice, trade.kind === 'option' ? 0.01 : tick(trade.symbol, trade.kind)), hideOnPhone: true },
    { id: 'exit', header: t('Exit'), numeric: true, cell: (trade) => formatPrice(trade.exitPrice, trade.kind === 'option' ? 0.01 : tick(trade.symbol, trade.kind)), hideOnPhone: true },
    { id: 'pnl', header: t('Net P&L'), numeric: true, cell: (trade) => <Pnl value={trade.netPnl} />, sortValue: (trade) => trade.netPnl },
    {
      id: 'r',
      header: 'R',
      numeric: true,
      cell: (trade) =>
        trade.rMultiple != null ? (
          <span className={trade.rMultiple >= 0 ? 'text-up-text' : 'text-down-text'}>{`${trade.rMultiple >= 0 ? '+' : ''}${trade.rMultiple.toFixed(2)}R`}</span>
        ) : (
          <span className="text-muted">–</span>
        ),
      sortValue: (trade) => trade.rMultiple ?? 0,
      hideOnPhone: true,
    },
    { id: 'reason', header: t('Exit reason'), cell: (trade) => <span className="text-muted">{REASONS[trade.exitReason]}</span>, hideOnPhone: true },
  ];

  return (
    <DataTable
      label={t('Trade history')}
      dense
      columns={columns}
      rows={rows}
      rowKey={(trade) => trade.id}
      empty={<EmptyState className="py-6" icon={<History />} title={t('No closed trades yet')} description={t('Every trade you close is listed here with its result after fees.')} />}
    />
  );
}
