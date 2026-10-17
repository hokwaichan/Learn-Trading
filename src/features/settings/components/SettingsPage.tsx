import { useState } from 'react';
import { Moon, RotateCcw, Sun } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  Input,
  Page,
  PageHeader,
  Pnl,
  Switch,
  Tabs,
  toast,
  Trans,
} from '@/components/ui';
import { LOCALES, t, type Locale } from '@/i18n';
import { formatMoney } from '@/lib/format';
import { DEFAULT_SETTINGS, useAccount, useSettings } from '@/stores';
import type { Theme } from '@/types';
import { DataCard } from './DataCard';

/** A percentage text field bound to a fraction in settings (0.001 <-> "0.1"). */
function PercentField({
  label,
  hint,
  value,
  max,
  onCommit,
}: {
  label: string;
  hint: string;
  value: number;
  max: number;
  onCommit: (fraction: number) => void;
}) {
  const shown = String(Number((value * 100).toFixed(4)));
  const [text, setText] = useState(shown);
  const [prev, setPrev] = useState(shown);
  if (shown !== prev) {
    setPrev(shown);
    setText(shown);
  }
  const n = Number(text);
  const invalid = text.trim() === '' || !Number.isFinite(n) || n < 0 || n > max;
  return (
    <Input
      label={label}
      hint={hint}
      error={invalid ? t('Enter a number from 0 to {max}.', { max }) : undefined}
      numeric
      suffix="%"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => (invalid ? setText(shown) : onCommit(n / 100))}
    />
  );
}

export function SettingsPage() {
  const settings = useSettings();
  const account = useAccount((s) => s.accounts.main);
  const resetAccount = useAccount((s) => s.reset);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Page className="max-w-3xl">
      <PageHeader title={t('Settings')} description={t('Language, appearance, simulated trading costs, and your paper account.')} />

      <Card title={t('Appearance')}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {/* Bilingual on purpose: someone who cannot read the current language must still find it. */}
              <p className="text-sm text-fg">{t('Language')} · Language · 語言</p>
              <p className="mt-0.5 text-xs text-muted">{t('Lessons, quizzes and the glossary change language too. The page reloads to switch.')}</p>
            </div>
            <Tabs<Locale>
              variant="pill"
              label={t('Language')}
              idBase="locale"
              choice
              className="rounded-control border border-border p-0.5"
              value={settings.locale}
              onChange={(locale) => locale !== settings.locale && settings.setLocale(locale)}
              items={LOCALES.map((l) => ({ id: l.id, label: l.name }))}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-fg">{t('Theme')}</p>
              <p className="mt-0.5 text-xs text-muted">{t('Charts follow the theme too.')}</p>
            </div>
            <Tabs<Theme>
              variant="pill"
              label={t('Theme')}
              idBase="theme"
            choice
              className="rounded-control border border-border p-0.5"
              value={settings.theme}
              onChange={(theme) => settings.update({ theme })}
              items={[
                { id: 'dark', label: t('Dark'), icon: <Moon aria-hidden className="size-3.5" /> },
                { id: 'light', label: t('Light'), icon: <Sun aria-hidden className="size-3.5" /> },
              ]}
            />
          </div>
          <Switch
            label={t('Colour-blind mode')}
            description={t('Shows rising prices and profits in blue, and falling prices and losses in orange, instead of green and red.')}
            checked={settings.colorBlind}
            onChange={(colorBlind) => settings.update({ colorBlind })}
          />
          <div className="flex flex-wrap items-center gap-3 rounded-control border border-border bg-bg px-3 py-2 text-sm">
            <span className="text-xs text-muted">{t('Preview')}</span>
            <Pnl value={124.5} />
            <Pnl value={-87.25} />
            <Badge tone="up">{t('Long')}</Badge>
            <Badge tone="down">{t('Short')}</Badge>
            <div className="ml-auto flex gap-2">
              <Button variant="buy" size="sm" tabIndex={-1} aria-hidden>
                {t('Buy')}
              </Button>
              <Button variant="sell" size="sm" tabIndex={-1} aria-hidden>
                {t('Sell')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title={t('Simulated trading costs')}
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              settings.update({ feeRate: DEFAULT_SETTINGS.feeRate, slippagePct: DEFAULT_SETTINGS.slippagePct })
            }
          >
            {t('Restore defaults')}
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PercentField
            label={t('Fee per trade')}
            hint={t('Charged on the value of every fill. Real exchanges charge about 0.1%.')}
            value={settings.feeRate}
            max={5}
            onCommit={(feeRate) => settings.update({ feeRate })}
          />
          <PercentField
            label={t('Slippage')}
            hint={t('How much worse than the quoted price a market or stop order fills.')}
            value={settings.slippagePct}
            max={5}
            onCommit={(slippagePct) => settings.update({ slippagePct })}
          />
        </div>
      </Card>

      <Card title={t('Paper account')}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">{t('Balance')}</p>
            <p className="num mt-0.5 text-lg font-medium text-fg">{formatMoney(account.cash)}</p>
            <p className="mt-0.5 text-xs text-muted">
              {account.resetCount === 1 ? t('Simulated money. Reset 1 time.') : t('Simulated money. Reset {n} times.', { n: account.resetCount })}
            </p>
          </div>
          <Button variant="danger" icon={<RotateCcw aria-hidden className="size-4" />} onClick={() => setConfirmReset(true)}>
            {t('Reset account')}
          </Button>
        </div>
      </Card>

      <DataCard />

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAccount('main');
          toast.success(t('Paper account reset'), t('Balance is back to {amount}.', { amount: formatMoney(account.startingBalance) }));
        }}
        title={t('Reset paper account?')}
        confirmLabel={t('Reset account')}
      >
        <p>
          <Trans
            text="This closes every open position, cancels every order, and sets your balance back to {amount}."
            values={{ amount: <span className="num">{formatMoney(account.startingBalance)}</span> }}
          />
        </p>
        <p className="mt-2 text-muted">{t('Your lessons, journal notes and settings are kept. This cannot be undone.')}</p>
      </ConfirmDialog>
    </Page>
  );
}
