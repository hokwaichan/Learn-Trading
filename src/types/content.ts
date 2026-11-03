import type { IndicatorId } from './backtest';
import type { Candle, Timeframe } from './market';

export interface ChartAnnotation {
  time: number;
  price?: number;
  label: string;
  kind: 'marker' | 'line' | 'zone';
  toTime?: number;
  toPrice?: number;
}

export interface ChartExample {
  source:
    | { symbol: string; timeframe: Timeframe; from: number; to: number }
    /** A hand-made teaching example. */
    | { candles: Candle[] };
  indicators?: { id: IndicatorId; params: Record<string, number> }[];
  annotations?: ChartAnnotation[];
  caption: string;
}

/** A picture from Wikimedia Commons, saved in public/images/lessons/ (see scripts/fetch-lesson-images.mjs). */
export interface LessonImage {
  file: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl: string | null;
  /** The file's page on Wikimedia Commons. */
  source: string;
  /** Copies with the labels drawn into the picture translated, by locale (e.g. zh-Hant). */
  localized?: Record<string, { file: string; width: number; height: number }>;
}

export type LessonWidget =
  | 'greek-slider'
  | 'leverage-demo'
  | 'payoff'
  | 'order-book'
  | 'position-size'
  | 'candle-anatomy'
  | 'expectancy-sim';

export type LessonBlock =
  | { type: 'heading'; text: string }
  /** Glossary terms inside paragraph text are linked automatically. */
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'callout'; tone: 'info' | 'warning' | 'danger'; title: string; text: string }
  | { type: 'formula'; expression: string; explanation: string }
  | { type: 'worked-example'; title: string; steps: string[] }
  | { type: 'chart'; example: ChartExample }
  /** One picture, by its id in content/images.ts. `alt` says what it shows; `caption` is optional. */
  | { type: 'image'; image: string; alt: string; caption?: string }
  /** Several small labelled pictures side by side, such as a set of candle patterns. */
  | { type: 'gallery'; items: { image: string; label: string }[]; caption?: string }
  | { type: 'widget'; widget: LessonWidget; props?: Record<string, unknown> };

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  summary: string;
  minutes: number;
  blocks: LessonBlock[];
  quizId: string;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  /** Shown after answering, right or wrong. */
  explanation: string;
  chart?: ChartExample;
}

/** Three to five questions per lesson. */
export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface GlossaryEntry {
  id: string;
  term: string;
  /** Other spellings; these also drive auto-linking in lessons. */
  aliases: string[];
  /**
   * Set to false for everyday words ("long", "range") so that only the
   * aliases are linked automatically in lesson text, not the bare term.
   */
  autoLink?: boolean;
  /** One plain sentence, shown on hover. */
  definition: string;
  details?: string;
  /** The English term, kept when the app runs in another language. */
  english?: string;
  seeAlso: string[];
  lesson?: { moduleId: string; lessonId: string };
}

export interface PatternDefinition {
  id: string;
  name: string;
  family: 'candlestick' | 'chart';
  bias: 'bullish' | 'bearish' | 'neutral';
  description: string;
  howToRead: string;
  weaknesses: string;
  /** Candlestick patterns are found by a detector in lib/patterns. */
  detectorId?: string;
  /**
   * Chart patterns draw a constructed example. Each seed gives a different
   * variation; `from` and `to` are the candle positions the pattern spans.
   */
  build?: (seed: number) => { candles: Candle[]; from: number; to: number };
}

/** Plain-language description of an indicator, shown in Explain and in lessons. */
export interface IndicatorInfo {
  id: IndicatorId;
  /** One line for the Indicators dialog. */
  summary: string;
  measures: string;
  calculation: string;
  signals: string[];
  weaknesses: string[];
  /** Glossary ids to link under the explanation. */
  related: string[];
}
