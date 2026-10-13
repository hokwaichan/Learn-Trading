import type { IndicatorId } from './backtest';
import type { ReviewCard } from './journal';
import type { Timeframe } from './market';

export type Theme = 'dark' | 'light';

export interface Settings {
  theme: Theme;
  colorBlind: boolean;
  /** Taker fee as a fraction, e.g. 0.001 = 0.1%. */
  feeRate: number;
  /** Slippage as a fraction of price on market and stop fills. */
  slippagePct: number;
  /** Annual risk-free rate used by the options model. */
  riskFreeRate: number;
  sidebarCollapsed: boolean;
}

export interface IndicatorConfig {
  /** Unique per chart, so two SMAs can coexist. */
  key: string;
  id: IndicatorId;
  params: Record<string, number>;
  visible: boolean;
}

export type DrawingTool = 'trendline' | 'hline' | 'rect' | 'fib' | 'text';

export interface DrawingPoint {
  time: number;
  price: number;
}

export interface Drawing {
  id: string;
  symbol: string;
  tool: DrawingTool;
  /** One point for hline and text, two for the rest. */
  points: DrawingPoint[];
  text?: string;
  createdAt: number;
}

export type ChartType = 'candles' | 'heikin-ashi' | 'line' | 'area';

export interface ChartLayout {
  timeframe: Timeframe;
  chartType: ChartType;
  indicators: IndicatorConfig[];
}

export interface LessonProgress {
  completedAt?: number;
  /** Best quiz score as a fraction 0-1. */
  bestScore?: number;
  attempts: number;
}

export interface ProgressState {
  /** Keyed by `${moduleId}/${lessonId}`. */
  lessons: Record<string, LessonProgress>;
  lastLesson?: { moduleId: string; lessonId: string };
  /** Local dates (YYYY-MM-DD) on which something was studied. */
  activeDays: string[];
  /** Local dates on which the daily challenge was finished. */
  challengeDays: string[];
  /** Trainer history, one spaced-repetition card per pattern or drill item, keyed by card id. */
  cards: Record<string, ReviewCard>;
}
