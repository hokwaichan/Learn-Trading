import { useCallback, useEffect, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import { ConfirmDialog, toast } from '@/components/ui';
import { announceTradeEvents, OrderTicket } from '@/features/paper-trading';
import { WorkspaceNotice, WorkspaceView } from '@/features/workspace';
import { t } from '@/i18n';
import { displaySymbol, findInstrument, instrumentsOfKind, TIMEFRAME_SECONDS } from '@/lib/data';
import { closeTimeMs, replayPrices, visibleCandles } from '@/lib/replay/session';
import { useAccount, useAccountSnapshot, useReplay } from '@/stores';
import { PlaybackBar } from './PlaybackBar';
import { ReplaySetup } from './ReplaySetup';

/** Something that ends the current session, held until the user confirms it. */
interface Pending {
  title: string;
  confirmLabel: string;
  run: () => void;
}

/** The chart workspace on past data, played forward a candle at a time with the future hidden. */
export function ReplayPage() {
  const replay = useReplay();
  const { session, status, candles, cursor, playing, speed, step, setPlaying } = replay;
  const account = useAccount((s) => s.accounts.replay);
  const [pending, setPending] = useState<Pending | null>(null);

  // After a reload, carry on the saved session.
  const resume = replay.resume;
  useEffect(() => {
    void resume();
  }, [resume]);

  const active = session != null && status !== 'idle';
  const instrument = findInstrument(session?.symbol ?? replay.symbol) ?? instrumentsOfKind('spot')[0];
  const timeframe = session?.timeframe ?? replay.timeframe;
  const stepSeconds = TIMEFRAME_SECONDS[timeframe];

  // Everything on this page reads candles through here, which is what hides the future.
  const visible = useMemo(() => (active ? visibleCandles(candles, cursor) : []), [active, candles, cursor]);
  const current = visible[visible.length - 1];
  const prices = useMemo(() => replayPrices(instrument, current), [instrument, current]);
  const now = current ? closeTimeMs(current, stepSeconds) : undefined;
  const view = useMemo(() => ({ accountId: 'replay' as const, prices, now }), [prices, now]);
  const snapshot = useAccountSnapshot('replay', prices);
  const finished = replay.atEnd && cursor >= candles.length - 1;

  const advance = useCallback((count: number) => announceTradeEvents(step(count)), [step]);

  // Playing reveals `speed` candles a second.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => advance(1), 1000 / speed);
    return () => clearInterval(timer);
  }, [playing, speed, advance]);

  // Stop playing when leaving the page.
  useEffect(() => () => useReplay.getState().setPlaying(false), []);

  // Space plays and pauses; N steps one candle.
  const ready = status === 'ready';
  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey || target?.closest('input, select, textarea, button, a, dialog')) return;
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying(!useReplay.getState().playing);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        advance(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, setPlaying, advance]);

  /** Runs an action that ends the session, asking first if that would close open trades. */
  const ending = (action: Pending) => {
    const open = account.positions.length + account.orders.filter((o) => o.status === 'open').length;
    if (active && open > 0) setPending(action);
    else action.run();
  };

  const jump = (date: string) => {
    if (replay.jumpTo(date)) return;
    ending({
      title: t('Start again from {date}?', { date }),
      confirmLabel: t('Start new session'),
      run: () => {
        replay.configure({ startDate: date });
        void replay.start();
      },
    });
  };

  const clock = current
    ? timeframe === '1d'
      ? new Date(now! - 1000).toISOString().slice(0, 10)
      : `${new Date(now!).toISOString().slice(0, 16).replace('T', ' ')} UTC`
    : '';

  return (
    <>
      <WorkspaceView
        mode="replay"
        instrument={instrument}
        symbols={instrumentsOfKind('spot')}
        onSymbol={(symbol) =>
          ending({
            title: t('Switch to {symbol}?', { symbol: displaySymbol(findInstrument(symbol) ?? instrument) }),
            confirmLabel: t('End session and switch'),
            run: () => {
              replay.end();
              replay.configure({ symbol });
            },
          })
        }
        timeframe={instrument.timeframes.includes(timeframe) ? timeframe : '1d'}
        onTimeframe={(tf) => {
          if (!active) replay.configure({ timeframe: tf });
          else toast.info(t('The candle size is fixed for a session'), t('End the session to start one with a different candle size.'));
        }}
        candles={visible}
        status={status === 'error' ? 'error' : status === 'ready' ? 'ready' : 'loading'}
        error={replay.error}
        onRetry={() => void (session ? replay.resume() : replay.start())}
        live={false}
        viewKey={`replay:${instrument.symbol}:${timeframe}:${replay.runId}`}
        placeholder={active && status !== 'error' ? undefined : <ReplaySetup />}
        order={
          ready && current ? (
            <OrderTicket instrument={instrument} accountId="replay" price={current.close} prices={prices} now={now} />
          ) : (
            <p className="p-4 text-sm text-muted">{t('Start a session to trade.')}</p>
          )
        }
        account={view}
        showWatchlist={false}
        notices={
          ready && (
            <WorkspaceNotice icon={<History aria-hidden className="size-3.5" />}>
              {t('Replaying past prices. Candles after the replay time are hidden. Trades here use the replay account, not your main paper account.')}
            </WorkspaceNotice>
          )
        }
        belowChart={
          ready && (
            <PlaybackBar
              playing={playing}
              atEnd={finished}
              speed={speed}
              clock={clock}
              date={replay.startDate}
              equity={snapshot.equity}
              totalPnl={snapshot.equity - account.startingBalance}
              onPlay={setPlaying}
              onStep={advance}
              onSpeed={(next) => replay.configure({ speed: next })}
              onJump={jump}
              onEnd={() => ending({ title: t('End this session?'), confirmLabel: t('End session'), run: replay.end })}
            />
          )
        }
      />

      <ConfirmDialog
        open={pending != null}
        onClose={() => setPending(null)}
        onConfirm={() => pending?.run()}
        title={pending?.title ?? ''}
        confirmLabel={pending?.confirmLabel ?? ''}
      >
        {account.positions.length === 1
          ? t('This ends the current session. Your open replay position will be closed at the current replay price and any waiting orders cancelled.')
          : t('This ends the current session. Your open replay positions will be closed at the current replay price and any waiting orders cancelled.')}
      </ConfirmDialog>
    </>
  );
}
