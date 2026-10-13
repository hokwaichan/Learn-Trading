import { useMemo, useState } from 'react';
import { ChartColumn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineDiagram } from '@/components/chart';
import { Card, EmptyState, GlossaryTerm, Page, PageHeader, Pnl, Select, StatTile, Switch, toneOf } from '@/components/ui';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatMoney, formatSignedMoney } from '@/lib/format';
import { breakdown, cumulativePnl, EMOTIONS, KIND_LABELS, longestLosingStreak, maxDrawdown, realisedRewardRisk, weekdayOf, WEEKDAYS, type Breakdown } from '@/lib/journal/journal';
import { tradeStats } from '@/lib/trading/snapshot';
import { useAccount, useJournal } from '@/stores';
import type { InstrumentKind, Trade } from '@/types';

const UNTAGGED = 'Not tagged';

/**
 * One way of slicing the trades: a row per group with its trade count, win
 * rate and total result. The bar length compares the size of each result;
 * the sign and the number carry the direction.
 */
function BreakdownTable({ title, groups, hint, firstColumn }: { title: string; groups: Breakdown[]; hint: string; firstColumn: string }) {
  const largest = Math.max(1e-9, ...groups.map((g) => Math.abs(g.stats.netPnl)));
  return (
    <Card title={title} flush>
      {groups.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted">Nothing to show yet.</p>
      ) : (
        <table className="w-full text-sm" aria-label={title}>
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th scope="col" className="px-4 py-2 font-medium">{firstColumn}</th>
              <th scope="col" className="px-2 py-2 text-right font-medium">Trades</th>
              <th scope="col" className="px-2 py-2 text-right font-medium">Win rate</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.key} className="border-b border-border/60 last:border-0">
                <th scope="row" className="px-4 py-2 text-left font-normal text-fg">
                  {g.label}
                  <span aria-hidden className="mt-1 block h-1.5 overflow-hidden rounded-full bg-border/60">
                    <span className={`block h-full rounded-full ${g.stats.netPnl >= 0 ? 'bg-up' : 'bg-down'}`} style={{ width: `${Math.max(2, (Math.abs(g.stats.netPnl) / largest) * 100)}%` }} />
                  </span>
                </th>
                <td className="num px-2 py-2 text-right text-muted">{g.stats.count}</td>
                <td className="num px-2 py-2 text-right text-fg">{(g.stats.winRate * 100).toFixed(0)}%</td>
                <td className="num px-4 py-2 text-right">
                  <Pnl value={g.stats.netPnl} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="border-t border-border px-4 py-2 text-xs text-muted">{hint}</p>
    </Card>
  );
}

/** A plain sentence about the best and worst group, when there is enough to say. */
function standout(groups: Breakdown[], noun: string): string | null {
  const enough = groups.filter((g) => g.stats.count >= 3 && g.key !== UNTAGGED);
  if (enough.length < 2) return null;
  const best = enough.reduce((a, b) => (b.stats.expectancy > a.stats.expectancy ? b : a));
  const worst = enough.reduce((a, b) => (b.stats.expectancy < a.stats.expectancy ? b : a));
  if (best.key === worst.key || worst.stats.expectancy >= 0) return null;
  return `Your ${worst.label} ${noun} lose ${formatMoney(-worst.stats.expectancy)} a trade on average, while ${best.label} ${noun} ${best.stats.expectancy >= 0 ? 'make' : 'lose'} ${formatMoney(Math.abs(best.stats.expectancy))}.`;
}

export function AnalyticsPage() {
  const accounts = useAccount((s) => s.accounts);
  const notes = useJournal((s) => s.notes);
  const [includeReplay, setIncludeReplay] = useState(false);
  const [kind, setKind] = useState<InstrumentKind | 'all'>('all');

  const trades = useMemo<Trade[]>(() => {
    const all = includeReplay ? [...accounts.main.trades, ...accounts.replay.trades] : accounts.main.trades;
    return kind === 'all' ? all : all.filter((t) => t.kind === kind);
  }, [accounts, includeReplay, kind]);

  const stats = useMemo(() => tradeStats(trades), [trades]);
  const curve = useMemo(() => cumulativePnl(trades), [trades]);
  const drawdown = useMemo(() => maxDrawdown(curve), [curve]);
  const rewardRisk = realisedRewardRisk(stats);
  const streak = useMemo(() => longestLosingStreak(trades), [trades]);

  const bySetup = useMemo(() => breakdown(trades, (t) => notes[t.positionId]?.setup || UNTAGGED), [trades, notes]);
  const byKind = useMemo(() => breakdown(trades, (t) => t.kind, (k) => KIND_LABELS[k as InstrumentKind], ['spot', 'perpetual', 'option']), [trades]);
  const byDay = useMemo(() => breakdown(trades, (t) => weekdayOf(t.openedAt), undefined, WEEKDAYS), [trades]);
  const byEmotion = useMemo(
    () => breakdown(trades, (t) => notes[t.positionId]?.emotion ?? UNTAGGED, (k) => EMOTIONS.find((e) => e.id === k)?.label ?? k, EMOTIONS.map((e) => e.id)),
    [trades, notes],
  );
  const bySymbol = useMemo(
    () => breakdown(trades, (t) => t.symbol, (s) => { const i = findInstrument(s, 'spot'); return i ? displaySymbol(i) : s; }).slice(0, 8),
    [trades],
  );
  const insights = [standout(byEmotion, 'trades'), standout(bySetup, 'trades')].filter((s): s is string => s != null);
  const tagged = trades.filter((t) => notes[t.positionId]?.setup || notes[t.positionId]?.emotion).length;

  return (
    <Page>
      <PageHeader title="Analytics" description="What your closed paper trades add up to, and where the wins and losses come from." />

      <Card>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Select<InstrumentKind | 'all'>
            label="Type"
            wrapperClassName="w-44"
            value={kind}
            onChange={setKind}
            options={[{ value: 'all', label: 'All types' }, ...(['spot', 'perpetual', 'option'] as const).map((k) => ({ value: k, label: KIND_LABELS[k] }))]}
          />
          <Switch
            className="max-w-sm flex-1"
            label="Include Replay trades"
            description="Off by default: replay trades are made on old prices, often at speed, and would blur the picture."
            checked={includeReplay}
            onChange={setIncludeReplay}
          />
        </div>
      </Card>

      {trades.length === 0 ? (
        <EmptyState
          className="rounded-card border border-border py-16"
          icon={<ChartColumn />}
          title="No closed trades to analyse yet"
          description="Close a few paper trades and this page fills in: win rate, expectancy, and results by setup, type, day and feeling."
          action={
            <Link to="/charts/BTCUSDT" className="text-sm text-accent-text underline underline-offset-4">
              Open the charts
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatTile label="Net result" value={formatSignedMoney(stats.netPnl)} tone={toneOf(stats.netPnl)} sub={`${stats.count} closed ${stats.count === 1 ? 'trade' : 'trades'}`} />
            <StatTile label={<GlossaryTerm id="win-rate">Win rate</GlossaryTerm>} value={`${(stats.winRate * 100).toFixed(1)}%`} sub={`${stats.wins} won · ${stats.losses} lost`} />
            <StatTile label={<GlossaryTerm id="expectancy">Expectancy</GlossaryTerm>} value={formatSignedMoney(stats.expectancy)} tone={toneOf(stats.expectancy)} sub="Average result per trade" />
            <StatTile
              label="Average risk/reward"
              value={stats.avgR != null ? `${stats.avgR >= 0 ? '+' : ''}${stats.avgR.toFixed(2)}R` : rewardRisk != null ? `${rewardRisk.toFixed(2)} : 1` : '–'}
              tone={stats.avgR != null ? toneOf(stats.avgR) : 'neutral'}
              sub={
                stats.avgR != null
                  ? `Per trade with a stop-loss${rewardRisk != null ? ` · wins ${rewardRisk.toFixed(2)}x losses` : ''}`
                  : rewardRisk != null
                    ? 'Average win against average loss'
                    : 'Needs a win and a loss'
              }
            />
            <StatTile
              label={<GlossaryTerm id="profit-factor">Profit factor</GlossaryTerm>}
              value={Number.isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : 'No losses'}
              tone={stats.profitFactor >= 1 ? 'up' : 'down'}
              sub={`Avg win ${formatMoney(stats.avgWin)} · loss ${formatMoney(stats.avgLoss)}`}
            />
            <StatTile
              label={<GlossaryTerm id="drawdown">Max drawdown</GlossaryTerm>}
              value={drawdown > 0 ? `-${formatMoney(drawdown)}` : '$0.00'}
              tone={drawdown > 0 ? 'down' : 'neutral'}
              sub={`Longest losing run: ${streak}`}
            />
          </div>

          {stats.count < 20 && (
            <p role="note" className="rounded-card border border-border bg-surface px-4 py-3 text-sm text-muted">
              With only <span className="num text-fg">{stats.count}</span> {stats.count === 1 ? 'trade' : 'trades'}, these numbers are mostly luck. They start to mean something after a few
              dozen.
            </p>
          )}
          {insights.length > 0 && (
            <div role="note" className="rounded-card border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg">
              <p className="font-medium">What stands out</p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {insights.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Profit over time">
              {curve.length > 1 ? (
                <LineDiagram
                  ariaLabel={`Running total of profit across ${stats.count} closed trades, ending at ${formatSignedMoney(stats.netPnl)}.`}
                  series={[{ points: curve.map((p) => ({ x: p.time, y: p.value })) }]}
                  shadeProfit
                  formatX={(x) => new Date(x).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  formatY={(y) => `${y < 0 ? '-' : ''}$${Math.abs(y) >= 1000 ? `${(Math.abs(y) / 1000).toFixed(1)}k` : Math.abs(y).toFixed(0)}`}
                  height={240}
                />
              ) : (
                <p className="text-sm text-muted">Not enough trades to draw a curve.</p>
              )}
              <p className="mt-2 text-xs text-muted">The running total of closed trades after fees and funding. Open positions are not included.</p>
            </Card>
            <BreakdownTable title="By setup" firstColumn="Setup" groups={bySetup} hint={tagged === 0 ? 'Tag trades with a setup in the Journal to see which ones pay.' : 'Which of your setups make money, and which only feel like they do.'} />
            <BreakdownTable title="By instrument type" firstColumn="Type" groups={byKind} hint="Spot, futures and options side by side." />
            <BreakdownTable title="By day of the week" firstColumn="Day opened" groups={byDay} hint="The day each trade was opened, in your local time." />
            <BreakdownTable title="By feeling" firstColumn="Feeling at entry" groups={byEmotion} hint={tagged === 0 ? 'Tag how you felt in the Journal to see what it costs or earns you.' : 'Trades taken out of FOMO or revenge usually show up here.'} />
            <BreakdownTable title="By symbol" firstColumn="Symbol" groups={bySymbol} hint="Your eight most traded symbols." />
          </div>
        </>
      )}
    </Page>
  );
}
