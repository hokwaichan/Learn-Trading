import type { AccountId, Candle, Timeframe, UnixMs } from './market';

export type EmotionTag = 'calm' | 'confident' | 'fomo' | 'fearful' | 'revenge' | 'bored' | 'greedy';

/** Stored as data and re-rendered, so it follows the theme and stays interactive. */
export interface ChartSnapshot {
  symbol: string;
  timeframe: Timeframe;
  candles: Candle[];
  markers: {
    time: number;
    price: number;
    kind: 'entry' | 'exit' | 'stop' | 'target' | 'liquidation';
  }[];
}

export interface JournalEvent {
  time: UnixMs;
  type: 'funding' | 'liquidation' | 'expiry' | 'assignment';
  amount: number;
  note: string;
}

export interface JournalEntry {
  id: string;
  tradeId: string;
  accountId: AccountId;
  snapshot: ChartSnapshot;
  events: JournalEvent[];
  reasoning: string;
  emotion?: EmotionTag;
  setup?: string;
  review: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  createdAt: UnixMs;
  updatedAt: UnixMs;
}

/** One spaced-repetition card, scheduled with SM-2. */
export interface ReviewCard {
  id: string;
  kind: 'pattern' | 'what-next' | 'option-payoff' | 'option-outlook' | 'concept';
  refId: string;
  ease: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  dueAt: UnixMs;
  lastReviewedAt?: UnixMs;
  attempts: number;
  correct: number;
}
