import { useCallback } from 'react';
import { Info, SearchX, WifiOff } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, EmptyState, Trans } from '@/components/ui';
import { OrderTicket } from '@/features/paper-trading';
import { t } from '@/i18n';
import { displaySymbol, findInstrument, instrumentsOfKind } from '@/lib/data';
import { useCandleSeries, useMarket } from '@/stores';
import type { Instrument } from '@/types';
import { WorkspaceNotice, WorkspaceView } from './WorkspaceView';

type LiveMode = 'spot' | 'futures';

const MAIN_ACCOUNT = { accountId: 'main' } as const;

function UnknownSymbol({ symbol, mode }: { symbol: string; mode: LiveMode }) {
  const kind = mode === 'futures' ? 'perpetual' : 'spot';
  const base = mode === 'futures' ? '/futures' : '/charts';
  return (
    <EmptyState
      className="h-full"
      icon={<SearchX />}
      title={mode === 'futures' ? t('No futures contract for "{symbol}"', { symbol }) : t('No chart for "{symbol}"', { symbol })}
      description={t('Pick one of the available symbols:')}
      action={
        <div className="flex max-w-md flex-wrap justify-center gap-2">
          {instrumentsOfKind(kind).map((i) => (
            <Link key={i.symbol} to={`${base}/${i.symbol}`} className="num text-sm text-accent-text underline underline-offset-4">
              {displaySymbol(i)}
            </Link>
          ))}
        </div>
      }
    />
  );
}

/** The workspace on live market data, trading the main paper account. */
function LiveWorkspace({ instrument, mode }: { instrument: Instrument; mode: LiveMode }) {
  const navigate = useNavigate();
  const savedTimeframe = useMarket((s) => s.layouts[mode].timeframe);
  const setLayout = useMarket((s) => s.setLayout);
  const load = useMarket((s) => s.load);
  const loadOlder = useMarket((s) => s.loadOlder);

  // Bundled symbols only have daily data, whatever the saved timeframe is.
  const timeframe = instrument.timeframes.includes(savedTimeframe) ? savedTimeframe : '1d';
  const series = useCandleSeries(instrument, timeframe);
  const { candles } = series;
  const lastDay = candles.length ? new Date(candles[candles.length - 1].time * 1000).toISOString().slice(0, 10) : '';
  const needOlder = useCallback(() => void loadOlder(instrument, timeframe), [loadOlder, instrument, timeframe]);
  const base = mode === 'futures' ? '/futures' : '/charts';

  return (
    <WorkspaceView
      mode={mode}
      instrument={instrument}
      symbols={instrumentsOfKind(instrument.kind)}
      onSymbol={(symbol) => navigate(`${base}/${symbol}`)}
      timeframe={timeframe}
      onTimeframe={(tf) => setLayout(mode, { timeframe: tf })}
      candles={candles}
      status={series.status}
      error={series.error}
      onRetry={() => void load(instrument, timeframe)}
      onNeedOlder={needOlder}
      loadingOlder={series.loadingOlder}
      live={instrument.live}
      viewKey={`${instrument.kind}:${instrument.symbol}:${timeframe}`}
      order={<OrderTicket instrument={instrument} />}
      account={MAIN_ACCOUNT}
      notices={
        <>
          {series.fallback && (
            <WorkspaceNotice icon={<Info aria-hidden className="size-3.5" />}>
              {t('Futures data is not available from your region, so this shows the spot price, which stays very close. Funding is a fixed 0.01% every 8 hours.')}
            </WorkspaceNotice>
          )}
          {series.stale && (
            <WorkspaceNotice
              icon={<WifiOff aria-hidden className="size-3.5" />}
              action={
                <Button size="sm" variant="ghost" onClick={() => void load(instrument, timeframe)}>
                  {t('Retry')}
                </Button>
              }
            >
              {t('Showing saved prices.')} {series.error}
            </WorkspaceNotice>
          )}
          {!instrument.live && series.status === 'ready' && (
            <WorkspaceNotice icon={<Info aria-hidden className="size-3.5" />}>
              <Trans
                text="Bundled daily history up to {day}, with no live price. You can practise trading this symbol in {replay}."
                values={{
                  day: <span className="num">{lastDay}</span>,
                  replay: (
                    <Link to="/replay" className="text-accent-text underline underline-offset-2">
                      {t('Replay')}
                    </Link>
                  ),
                }}
              />
            </WorkspaceNotice>
          )}
        </>
      }
    />
  );
}

export function WorkspacePage({ mode }: { mode: LiveMode }) {
  const { symbol = '' } = useParams();
  const instrument = findInstrument(symbol, mode === 'futures' ? 'perpetual' : 'spot');
  if (!instrument) return <UnknownSymbol symbol={symbol} mode={mode} />;
  // The key gives each symbol and mode a fresh workspace state.
  return <LiveWorkspace key={`${mode}:${instrument.symbol}`} instrument={instrument} mode={mode} />;
}
