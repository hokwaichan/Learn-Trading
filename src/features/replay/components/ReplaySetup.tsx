import { useState } from 'react';
import { Dices, Play, RotateCcw } from 'lucide-react';
import { Button, Card, ConfirmDialog, ErrorState, Input, LoadingState, Pnl, Select, toast, Trans } from '@/components/ui';
import { t } from '@/i18n';
import { displaySymbol, findInstrument, instrumentsOfKind, TIMEFRAME_NAMES } from '@/lib/data';
import { formatMoney } from '@/lib/format';
import { useAccount, useReplay } from '@/stores';
import type { Timeframe } from '@/types';

const today = () => new Date().toISOString().slice(0, 10);
const DAY_MS = 86_400_000;

/** A random date in the last three years, leaving at least a month of history after it to play through. */
function randomDate(): string {
  const latest = Date.now() - 30 * DAY_MS;
  const earliest = Date.now() - 3 * 365 * DAY_MS;
  return new Date(earliest + Math.random() * (latest - earliest)).toISOString().slice(0, 10);
}

/** The form shown before a session starts: symbol, timeframe and start date. */
export function ReplaySetup() {
  const { symbol, timeframe, startDate, status, error, configure, start } = useReplay();
  const account = useAccount((s) => s.accounts.replay);
  const reset = useAccount((s) => s.reset);
  const [confirmReset, setConfirmReset] = useState(false);

  const instrument = findInstrument(symbol) ?? instrumentsOfKind('spot')[0];
  const timeframes = instrument.timeframes;
  const chosen = timeframes.includes(timeframe) ? timeframe : timeframes[timeframes.length - 1];
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(startDate) && startDate < today();

  if (status === 'loading') return <LoadingState className="h-full" label={t('Loading {symbol} history', { symbol: displaySymbol(instrument) })} />;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-4 md:p-6">
        <div>
          <h1 className="text-xl font-semibold text-fg">{t('Replay')}</h1>
          <p className="mt-1 text-sm text-muted">
            {t('Pick a market and a date in the past. The chart stops there, with everything after it hidden. Then play it forward one candle at a time and trade it as if it were live.')}
          </p>
        </div>

        {status === 'error' && <ErrorState className="rounded-card border border-border py-6" title={t('Could not start the replay')} message={error} onRetry={() => void start()} />}

        <Card title={t('Start a session')}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validDate) return;
              configure({ symbol: instrument.symbol, timeframe: chosen });
              void start();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label={t('Symbol')}
                value={instrument.symbol}
                onChange={(next) => configure({ symbol: next })}
                options={instrumentsOfKind('spot').map((i) => ({ value: i.symbol, label: `${displaySymbol(i)} · ${i.name}` }))}
              />
              <Select<Timeframe>
                label={t('Candle size')}
                hint={timeframes.length === 1 ? t('{symbol} has daily history only.', { symbol: displaySymbol(instrument) }) : undefined}
                value={chosen}
                onChange={(next) => configure({ timeframe: next })}
                options={timeframes.map((tf) => ({ value: tf, label: TIMEFRAME_NAMES[tf] }))}
              />
            </div>
            <div className="flex items-end gap-2">
              <Input
                label={t('Start date')}
                type="date"
                className="num"
                wrapperClassName="flex-1"
                max={today()}
                value={startDate}
                onChange={(e) => configure({ startDate: e.target.value })}
                error={validDate ? undefined : t('Choose a date before today.')}
              />
              <Button icon={<Dices aria-hidden className="size-4" />} onClick={() => configure({ startDate: randomDate() })}>
                {t('Random date')}
              </Button>
            </div>
            <p className="text-xs text-muted">
              {t('A random date is the fairest practice: you cannot remember what the market did next. Shorter candles replay more detail; daily candles cover months in a minute.')}
            </p>
            <Button type="submit" variant="primary" size="lg" disabled={!validDate} icon={<Play aria-hidden className="size-4" />}>
              {t('Start replay')}
            </Button>
          </form>
        </Card>

        <Card title={t('Replay account')}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="num text-lg font-medium text-fg">
                {formatMoney(account.cash)} <Pnl value={account.cash - account.startingBalance} className="text-sm" />
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t('Separate from your main paper account, so trades made at old prices never mix into it.')}{' '}
                {account.trades.length === 1 ? t('1 trade so far.') : t('{n} trades so far.', { n: account.trades.length })}
              </p>
            </div>
            <Button variant="danger" icon={<RotateCcw aria-hidden className="size-4" />} onClick={() => setConfirmReset(true)}>
              {t('Reset replay account')}
            </Button>
          </div>
        </Card>

        <ConfirmDialog
          open={confirmReset}
          onClose={() => setConfirmReset(false)}
          onConfirm={() => {
            reset('replay');
            toast.success(t('Replay account reset'), t('Balance is back to {amount}.', { amount: formatMoney(account.startingBalance) }));
          }}
          title={t('Reset replay account?')}
          confirmLabel={t('Reset replay account')}
        >
          <Trans
            text="This sets the replay balance back to {amount} and clears its trade history. Your main paper account is not affected. This cannot be undone."
            values={{ amount: <span className="num">{formatMoney(account.startingBalance)}</span> }}
          />
        </ConfirmDialog>
      </div>
    </div>
  );
}
