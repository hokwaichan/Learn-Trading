import { Flame, Moon, Search, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IconButton, Pnl, Tooltip } from '@/components/ui';
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
      aria-label={`Paper account equity ${formatMoney(equity)}. Open journal.`}
      className="flex items-center gap-3 rounded-control px-2 py-1 hover:bg-raised"
    >
      <span className="flex flex-col items-end leading-tight">
        <span className="hidden text-[11px] text-muted sm:block">Paper equity</span>
        <span className="num text-sm font-medium text-fg">{formatMoney(equity)}</span>
      </span>
      <span className="hidden flex-col items-end leading-tight sm:flex">
        <span className="text-[11px] text-muted">Today</span>
        <Pnl value={todayPnl} className="text-sm" />
      </span>
    </Link>
  );
}

function Streak() {
  const streak = useStreak();
  const text = streak === 1 ? '1 day streak' : `${streak} day streak`;
  return (
    <Tooltip content={streak > 0 ? `${text}. Study again tomorrow to keep it.` : 'Finish a lesson or drill to start a streak.'}>
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

/** Slim bar on every page: search, paper account, streak, theme. */
export function TopBar() {
  const theme = useSettings((s) => s.theme);
  const toggleTheme = useSettings((s) => s.toggleTheme);
  const openPalette = useCommandPalette((s) => s.setOpen);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface px-3">
      <Link to="/" className="mr-1 md:hidden" aria-label="TradeSchool home">
        <img src="/favicon.svg" alt="" className="size-6" />
      </Link>
      <SymbolSearch className="hidden w-64 sm:block" />
      <button
        type="button"
        onClick={() => openPalette(true)}
        className="hidden h-8 items-center gap-2 rounded-control border border-border px-2 text-xs text-muted hover:text-fg lg:flex"
      >
        Search everything
        <kbd className="num rounded-sm border border-border px-1 text-[11px]">{IS_MAC ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
      <IconButton
        className="sm:hidden"
        label="Search"
        icon={<Search className="size-4" />}
        onClick={() => openPalette(true)}
      />
      <div className="flex-1" />
      <AccountSummary />
      <Streak />
      <IconButton
        label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        icon={theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        onClick={toggleTheme}
      />
    </header>
  );
}
