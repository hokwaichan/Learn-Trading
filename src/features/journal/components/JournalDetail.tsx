import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriceChart, TradeMarkerLayer, type PriceLine, type TradeMarker } from '@/components/chart';
import { Badge, Button, Card, cn, EmptyState, Input, LoadingState, Pnl, Textarea } from '@/components/ui';
import { displaySymbol, findInstrument, TIMEFRAME_NAMES } from '@/lib/data';
import { formatMoney, formatPrice, formatQty, formatSignedMoney } from '@/lib/format';
import { EMOTIONS, EXIT_LABELS, KIND_LABELS, setupOptions, tradeEvents, type JournalRow } from '@/lib/journal/journal';
import { loadSnapshot, useAccount, useJournal } from '@/stores';
import type { ChartSnapshot } from '@/types';

const stamp = (time: number) => new Date(time).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function duration(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)} min`;
  const hours = minutes / 60;
  if (hours < 48) return `${hours.toFixed(hours < 10 ? 1 : 0)} hours`;
  return `${Math.round(hours / 24)} days`;
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="num text-right text-sm text-fg">{children}</dd>
    </div>
  );
}

/** The saved chart for a trade, with its entry, exit, stop and target marked. */
function SnapshotChart({ row }: { row: JournalRow }) {
  const [state, setState] = useState<{ id: string; snapshot: ChartSnapshot | null } | null>(null);
  useEffect(() => {
    let cancelled = false;
    void loadSnapshot(row).then((snapshot) => {
      if (!cancelled) setState({ id: row.id, snapshot });
    });
    return () => {
      cancelled = true;
    };
    // The chart is rebuilt when the trade changes or closes, not on every price tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.id, row.status]);

  const snapshot = state?.id === row.id ? state.snapshot : undefined;
  const instrument = findInstrument(row.symbol, row.kind === 'perpetual' ? 'perpetual' : 'spot') ?? findInstrument(row.symbol, 'spot');
  const long = row.direction === 'long';
  const option = row.kind === 'option';

  const { markers, lines } = useMemo(() => {
    const markers: TradeMarker[] = [];
    const lines: PriceLine[] = [];
    if (!snapshot) return { markers, lines };
    // Put each marker on the candle that contains its time.
    const candleAt = (time: number) => {
      let found = snapshot.candles[0].time;
      for (const c of snapshot.candles) if (c.time * 1000 <= time) found = c.time;
      return found;
    };
    for (const m of snapshot.markers) {
      if (m.kind === 'entry') {
        markers.push({ time: candleAt(m.time), side: long ? 'buy' : 'sell', text: option ? 'Opened' : long ? 'Buy' : 'Short' });
        if (!option) lines.push({ price: m.price, title: 'Entry', tone: 'accent' });
      } else if (m.kind === 'exit' || m.kind === 'liquidation') {
        markers.push({ time: candleAt(m.time), side: long ? 'sell' : 'buy', text: m.kind === 'liquidation' ? 'Liquidated' : option ? 'Closed' : long ? 'Sell' : 'Cover' });
        if (!option) lines.push({ price: m.price, title: m.kind === 'liquidation' ? 'Liquidation' : 'Exit', tone: m.kind === 'liquidation' ? 'warning' : 'muted' });
      } else if (m.kind === 'stop') lines.push({ price: m.price, title: 'Stop-loss', tone: 'down', dashed: true });
      else if (m.kind === 'target') lines.push({ price: m.price, title: 'Take-profit', tone: 'up', dashed: true });
    }
    return { markers, lines };
  }, [snapshot, long, option]);

  if (snapshot === undefined) return <LoadingState className="h-72" label="Loading the chart for this trade" />;
  if (snapshot === null || !instrument) {
    return <EmptyState className="h-72" title="No chart for this trade" description="The price history around it could not be loaded. The numbers and your notes are unaffected." />;
  }
  return (
    <>
      <div className="h-80">
        <PriceChart
          candles={snapshot.candles}
          chartType="candles"
          timeframe={snapshot.timeframe}
          tickSize={instrument.tickSize}
          title={displaySymbol(instrument)}
          viewKey={`journal:${row.id}:${snapshot.candles.length}`}
          showVolume={false}
          embedded
          priceLines={lines}
          includePrices={lines.map((l) => l.price)}
        >
          <TradeMarkerLayer markers={markers} />
        </PriceChart>
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-muted">
        {TIMEFRAME_NAMES[snapshot.timeframe]} candles around the trade{row.status === 'open' ? ', up to now' : ', saved when it closed'}.
        {option && ` This is ${instrument.base}, the underlying; the strategy itself has no price chart.`}
      </p>
    </>
  );
}

/** One trade: its chart, its numbers, and the user's notes. */
export function JournalDetail({ row }: { row: JournalRow }) {
  const account = useAccount((s) => s.accounts[row.accountId]);
  const notes = useJournal((s) => s.notes);
  const annotate = useJournal((s) => s.annotate);
  const note = notes[row.id];
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const instrument = findInstrument(row.symbol, row.kind === 'perpetual' ? 'perpetual' : 'spot') ?? findInstrument(row.symbol, 'spot');
  const name = instrument ? displaySymbol(instrument) : row.symbol;
  const tick = instrument?.tickSize ?? 0.01;
  const t = row.trade;
  const option = row.kind === 'option';
  const events = useMemo(() => tradeEvents(account, row.id, t), [account, row.id, t]);
  const setups = useMemo(() => setupOptions(notes), [notes]);
  const leverage = t?.leverage ?? row.position?.futures?.leverage;

  const save = (patch: Parameters<typeof annotate>[1]) => {
    annotate(row.id, patch);
    setSavedAt(Date.now());
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4 md:p-6">
        <Link to="/journal" className="inline-flex items-center gap-1.5 self-start text-sm text-accent-text underline-offset-4 hover:underline">
          <ArrowLeft aria-hidden className="size-4" /> All trades
        </Link>

        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-fg">
              {row.label ? `${row.label} on ${name}` : `${name} ${row.direction === 'long' ? 'long' : 'short'}`}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <Badge>{KIND_LABELS[row.kind]}</Badge>
              {leverage != null && leverage > 1 && <Badge>{leverage}x</Badge>}
              {row.accountId === 'replay' && <Badge tone="accent">Replay</Badge>}
              {row.status === 'open' ? <Badge tone="accent">Still open</Badge> : <span>{EXIT_LABELS[t!.exitReason]}</span>}
            </p>
          </div>
          {t && (
            <div className="text-right">
              <div className="text-xs text-muted">Result after costs</div>
              <Pnl value={t.netPnl} className="text-2xl font-medium" />
            </div>
          )}
        </header>

        <Card title="Chart" flush>
          <SnapshotChart row={row} />
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="The numbers">
            <dl>
              <Fact label="Opened">{stamp(row.openedAt)}</Fact>
              {row.closedAt != null && <Fact label="Closed">{stamp(row.closedAt)}</Fact>}
              {row.closedAt != null && <Fact label="Held for">{duration(row.closedAt - row.openedAt)}</Fact>}
              {option ? (
                <>
                  <Fact label="Cost to open">{row.entryPrice >= 0 ? formatMoney(row.entryPrice) : `${formatMoney(-row.entryPrice)} credit`}</Fact>
                  {row.exitPrice != null && <Fact label="Value at close">{formatMoney(row.exitPrice)}</Fact>}
                </>
              ) : (
                <>
                  <Fact label="Quantity">{`${formatQty(row.quantity, instrument?.stepSize)} ${instrument?.base ?? ''}`}</Fact>
                  <Fact label="Entry price">{formatPrice(row.entryPrice, tick)}</Fact>
                  {row.exitPrice != null && <Fact label="Exit price">{formatPrice(row.exitPrice, tick)}</Fact>}
                  {(t?.stopLoss ?? row.position?.stopLoss) != null && <Fact label="Stop-loss">{formatPrice((t?.stopLoss ?? row.position?.stopLoss)!, tick)}</Fact>}
                  {(t?.takeProfit ?? row.position?.takeProfit) != null && <Fact label="Take-profit">{formatPrice((t?.takeProfit ?? row.position?.takeProfit)!, tick)}</Fact>}
                </>
              )}
              {t && (
                <>
                  <Fact label="Profit before costs">
                    <Pnl value={t.grossPnl} />
                  </Fact>
                  <Fact label="Fees">{formatSignedMoney(-t.fees)}</Fact>
                  {t.funding !== 0 && <Fact label={t.funding > 0 ? 'Funding paid' : 'Funding received'}>{formatSignedMoney(-t.funding)}</Fact>}
                  <Fact label="Result after costs">
                    <Pnl value={t.netPnl} />
                  </Fact>
                  <Fact label={leverage != null && leverage > 1 ? 'Return on margin' : 'Return'}>
                    <Pnl value={t.returnPct} format="pct" />
                  </Fact>
                  <Fact label="Result in R">
                    {t.rMultiple != null ? (
                      <span className={t.rMultiple >= 0 ? 'text-up-text' : 'text-down-text'}>{`${t.rMultiple >= 0 ? '+' : ''}${t.rMultiple.toFixed(2)}R`}</span>
                    ) : (
                      <span className="text-muted">No stop-loss, so no R</span>
                    )}
                  </Fact>
                </>
              )}
            </dl>
            {events.length > 0 && (
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-fg">What happened along the way</h3>
                <ul className="mt-1 flex flex-col gap-1">
                  {events.map((e, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-3 text-xs">
                      <span className="text-muted">
                        <span className="num">{stamp(e.time)}</span> · {e.note}
                      </span>
                      {(e.type === 'funding' || e.type === 'liquidation') && <span className="num text-fg">{formatSignedMoney(e.amount)}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card
            title="Your notes"
            actions={
              savedAt != null && (
                <span className="flex items-center gap-1 text-xs text-muted" role="status">
                  <Check aria-hidden className="size-3.5" /> Saved
                </span>
              )
            }
          >
            <div className="flex flex-col gap-4">
              <Textarea label="Why did you take this trade?" hint="What you saw, and what would have proved you wrong." value={note?.reasoning ?? ''} onChange={(e) => save({ reasoning: e.target.value })} />
              <div>
                <Input label="Setup" list="journal-setups" placeholder="e.g. Breakout" maxLength={40} value={note?.setup ?? ''} onChange={(e) => save({ setup: e.target.value || undefined })} />
                <datalist id="journal-setups">
                  {setups.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div role="group" aria-label="How you felt when you entered">
                <p className="mb-1 text-xs text-muted">How did you feel when you entered?</p>
                <div className="flex flex-wrap gap-1.5">
                  {EMOTIONS.map((e) => {
                    const on = note?.emotion === e.id;
                    return (
                      <Button key={e.id} size="sm" variant={on ? 'primary' : 'ghost'} className={cn(!on && 'border border-border')} aria-pressed={on} title={e.hint} onClick={() => save({ emotion: on ? undefined : e.id })}>
                        {e.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <Textarea
                label="Review"
                hint="Afterwards: what went well, and what would you do differently?"
                value={note?.review ?? ''}
                onChange={(e) => save({ review: e.target.value })}
              />
              <div role="group" aria-label="How well you followed your plan">
                <p className="mb-1 text-xs text-muted">How well did you follow your plan? (1 = not at all, 5 = exactly)</p>
                <div className="flex gap-1.5">
                  {([1, 2, 3, 4, 5] as const).map((n) => {
                    const on = note?.rating === n;
                    return (
                      <Button key={n} size="sm" variant={on ? 'primary' : 'ghost'} className={cn('num w-9', !on && 'border border-border')} aria-pressed={on} aria-label={`${n} out of 5`} onClick={() => save({ rating: on ? undefined : n })}>
                        {n}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
