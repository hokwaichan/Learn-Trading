import { useMemo, useState } from 'react';
import { ChartColumn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineDiagram } from '@/components/chart';
import { Card, EmptyState, GlossaryTerm, Page, PageHeader, Pnl, Select, StatTile, Switch, toneOf, Trans } from '@/components/ui';
import { intlLocale, t } from '@/i18n';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatMoney, formatSignedMoney } from '@/lib/format';
import { breakdown, cumulativePnl, EMOTIONS, KIND_LABELS, longestLosingStreak, maxDrawdown, realisedRewardRisk, weekdayOf, WEEKDAYS, type Breakdown } from '@/lib/journal/journal';
import { tradeStats } from '@/lib/trading/snapshot';
import { useAccount, useJournal } from '@/stores';
import type { InstrumentKind, Trade } from '@/types';

/** Group key for trades with no tag; shown translated. */
const UNTAGGED = 'Not tagged';
const untagged = (key: string) => (key === UNTAGGED ? t('Not tagged') : key);

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
        <p className="px-4 py-6 text-sm text-muted">{t('Nothing to show yet.')}</p>
      ) : (
        <table className="w-full text-sm" aria-label={title}>
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th scope="col" className="px-4 py-2 font-medium">{firstColumn}</th>
              <th scope="col" className="px-2 py-2 text-right font-medium">{t('Trades')}</th>
              <th scope="col" className="px-2 py-2 text-right font-medium">{t('Win rate')}</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">{t('Result')}</th>
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
function standout(groups: Breakdown[]): string | null {
  const enough = groups.filter((g) => g.stats.count >= 3 && g.key !== UNTAGGED);
  if (enough.length < 2) return null;
  const best = enough.reduce((a, b) => (b.stats.expectancy > a.stats.expectancy ? b : a));
  const worst = enough.reduce((a, b) => (b.stats.expectancy < a.stats.expectancy ? b : a));
  if (best.key === worst.key || worst.stats.expectancy >= 0) return null;
  const values = { worst: worst.label, loss: formatMoney(-worst.stats.expectancy), best: best.label, amount: formatMoney(Math.abs(best.stats.expectancy)) };
  return best.stats.expectancy >= 0
    ? t('Your {worst} trades lose {loss} a trade on average, while {best} trades make {amount}.', values)
    : t('Your {worst} trades lose {loss} a trade on average, while {best} trades lose {amount}.', values);
}

export function AnalyticsPage() {
  const accounts = useAccount((s) => s.accounts);
  const notes = useJournal((s) => s.notes);
  const [includeReplay, setIncludeReplay] = useState(false);
  const [kind, setKind] = useState<InstrumentKind | 'all'>('all');

  const trades = useMemo<Trade[]>(() => {
    const all = includeReplay ? [...accounts.main.trades, ...accounts.replay.trades] : accounts.main.trades;
    return kind === 'all' ? all : all.filter((trade) => trade.kind === kind);
  }, [accounts, includeReplay, kind]);

  const stats = useMemo(() => tradeStats(trades), [trades]);
  const curve = useMemo(() => cumulativePnl(trades), [trades]);
  const drawdown = useMemo(() => maxDrawdown(curve), [curve]);
  const rewardRisk = realisedRewardRisk(stats);
  const streak = useMemo(() => longestLosingStreak(trades), [trades]);

  const bySetup = useMemo(() => breakdown(trades, (trade) => notes[trade.positionId]?.setup || UNTAGGED, untagged), [trades, notes]);
  const byKind = useMemo(() => breakdown(trades, (trade) => trade.kind, (k) => KIND_LABELS[k as InstrumentKind], ['spot', 'perpetual', 'option']), [trades]);
  const byDay = useMemo(() => breakdown(trades, (trade) => weekdayOf(trade.openedAt), undefined, WEEKDAYS), [trades]);
  const byEmotion = useMemo(
    () =>
      breakdown(
        trades,
        (trade) => notes[trade.positionId]?.emotion ?? UNTAGGED,
        (k) => EMOTIONS.find((e) => e.id === k)?.label ?? untagged(k),
        EMOTIONS.map((e) => e.id),
      ),
    [trades, notes],
  );
  const bySymbol = useMemo(
    () =>
      breakdown(trades, (trade) => trade.symbol, (s) => {
        const i = findInstrument(s, 'spot');
        return i ? displaySymbol(i) : s;
      }).slice(0, 8),
    [trades],
  );
  const insights = [standout(byEmotion), standout(bySetup)].filter((s): s is string => s != null);
  const tagged = trades.filter((trade) => notes[trade.positionId]?.setup || notes[trade.positionId]?.emotion).length;

  return (
    <Page>
      <PageHeader title={t('Analytics')} description={t('What your closed paper trades add up to, and where the wins and losses come from.')} />

      <Card>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Select<InstrumentKind | 'all'>
            label={t('Type')}
            wrapperClassName="w-44"
            value={kind}
            onChange={setKind}
            options={[{ value: 'all', label: t('All types') }, ...(['spot', 'perpetual', 'option'] as const).map((k) => ({ value: k, label: KIND_LABELS[k] }))]}
          />
          <Switch
            className="max-w-sm flex-1"
            label={t('Include Replay trades')}
            description={t('Off by default: replay trades are made on old prices, often at speed, and would blur the picture.')}
            checked={includeReplay}
            onChange={setIncludeReplay}
          />
        </div>
      </Card>

      {trades.length === 0 ? (
        <EmptyState
          className="rounded-card border border-border py-16"
          icon={<ChartColumn />}
          title={t('No closed trades to analyse yet')}
          description={t('Close a few paper trades and this page fills in: win rate, expectancy, and results by setup, type, day and feeling.')}
          action={
            <Link to="/charts/BTCUSDT" className="text-sm text-accent-text underline underline-offset-4">
              {t('Open the charts')}
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatTile
              label={t('Net result')}
              value={formatSignedMoney(stats.netPnl)}
              tone={toneOf(stats.netPnl)}
              sub={stats.count === 1 ? t('1 closed trade') : t('{n} closed trades', { n: stats.count })}
            />
            <StatTile
              label={<GlossaryTerm id="win-rate">{t('Win rate')}</GlossaryTerm>}
              value={`${(stats.winRate * 100).toFixed(1)}%`}
              sub={t('{wins} won · {losses} lost', { wins: stats.wins, losses: stats.losses })}
            />
            <StatTile
              label={<GlossaryTerm id="expectancy">{t('Expectancy')}</GlossaryTerm>}
              value={formatSignedMoney(stats.expectancy)}
              tone={toneOf(stats.expectancy)}
              sub={t('Average result per trade')}
            />
            <StatTile
              label={t('Average risk/reward')}
              value={stats.avgR != null ? `${stats.avgR >= 0 ? '+' : ''}${stats.avgR.toFixed(2)}R` : rewardRisk != null ? `${rewardRisk.toFixed(2)} : 1` : '–'}
              tone={stats.avgR != null ? toneOf(stats.avgR) : 'neutral'}
              sub={
                stats.avgR != null
                  ? rewardRisk != null
                    ? t('Per trade with a stop-loss · wins {n}x losses', { n: rewardRisk.toFixed(2) })
                    : t('Per trade with a stop-loss')
                  : rewardRisk != null
                    ? t('Average win against average loss')
                    : t('Needs a win and a loss')
              }
            />
            <StatTile
              label={<GlossaryTerm id="profit-factor">{t('Profit factor')}</GlossaryTerm>}
              value={Number.isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : t('No losses')}
              tone={stats.profitFactor >= 1 ? 'up' : 'down'}
              sub={t('Avg win {win} · loss {loss}', { win: formatMoney(stats.avgWin), loss: formatMoney(stats.avgLoss) })}
            />
            <StatTile
              label={<GlossaryTerm id="drawdown">{t('Max drawdown')}</GlossaryTerm>}
              value={drawdown > 0 ? `-${formatMoney(drawdown)}` : '$0.00'}
              tone={drawdown > 0 ? 'down' : 'neutral'}
              sub={t('Longest losing run: {n}', { n: streak })}
            />
          </div>

          {stats.count < 20 && (
            <p role="note" className="rounded-card border border-border bg-surface px-4 py-3 text-sm text-muted">
              {stats.count === 1 ? (
                t('With only 1 trade, these numbers are mostly luck. They start to mean something after a few dozen.')
              ) : (
                <Trans
                  text="With only {n} trades, these numbers are mostly luck. They start to mean something after a few dozen."
                  values={{ n: <span className="num text-fg">{stats.count}</span> }}
                />
              )}
            </p>
          )}
          {insights.length > 0 && (
            <div role="note" className="rounded-card border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg">
              <p className="font-medium">{t('What stands out')}</p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {insights.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title={t('Profit over time')}>
              {curve.length > 1 ? (
                <LineDiagram
                  ariaLabel={t('Running total of profit across {n} closed trades, ending at {total}.', { n: stats.count, total: formatSignedMoney(stats.netPnl) })}
                  series={[{ points: curve.map((p) => ({ x: p.time, y: p.value })) }]}
                  shadeProfit
                  formatX={(x) => new Date(x).toLocaleDateString(intlLocale(), { month: 'short', day: 'numeric' })}
                  formatY={(y) => `${y < 0 ? '-' : ''}$${Math.abs(y) >= 1000 ? `${(Math.abs(y) / 1000).toFixed(1)}k` : Math.abs(y).toFixed(0)}`}
                  height={240}
                />
              ) : (
                <p className="text-sm text-muted">{t('Not enough trades to draw a curve.')}</p>
              )}
              <p className="mt-2 text-xs text-muted">{t('The running total of closed trades after fees and funding. Open positions are not included.')}</p>
            </Card>
            <BreakdownTable
              title={t('By setup')}
              firstColumn={t('Setup')}
              groups={bySetup}
              hint={tagged === 0 ? t('Tag trades with a setup in the Journal to see which ones pay.') : t('Which of your setups make money, and which only feel like they do.')}
            />
            <BreakdownTable title={t('By instrument type')} firstColumn={t('Type')} groups={byKind} hint={t('Spot, futures and options side by side.')} />
            <BreakdownTable title={t('By day of the week')} firstColumn={t('Day opened')} groups={byDay} hint={t('The day each trade was opened, in your local time.')} />
            <BreakdownTable
              title={t('By feeling')}
              firstColumn={t('Feeling at entry')}
              groups={byEmotion}
              hint={tagged === 0 ? t('Tag how you felt in the Journal to see what it costs or earns you.') : t('Trades taken out of FOMO or revenge usually show up here.')}
            />
            <BreakdownTable title={t('By symbol')} firstColumn={t('Symbol')} groups={bySymbol} hint={t('Your eight most traded symbols.')} />
          </div>
        </>
      )}
    </Page>
  );
}
