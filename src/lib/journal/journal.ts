import { t } from '@/i18n';
import { tradeStats, type TradeStats } from '@/lib/trading/snapshot';
import type { Account, AccountId, EmotionTag, InstrumentKind, JournalEvent, JournalNote, Position, Timeframe, Trade } from '@/types';

export const EMOTIONS: { id: EmotionTag; label: string; hint: string }[] = [
  { id: 'calm', label: t('Calm'), hint: t('Following the plan, no rush.') },
  { id: 'confident', label: t('Confident'), hint: t('Sure of the setup.') },
  { id: 'fomo', label: t('FOMO'), hint: t('Afraid of missing the move.') },
  { id: 'fearful', label: t('Fearful'), hint: t('Worried about losing.') },
  { id: 'revenge', label: t('Revenge'), hint: t('Trying to win back a loss.') },
  { id: 'bored', label: t('Bored'), hint: t('Trading for something to do.') },
  { id: 'greedy', label: t('Greedy'), hint: t('Wanting more than the plan.') },
];

/** Suggested setup names, in the app's language. Any text is allowed, and is kept as typed. */
export const SETUP_SUGGESTIONS = [t('Trend following'), t('Pullback'), t('Breakout'), t('Range'), t('Reversal'), t('News'), t('No setup')];

export const KIND_LABELS: Record<InstrumentKind, string> = { spot: t('Spot'), perpetual: t('Futures'), option: t('Options') };

export const EXIT_LABELS: Record<Trade['exitReason'], string> = {
  manual: t('Closed by you'),
  stop_loss: t('Stop-loss'),
  take_profit: t('Take-profit'),
  liquidation: t('Liquidated'),
  expiry: t('Expired'),
  assignment: t('Assigned at expiry'),
  account_reset: t('Account reset'),
};

/** One line of the journal: a closed trade, or a position that is still open. */
export interface JournalRow {
  /** The position id: the same before and after the trade closes, so notes carry over. */
  id: string;
  accountId: AccountId;
  status: 'open' | 'closed';
  symbol: string;
  kind: InstrumentKind;
  /** The option strategy's name, when there is one. */
  label?: string;
  direction: Trade['direction'];
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  openedAt: number;
  closedAt?: number;
  netPnl?: number;
  rMultiple?: number;
  trade?: Trade;
  position?: Position;
  note?: JournalNote;
}

/** Every closed trade and open position of the given accounts, newest first. */
export function journalRows(accounts: Account[], notes: Record<string, JournalNote>): JournalRow[] {
  const rows: JournalRow[] = [];
  for (const account of accounts) {
    for (const trade of account.trades) {
      rows.push({
        id: trade.positionId,
        accountId: account.id,
        status: 'closed',
        symbol: trade.symbol,
        kind: trade.kind,
        label: trade.label,
        direction: trade.direction,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        openedAt: trade.openedAt,
        closedAt: trade.closedAt,
        netPnl: trade.netPnl,
        rMultiple: trade.rMultiple,
        trade,
        note: notes[trade.positionId],
      });
    }
    for (const position of account.positions) {
      rows.push({
        id: position.id,
        accountId: account.id,
        status: 'open',
        symbol: position.option?.strategy.underlying ?? position.symbol,
        kind: position.kind,
        label: position.option?.strategy.name,
        direction: position.direction,
        quantity: position.quantity,
        entryPrice: position.entryPrice,
        openedAt: position.openedAt,
        position,
        note: notes[position.id],
      });
    }
  }
  return rows.sort((a, b) => (b.closedAt ?? Infinity) - (a.closedAt ?? Infinity) || b.openedAt - a.openedAt);
}

export interface JournalFilter {
  kind?: InstrumentKind | 'all';
  result?: 'all' | 'wins' | 'losses' | 'open';
  setup?: string;
  emotion?: EmotionTag | 'all' | 'none';
  /** Matches the symbol or the strategy name, ignoring case. */
  search?: string;
}

export function filterRows(rows: JournalRow[], filter: JournalFilter): JournalRow[] {
  const search = filter.search?.trim().toLowerCase();
  return rows.filter((row) => {
    if (filter.kind && filter.kind !== 'all' && row.kind !== filter.kind) return false;
    if (filter.result === 'open' && row.status !== 'open') return false;
    if (filter.result === 'wins' && !((row.netPnl ?? 0) > 0)) return false;
    if (filter.result === 'losses' && !((row.netPnl ?? 0) < 0)) return false;
    if (filter.setup && (row.note?.setup ?? '') !== filter.setup) return false;
    if (filter.emotion === 'none' && row.note?.emotion) return false;
    if (filter.emotion && filter.emotion !== 'all' && filter.emotion !== 'none' && row.note?.emotion !== filter.emotion) return false;
    if (search && !`${row.symbol} ${row.label ?? ''}`.toLowerCase().includes(search)) return false;
    return true;
  });
}

/** Setup names in use, most used first, then the suggestions not yet used. */
export function setupOptions(notes: Record<string, JournalNote>): string[] {
  const counts = new Map<string, number>();
  for (const note of Object.values(notes)) if (note.setup) counts.set(note.setup, (counts.get(note.setup) ?? 0) + 1);
  const used = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => name);
  return [...used, ...SETUP_SUGGESTIONS.filter((s) => !counts.has(s))];
}

/** Ledger notes are saved in English; this shows them in the app's language. */
function ledgerNote(note: string): string {
  const payments = /^(\d+) funding payments$/.exec(note);
  return payments ? t('{n} funding payments', { n: payments[1] }) : t(note);
}

/** Funding payments and the liquidation fee recorded against a trade, oldest first. */
export function tradeEvents(account: Account, positionId: string, trade?: Trade): JournalEvent[] {
  const events: JournalEvent[] = [];
  for (const entry of account.ledger) {
    if (entry.refId !== positionId) continue;
    if (entry.type === 'funding') {
      events.push({ time: entry.time, type: 'funding', amount: entry.amount, note: entry.note ? ledgerNote(entry.note) : entry.amount <= 0 ? t('Funding paid') : t('Funding received') });
    } else if (entry.type === 'liquidation') {
      events.push({ time: entry.time, type: 'liquidation', amount: entry.amount, note: t('Liquidated: the rest of the margin was taken as a fee') });
    }
  }
  if (trade?.exitReason === 'expiry') events.push({ time: trade.closedAt, type: 'expiry', amount: trade.exitPrice, note: t('Expired and settled in cash at its exercise value') });
  if (trade?.exitReason === 'assignment') events.push({ time: trade.closedAt, type: 'assignment', amount: trade.exitPrice, note: t('Expired with a sold option in the money: assigned and settled in cash') });
  return events.sort((a, b) => a.time - b.time);
}

// ── CSV ────────────────────────────────────────────────────────────────

/** Quotes a value for CSV when it needs it, and stops spreadsheets treating text as a formula. */
export function csvCell(value: string | number | undefined | null): string {
  if (value == null) return '';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';
  // A leading =, +, - or @ makes Excel and Sheets run the cell as a formula.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

const iso = (time?: number) => (time != null ? new Date(time).toISOString() : '');
const round = (value: number | undefined, digits: number) => (value != null && Number.isFinite(value) ? Number(value.toFixed(digits)) : undefined);

/** Column headings, in the app's language. */
export const CSV_COLUMNS = [
  t('Account'), t('Status'), t('Opened (UTC)'), t('Closed (UTC)'), t('Symbol'), t('Type'), t('Strategy'), t('Side'), t('Quantity'), t('Leverage'),
  t('Entry price'), t('Exit price'), t('Gross P&L'), t('Fees'), t('Funding'), t('Net P&L'), t('Return %'), t('R multiple'), t('Exit reason'),
  t('Setup'), t('Emotion'), t('Rating'), t('Reasoning'), t('Review'),
];

/** The journal as CSV text, one row per trade, with a header row. */
export function toCsv(rows: JournalRow[]): string {
  const lines = [CSV_COLUMNS.join(',')];
  for (const row of rows) {
    const trade = row.trade;
    const cells = [
      row.accountId === 'main' ? t('Paper') : t('Replay'),
      row.status === 'open' ? t('status::Open') : t('Closed'),
      iso(row.openedAt),
      iso(row.closedAt),
      row.symbol,
      KIND_LABELS[row.kind],
      row.label,
      row.kind === 'option' ? undefined : row.direction === 'long' ? t('Long') : t('Short'),
      row.kind === 'option' ? undefined : row.quantity,
      trade?.leverage ?? row.position?.futures?.leverage,
      row.entryPrice,
      row.exitPrice,
      round(trade?.grossPnl, 2),
      round(trade?.fees, 2),
      round(trade?.funding, 2),
      round(trade?.netPnl, 2),
      round(trade ? trade.returnPct * 100 : undefined, 2),
      round(trade?.rMultiple, 2),
      trade ? EXIT_LABELS[trade.exitReason] : undefined,
      row.note?.setup,
      row.note?.emotion ? EMOTIONS.find((e) => e.id === row.note!.emotion)?.label : undefined,
      row.note?.rating,
      row.note?.reasoning,
      row.note?.review,
    ];
    lines.push(cells.map(csvCell).join(','));
  }
  return `${lines.join('\r\n')}\r\n`;
}

// ── Chart snapshots ────────────────────────────────────────────────────

const SECONDS: Record<Timeframe, number> = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14_400, '1d': 86_400 };

export interface SnapshotPlan {
  timeframe: Timeframe;
  /** Range to fetch, in milliseconds. */
  from: number;
  to: number;
}

/**
 * Chooses the candles to keep with a trade: the smallest candle size that
 * shows the whole trade in at most about 150 candles, with room before the
 * entry and after the exit for context.
 */
export function snapshotPlan(openedAt: number, closedAt: number, available: Timeframe[]): SnapshotPlan {
  const duration = Math.max(0, closedAt - openedAt);
  const sorted = [...available].sort((a, b) => SECONDS[a] - SECONDS[b]);
  const timeframe = sorted.find((tf) => duration / (SECONDS[tf] * 1000) <= 150) ?? sorted[sorted.length - 1];
  const step = SECONDS[timeframe] * 1000;
  const pad = Math.max(duration / 2, 50 * step);
  return { timeframe, from: openedAt - pad, to: closedAt + Math.max(duration / 4, 20 * step) };
}

// ── Analytics ──────────────────────────────────────────────────────────

export interface Breakdown {
  key: string;
  label: string;
  stats: TradeStats;
}

/** Splits trades into groups and summarises each. Groups come back in the order of `order`, then by size. */
export function breakdown(trades: Trade[], keyOf: (trade: Trade) => string, labelOf: (key: string) => string = (k) => k, order: string[] = []): Breakdown[] {
  const groups = new Map<string, Trade[]>();
  for (const trade of trades) {
    const key = keyOf(trade);
    const list = groups.get(key);
    if (list) list.push(trade);
    else groups.set(key, [trade]);
  }
  const rank = (key: string) => {
    const i = order.indexOf(key);
    return i === -1 ? order.length : i;
  };
  return [...groups.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([key, list]) => ({ key, label: labelOf(key), stats: tradeStats(list) }));
}

export const WEEKDAYS = [t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday'), t('Sunday')];

/** Day of the week a trade was opened, in local time, Monday first. */
export function weekdayOf(time: number): string {
  return WEEKDAYS[(new Date(time).getDay() + 6) % 7];
}

/** Running total of net profit after each trade, in closing order, starting from zero at the first open. */
export function cumulativePnl(trades: Trade[]): { time: number; value: number }[] {
  const sorted = [...trades].sort((a, b) => a.closedAt - b.closedAt);
  if (sorted.length === 0) return [];
  let total = 0;
  const points = [{ time: Math.min(...sorted.map((t) => t.openedAt)), value: 0 }];
  for (const trade of sorted) {
    total += trade.netPnl;
    points.push({ time: trade.closedAt, value: total });
  }
  return points;
}

/** The largest fall in the running total from a peak, in dollars. */
export function maxDrawdown(points: { value: number }[]): number {
  let peak = -Infinity;
  let worst = 0;
  for (const p of points) {
    peak = Math.max(peak, p.value);
    worst = Math.max(worst, peak - p.value);
  }
  return worst;
}

/**
 * Average reward-to-risk actually achieved: the average win divided by the
 * average loss. Null without at least one of each.
 */
export function realisedRewardRisk(stats: TradeStats): number | null {
  return stats.wins > 0 && stats.losses > 0 && stats.avgLoss > 0 ? stats.avgWin / stats.avgLoss : null;
}

/** The longest run of consecutive losing trades, in closing order. */
export function longestLosingStreak(trades: Trade[]): number {
  let run = 0;
  let longest = 0;
  for (const trade of [...trades].sort((a, b) => a.closedAt - b.closedAt)) {
    run = trade.netPnl < 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return longest;
}
