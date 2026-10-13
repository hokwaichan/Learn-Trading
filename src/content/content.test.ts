import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { runBacktest, validateStrategy, warmupBars } from '@/lib/backtest';
import { parseStaticFile } from '@/lib/data/static';
import { buildMatcher, linkGlossary } from '@/lib/glossaryLinker';
import { seededRandom } from '@/lib/random';
import { INDICATORS } from '@/lib/indicators';
import type { Candle, ChartExample, LessonBlock } from '@/types';
import { GLOSSARY, getGlossaryEntry } from './glossary';
import { allLessons, getLesson, lessonKey, MODULES, neighbours, nextLesson } from './lessons';
import { getQuiz, QUIZZES } from './quizzes';
import { BACKTEST_PRESETS } from './strategies';

const lessons = allLessons();
const WIDGETS = ['greek-slider', 'leverage-demo', 'payoff', 'order-book', 'position-size', 'candle-anatomy', 'expectancy-sim'];
const INDICATOR_IDS = INDICATORS.map((d) => d.id as string);
const bundled = new Map<string, Candle[]>();
const bundledCandles = (symbol: string) => {
  if (!bundled.has(symbol)) bundled.set(symbol, parseStaticFile(JSON.parse(readFileSync(`public/data/${symbol}.json`, 'utf8'))));
  return bundled.get(symbol)!;
};

function blockText(block: LessonBlock): string[] {
  switch (block.type) {
    case 'heading':
    case 'paragraph':
      return [block.text];
    case 'list':
      return block.items;
    case 'callout':
      return [block.title, block.text];
    case 'formula':
      return [block.expression, block.explanation];
    case 'worked-example':
      return [block.title, ...block.steps];
    case 'chart':
      return [block.example.caption, ...(block.example.annotations ?? []).map((a) => a.label)];
    case 'widget':
      return [];
  }
}

function checkChart(example: ChartExample, where: string) {
  expect(example.caption.length, `${where}: caption`).toBeGreaterThan(20);
  for (const ind of example.indicators ?? []) expect(INDICATOR_IDS, `${where}: indicator`).toContain(ind.id);

  let candles: Candle[];
  if ('candles' in example.source) {
    candles = example.source.candles;
    expect(candles.length, `${where}: candle count`).toBeGreaterThanOrEqual(6);
    candles.forEach((c, i) => {
      expect(c.high, `${where}: candle ${i} high`).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low, `${where}: candle ${i} low`).toBeLessThanOrEqual(Math.min(c.open, c.close));
      if (i > 0) expect(c.time, `${where}: candle ${i} time`).toBeGreaterThan(candles[i - 1].time);
    });
  } else {
    const { symbol, from, to } = example.source;
    candles = bundledCandles(symbol).filter((c) => c.time >= from && c.time <= to);
    // Real examples must come from the bundled files so lessons work offline.
    expect(candles.length, `${where}: ${symbol} candles in range`).toBeGreaterThan(60);
  }

  const first = candles[0].time;
  const last = candles[candles.length - 1].time;
  const low = Math.min(...candles.map((c) => c.low));
  const high = Math.max(...candles.map((c) => c.high));
  // Annotations may sit a little outside the candles (a stop below support);
  // the lesson chart widens its scale to include them.
  const pad = (high - low) * 0.4;
  for (const a of example.annotations ?? []) {
    for (const t of [a.time, a.toTime]) {
      if (t == null) continue;
      expect(t, `${where}: annotation "${a.label}" time`).toBeGreaterThanOrEqual(first);
      expect(t, `${where}: annotation "${a.label}" time`).toBeLessThanOrEqual(last);
    }
    for (const price of [a.price, a.toPrice]) {
      if (price == null) continue;
      expect(price, `${where}: annotation "${a.label}" price`).toBeGreaterThanOrEqual(low - pad);
      expect(price, `${where}: annotation "${a.label}" price`).toBeLessThanOrEqual(high + pad);
    }
  }
}

describe('curriculum', () => {
  it('has the eighteen modules in order', () => {
    expect(MODULES.map((m) => m.id)).toEqual([
      'basics', 'candlesticks', 'market-structure', 'chart-patterns', 'indicators', 'strategies',
      'risk-management', 'futures', 'options', 'psychology', 'fundamentals',
      'bigger-picture', 'smart-money', 'ict', 'day-trading', 'trade-management', 'markets-in-practice', 'staying-in-the-game',
    ]);
    expect(MODULES.map((m) => m.order)).toEqual(MODULES.map((_, i) => i + 1));
  });

  it('has unique lesson ids within each module and numbered order', () => {
    for (const m of MODULES) {
      expect(new Set(m.lessons.map((l) => l.id)).size, m.id).toBe(m.lessons.length);
      expect(m.lessons.map((l) => l.order)).toEqual(m.lessons.map((_, i) => i + 1));
      for (const l of m.lessons) expect(l.moduleId).toBe(m.id);
    }
  });

  it.each(lessons.map((l) => [lessonKey(l), l] as const))('%s is a complete lesson', (key, lesson) => {
    expect(lesson.title.length).toBeGreaterThan(3);
    expect(lesson.summary.length).toBeGreaterThan(20);
    expect(lesson.minutes).toBeGreaterThan(0);
    // A short explanation ...
    const words = lesson.blocks.flatMap(blockText).join(' ').split(/\s+/).length;
    expect(words, 'word count').toBeGreaterThan(180);
    expect(lesson.blocks[0].type, 'opens with a paragraph or heading').toMatch(/paragraph|heading/);
    // ... an interactive example ...
    const interactive = lesson.blocks.filter((b) => b.type === 'chart' || b.type === 'widget');
    expect(interactive.length, 'has a chart or widget').toBeGreaterThanOrEqual(1);
    for (const block of lesson.blocks) {
      if (block.type === 'widget') expect(WIDGETS).toContain(block.widget);
      if (block.type === 'chart') checkChart(block.example, key);
      for (const text of blockText(block)) {
        expect((text.match(/\*\*/g) ?? []).length % 2, `bold markers come in pairs: ${text.slice(0, 40)}`).toBe(0);
        expect(text.includes('—'), 'no em dashes').toBe(false);
      }
    }
    // ... and a 3 to 5 question quiz (some go to 6).
    const quiz = getQuiz(lesson.quizId);
    expect(quiz, 'has a quiz').toBeDefined();
    expect(quiz!.questions.length).toBeGreaterThanOrEqual(3);
    expect(quiz!.questions.length).toBeLessThanOrEqual(6);
  });

  it('walks the whole curriculum with previous and next', () => {
    expect(neighbours(lessons[0]).previous).toBeUndefined();
    expect(neighbours(lessons[lessons.length - 1]).next).toBeUndefined();
    expect(neighbours(lessons[0]).next).toBe(lessons[1]);
    // Crossing a module boundary.
    const lastOfBasics = MODULES[0].lessons[MODULES[0].lessons.length - 1];
    expect(neighbours(lastOfBasics).next).toBe(MODULES[1].lessons[0]);
  });

  it('suggests the first unfinished lesson', () => {
    expect(nextLesson(() => false)).toBe(lessons[0]);
    const done = new Set([lessonKey(lessons[0]), lessonKey(lessons[1])]);
    expect(nextLesson((k) => done.has(k))).toBe(lessons[2]);
    expect(nextLesson(() => true)).toBeUndefined();
  });
});

describe('quizzes', () => {
  it('has exactly one quiz per lesson', () => {
    expect(QUIZZES).toHaveLength(lessons.length);
    for (const quiz of QUIZZES) {
      const [moduleId, lessonId] = quiz.id.split('/');
      expect(getLesson(moduleId, lessonId), quiz.id).toBeDefined();
    }
  });

  it.each(QUIZZES.flatMap((quiz) => quiz.questions.map((question) => [question.id, question] as const)))(
    '%s is well formed',
    (_id, question) => {
      expect(question.prompt.length).toBeGreaterThan(10);
      expect(question.choices.length).toBeGreaterThanOrEqual(3);
      expect(question.choices.length).toBeLessThanOrEqual(4);
      expect(new Set(question.choices.map((c) => c.text)).size, 'choices are distinct').toBe(question.choices.length);
      expect(question.choices.map((c) => c.id)).toContain(question.correctChoiceId);
      expect(question.explanation.length, 'explains the answer').toBeGreaterThan(20);
    },
  );

  it('has no choice whose wording depends on its position', () => {
    // Choices are shown in a shuffled order (see lib/random.test.ts).
    for (const quiz of QUIZZES) {
      for (const question of quiz.questions) {
        for (const choice of question.choices) {
          expect(choice.text, question.id).not.toMatch(/\b(all|none|both) of the above\b|\bthe (first|second|third|last) (one|option|answer)\b|^[A-D] and [A-D]$/i);
        }
      }
    }
  });
});

describe('glossary', () => {
  it('has unique ids', () => {
    expect(new Set(GLOSSARY.map((g) => g.id)).size).toBe(GLOSSARY.length);
  });

  it('has no phrase claimed by two entries', () => {
    const owner = new Map<string, string>();
    for (const entry of GLOSSARY) {
      for (const phrase of [entry.term, ...entry.aliases]) {
        const key = phrase.toLowerCase();
        expect(owner.get(key) ?? entry.id, `"${phrase}" is in both ${owner.get(key)} and ${entry.id}`).toBe(entry.id);
        owner.set(key, entry.id);
      }
    }
  });

  it.each(GLOSSARY.map((g) => [g.id, g] as const))('%s is well formed', (_id, entry) => {
    expect(entry.definition.length).toBeGreaterThan(15);
    expect(entry.definition.endsWith('.')).toBe(true);
    for (const id of entry.seeAlso) expect(getGlossaryEntry(id), `see-also "${id}"`).toBeDefined();
    if (entry.lesson) expect(getLesson(entry.lesson.moduleId, entry.lesson.lessonId), 'lesson link').toBeDefined();
  });

  it('links terms in real lesson text', () => {
    const matcher = buildMatcher(GLOSSARY);
    const linked = (text: string) => linkGlossary(text, matcher).filter((s) => s.type === 'term').map((s) => (s as { id: string }).id);
    expect(linked('Always use a stop-loss when you use leverage.')).toEqual(['stop-loss', 'leverage']);
    expect(linked('Going long is the opposite of going short.')).toEqual(['long', 'short']);
    // Everyday uses of ambiguous words are left alone.
    expect(linked('A long lower wick took a long time.')).toEqual(['wick']);
    expect(linked('How to spot it in the future.')).toEqual([]);
    expect(linked('The standard deviation shows how spread out they are.')).toEqual(['standard-deviation']);
  });

  it('every lesson links at least one glossary term', () => {
    const matcher = buildMatcher(GLOSSARY);
    for (const lesson of lessons) {
      const seen = new Set<string>();
      for (const block of lesson.blocks) for (const text of blockText(block)) linkGlossary(text, matcher, seen);
      expect(seen.size, lessonKey(lesson)).toBeGreaterThan(0);
    }
  });
});

describe('backtester presets', () => {
  it('has a handful of presets with unique ids', () => {
    expect(BACKTEST_PRESETS.length).toBeGreaterThanOrEqual(4);
    expect(BACKTEST_PRESETS.length).toBeLessThanOrEqual(8);
    expect(new Set(BACKTEST_PRESETS.map((p) => p.id)).size).toBe(BACKTEST_PRESETS.length);
  });

  it.each(BACKTEST_PRESETS.map((p) => [p.name, p] as const))('%s is valid, explained, and trades on real history', (_name, preset) => {
    expect(validateStrategy(preset)).toEqual([]);
    expect(preset.preset).toBe(true);
    expect(preset.description.length).toBeGreaterThan(80);
    const ids = [...preset.entry.conditions, ...preset.exit.conditions].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);

    // A preset built on the opening range needs intraday candles. The bundled history is daily, so it
    // gets a made-up but realistic 15-minute series: about 60 days of a random walk with a daily rhythm.
    const intraday = [...preset.entry.conditions, ...preset.exit.conditions].some((c) => [c.left, c.right].some((o) => o.kind === 'indicator' && o.indicator === 'openingRange'));
    const daily = parseStaticFile(JSON.parse(readFileSync('public/data/SPY.json', 'utf8')));
    const rand = seededRandom(11);
    let last = 100;
    const quarterHours: Candle[] = Array.from({ length: 96 * 60 }, (_, i) => {
      const open = last;
      const close = open * (1 + (rand() - 0.495) * 0.004);
      last = close;
      return { time: i * 900, open, high: Math.max(open, close) * (1 + rand() * 0.001), low: Math.min(open, close) * (1 - rand() * 0.001), close, volume: 1000 };
    });
    const candles = intraday ? quarterHours : daily;
    const stepSeconds = intraday ? 900 : 86_400;
    const from = candles[warmupBars(preset)].time * 1000;
    const config = { symbol: 'SPY', timeframe: intraday ? ('15m' as const) : ('1d' as const), from, to: Number.MAX_SAFE_INTEGER, initialCapital: 10_000, feeRate: 0.001, slippagePct: 0.0005 };
    const { trades, equityCurve, stats } = runBacktest(preset, config, candles, { stepSeconds, periodsPerYear: 252 });
    expect(trades.length).toBeGreaterThan(3);
    expect(equityCurve.every((p) => Number.isFinite(p.equity) && p.equity > 0)).toBe(true);
    expect(Number.isFinite(stats.sharpe)).toBe(true);
    // Trades never overlap: one position at a time.
    for (let i = 1; i < trades.length; i++) expect(trades[i].entryTime).toBeGreaterThanOrEqual(trades[i - 1].exitTime);
    // The account at the end is the start plus every trade's result.
    const total = trades.reduce((sum, t) => sum + t.pnl, 0);
    expect(equityCurve[equityCurve.length - 1].equity).toBeCloseTo(10_000 + total, 4);
  });
});
