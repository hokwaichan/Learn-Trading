import { Flame, Moon, Search, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IconButton, Pnl, Tooltip } from '@/components/ui';
import { t } from '@/i18n';
import { formatMoney } from '@/lib/format';
import { useAccountSnapshot, useSettings, useStreak } from '@/stores';
import { useCommandPalette } from './commandPaletteStore';
import { SymbolSearch } from './SymbolSearch';

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

function AccountSummary() {
  const { equity, todayPnl } = useAccountSnapshot('main');
  return (
    <Link
      to="/journal"
      aria-label={t('Paper account equity {equity}. Open journal.', { equity: formatMoney(equity) })}
      className="flex items-center gap-3 rounded-control px-2 py-1 hover:bg-raised"
    >
      <span className="flex flex-col items-end leading-tight">
        <span className="hidden text-[11px] text-muted sm:block">{t('Paper equity')}</span>
        <span className="num text-sm font-medium text-fg">{formatMoney(equity)}</span>
      </span>
      <span className="hidden flex-col items-end leading-tight sm:flex">
        <span className="text-[11px] text-muted">{t('Today')}</span>
        <Pnl value={todayPnl} className="text-sm" />
      </span>
    </Link>
  );
}

function Streak() {
  const streak = useStreak();
  const text = streak === 1 ? t('1 day streak') : t('{n} day streak', { n: streak });
  return (
    <Tooltip content={streak > 0 ? t('{streak}. Study again tomorrow to keep it.', { streak: text }) : t('Finish a lesson or drill to start a streak.')}>
      <span
        tabIndex={0}
        role="img"
        aria-label={text}
        className="flex h-8 items-center gap-1 rounded-control px-2 text-sm text-muted"
      >
        <Flame aria-hidden className={streak > 0 ? 'size-4 text-warning-text' : 'size-4'} />
        <span className="num">{streak}</span>
      </span>
    </Tooltip>
  );
}

/**
 * Switches between English and Traditional Chinese. Shows the language it
 * switches to, written in that language, so a reader who cannot read the
 * current one can still find it.
 */
function LanguageButton() {
  const locale = useSettings((s) => s.locale);
  const setLocale = useSettings((s) => s.setLocale);
  const toChinese = locale === 'en';
  return (
    <IconButton
      label={toChinese ? '繁體中文 (Traditional Chinese)' : 'English (英文)'}
      icon={
        <span lang={toChinese ? 'zh-Hant' : 'en'} className="text-[13px] leading-none font-semibold">
          {toChinese ? '中' : 'EN'}
        </span>
      }
      onClick={() => setLocale(toChinese ? 'zh-Hant' : 'en')}
    />
  );
}

/** Slim bar on every page: search, paper account, streak, language, theme. */
export function TopBar() {
  const theme = useSettings((s) => s.theme);
  const toggleTheme = useSettings((s) => s.toggleTheme);
  const openPalette = useCommandPalette((s) => s.setOpen);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface px-3">
      <Link to="/" className="mr-1 md:hidden" aria-label={t('TradeSchool home')}>
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-6" />
      </Link>
      <SymbolSearch className="hidden w-64 sm:block" />
      <button
        type="button"
        onClick={() => openPalette(true)}
        className="hidden h-8 items-center gap-2 rounded-control border border-border px-2 text-xs text-muted hover:text-fg lg:flex"
      >
        {t('Search everything')}
        <kbd className="num rounded-sm border border-border px-1 text-[11px]">{IS_MAC ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
      <IconButton
        className="sm:hidden"
        label={t('Search')}
        icon={<Search className="size-4" />}
        onClick={() => openPalette(true)}
      />
      <div className="flex-1" />
      <AccountSummary />
      <Streak />
      <LanguageButton />
      <IconButton
        label={theme === 'dark' ? t('Switch to light theme') : t('Switch to dark theme')}
        icon={theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        onClick={toggleTheme}
      />
    </header>
  );
}
