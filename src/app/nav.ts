import {
  BookA,
  Calculator,
  ChartCandlestick,
  ChartColumn,
  FlaskConical,
  GitFork,
  GraduationCap,
  History,
  House,
  Layers,
  NotebookPen,
  Settings,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { msg } from '@/i18n';
import { DEFAULT_PERP_SYMBOL, DEFAULT_SPOT_SYMBOL } from '@/lib/data/instruments';

export interface NavItem {
  id: string;
  /** English; translated with t() where it is shown. */
  label: string;
  /** Where the link goes. */
  to: string;
  /** Path prefix that marks the item active (defaults to `to`). */
  match?: string;
  icon: LucideIcon;
  /** Extra English words the command palette matches on, in any language. */
  keywords?: string;
}

export interface NavGroup {
  id: string;
  /** Omitted for the single-item Home group. */
  label?: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    id: 'home',
    items: [{ id: 'home', label: msg('Home'), to: '/', icon: House, keywords: 'dashboard' }],
  },
  {
    id: 'learn',
    label: msg('Learn'),
    items: [
      { id: 'lessons', label: msg('Lessons'), to: '/learn', icon: GraduationCap, keywords: 'curriculum course modules' },
      { id: 'trainer', label: msg('Trainer'), to: '/trainer', icon: Target, keywords: 'pattern drills quiz practice' },
      { id: 'glossary', label: msg('Glossary'), to: '/glossary', icon: BookA, keywords: 'terms definitions jargon' },
    ],
  },
  {
    id: 'practice',
    label: msg('Practice'),
    items: [
      {
        id: 'charts',
        label: msg('Charts'),
        to: `/charts/${DEFAULT_SPOT_SYMBOL}`,
        match: '/charts',
        icon: ChartCandlestick,
        keywords: 'spot paper trading workspace',
      },
      {
        id: 'futures',
        label: msg('Futures'),
        to: `/futures/${DEFAULT_PERP_SYMBOL}`,
        match: '/futures',
        icon: Layers,
        keywords: 'perpetual leverage margin',
      },
      {
        id: 'options',
        label: msg('Options'),
        to: `/options/${DEFAULT_SPOT_SYMBOL}`,
        match: '/options',
        icon: GitFork,
        keywords: 'chain strategy builder payoff calls puts',
      },
      { id: 'replay', label: msg('Replay'), to: '/replay', icon: History, keywords: 'history playback' },
    ],
  },
  {
    id: 'analyze',
    label: msg('Analyze'),
    items: [
      { id: 'backtest', label: msg('Backtester'), to: '/backtest', icon: FlaskConical, keywords: 'strategy rules test' },
      { id: 'journal', label: msg('Journal'), to: '/journal', icon: NotebookPen, keywords: 'trades notes log' },
      { id: 'analytics', label: msg('Analytics'), to: '/analytics', icon: ChartColumn, keywords: 'performance stats' },
    ],
  },
  {
    id: 'tools',
    label: msg('Tools'),
    items: [
      { id: 'tools', label: msg('Calculators'), to: '/tools', icon: Calculator, keywords: 'position size risk reward' },
      {
        id: 'settings',
        label: msg('Settings'),
        to: '/settings',
        icon: Settings,
        keywords: 'theme colour blind fees reset export import',
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV.flatMap((g) => g.items);

/** The four destinations pinned to the phone tab bar; the rest live under More. */
export const TAB_BAR_IDS = ['home', 'lessons', 'charts', 'journal'];

export function isActive(item: NavItem, pathname: string): boolean {
  const prefix = item.match ?? item.to;
  if (prefix === '/') return pathname === '/';
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
