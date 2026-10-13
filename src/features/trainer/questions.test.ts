import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CANDLESTICK_PATTERNS, CHART_PATTERNS, PATTERNS } from '@/content/patterns';
import { OPTION_STRATEGIES, OUTLOOK_SCENARIOS, getStrategyTemplate } from '@/content/strategies';
import { getLesson } from '@/content/lessons';
import { parseStaticFile } from '@/lib/data/static';
import { CANDLE_PATTERN_IDS, patternsAt, type CandlePatternId } from '@/lib/patterns/detectors';
import { breakEvens, payoffExtremes, strategyPnlAtExpiry } from '@/lib/pricing/payoff';
import { buildLegs, roundStrike, strikeStepFor } from '@/lib/pricing/templates';
import { seededRandom } from '@/lib/random';
import { newCard } from '@/lib/srs/sm2';
import type { ReviewCard } from '@/types';
import {
  availableKinds,
  buildQuestion,
  candlestickQuestion,
  chartQuestion,
  indexPatterns,
  NEXT_HORIZON,
  nextQuestion,
  outlookQuestion,
  PAYOFF_STRATEGIES,
  payoffQuestion,
  type Dataset,
  type TrainerQuestion,
} from './questions';

const datasets: Dataset[] = ['AAPL', 'TSLA', 'SPY', 'EURUSD'].map((symbol) => ({
  symbol,
  title: symbol,
  tickSize: 0.01,
  candles: parseStaticFile(JSON.parse(readFileSync(`public/data/${symbol}.json`, 'utf8'))),
}));
const index = indexPatterns(datasets);
const NOW = 1_700_000_000_000;

function wellFormed(q: TrainerQuestion, choices = 4) {
  expect(q.prompt.length).toBeGreaterThan(10);
  expect(q.choices).toHaveLength(choices);
  expect(new Set(q.choices.map((c) => c.id)).size).toBe(choices);
  expect(new Set(q.choices.map((c) => c.label)).size).toBe(choices);
  expect(q.choices.map((c) => c.id)).toContain(q.correctId);
  expect(q.explanation.paragraphs.length).toBeGreaterThan(0);
  if (q.explanation.lesson) {
    const [moduleId, lessonId] = q.explanation.lesson.split('/');
    expect(getLesson(moduleId, lessonId), q.explanation.lesson).toBeDefined();
  }
}

describe('pattern content', () => {
  it('defines every pattern the detectors can find', () => {
    expect(CANDLESTICK_PATTERNS.map((p) => p.detectorId).sort()).toEqual([...CANDLE_PATTERN_IDS].sort());
  });

  it('has unique ids and complete text', () => {
    expect(new Set(PATTERNS.map((p) => p.id)).size).toBe(PATTERNS.length);
    for (const p of PATTERNS) {
      for (const text of [p.description, p.howToRead, p.weaknesses]) expect(text.length, p.id).toBeGreaterThan(30);
      expect(Boolean(p.detectorId) !== Boolean(p.build), `${p.id} has a detector or a builder, not both`).toBe(true);
    }
  });

  it.each(CHART_PATTERNS.map((p) => p.id))('%s builds valid, varied examples', (id) => {
    const pattern = CHART_PATTERNS.find((p) => p.id === id)!;
    const a = pattern.build!(1);
    const b = pattern.build!(2);
    expect(a.candles.length).toBeGreaterThan(25);
    expect(a.from).toBeGreaterThan(0);
    expect(a.to).toBe(a.candles.length - 1);
    for (const c of a.candles) {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      expect(c.low).toBeGreaterThan(0);
    }
    expect(a.candles.map((c) => c.close)).not.toEqual(b.candles.map((c) => c.close));
    expect(pattern.build!(1).candles).toEqual(a.candles);
  });

  it('draws mirrored patterns upside down', () => {
    const top = CHART_PATTERNS.find((p) => p.id === 'double-top')!.build!(5).candles;
    const bottom = CHART_PATTERNS.find((p) => p.id === 'double-bottom')!.build!(5).candles;
    const highAt = (c: typeof top) => c.reduce((best, k, i) => (k.high > c[best].high ? i : best), 0);
    const lowAt = (c: typeof top) => c.reduce((best, k, i) => (k.low < c[best].low ? i : best), 0);
    // The double top peaks in the middle of the chart; the double bottom troughs there.
    expect(highAt(top)).toBeGreaterThan(5);
    expect(lowAt(bottom)).toBeGreaterThan(5);
    expect(top[top.length - 1].close).toBeLessThan(top[highAt(top)].high);
    expect(bottom[bottom.length - 1].close).toBeGreaterThan(bottom[lowAt(bottom)].low);
  });
});

describe('strategy templates', () => {
  const pricing = { spot: 100, days: 30, volatility: 0.3, rate: 0.04, strikeStep: 5 };

  it('picks sensible strike spacing', () => {
    expect(strikeStepFor(100)).toBe(1);
    expect(strikeStepFor(67_000)).toBe(1000);
    expect(strikeStepFor(3.2)).toBe(0.05);
    expect(roundStrike(104.9, 5)).toBe(105);
  });

  it('prices every leg and places strikes relative to the price', () => {
    const condor = buildLegs(getStrategyTemplate('iron-condor')!.legs, pricing);
    expect(condor.map((l) => l.strike)).toEqual([90, 95, 105, 110]);
    for (const leg of condor) expect(leg.entryPrice).toBeGreaterThan(0);
    // Options nearer the money cost more.
    expect(condor[1].entryPrice).toBeGreaterThan(condor[0].entryPrice);
  });

  const expected: Record<string, { profit: 'limited' | 'unlimited'; loss: 'limited' | 'unlimited'; evens: number }> = {
    'long-call': { profit: 'unlimited', loss: 'limited', evens: 1 },
    'long-put': { profit: 'limited', loss: 'limited', evens: 1 },
    'short-call': { profit: 'limited', loss: 'unlimited', evens: 1 },
    'covered-call': { profit: 'limited', loss: 'limited', evens: 1 },
    'cash-secured-put': { profit: 'limited', loss: 'limited', evens: 1 },
    'protective-put': { profit: 'unlimited', loss: 'limited', evens: 1 },
    'bull-call-spread': { profit: 'limited', loss: 'limited', evens: 1 },
    'bear-put-spread': { profit: 'limited', loss: 'limited', evens: 1 },
    'bull-put-spread': { profit: 'limited', loss: 'limited', evens: 1 },
    'long-straddle': { profit: 'unlimited', loss: 'limited', evens: 2 },
    'long-strangle': { profit: 'unlimited', loss: 'limited', evens: 2 },
    'iron-condor': { profit: 'limited', loss: 'limited', evens: 2 },
    'long-butterfly': { profit: 'limited', loss: 'limited', evens: 2 },
  };

  it.each(PAYOFF_STRATEGIES.map((s) => s.id))('%s has the risk profile its description claims', (id) => {
    const legs = buildLegs(getStrategyTemplate(id)!.legs, pricing);
    const extremes = payoffExtremes(legs);
    expect(extremes.maxProfit === 'unlimited' ? 'unlimited' : 'limited').toBe(expected[id].profit);
    expect(extremes.maxLoss === 'unlimited' ? 'unlimited' : 'limited').toBe(expected[id].loss);
    expect(breakEvens(legs, 1, 300)).toHaveLength(expected[id].evens);
  });

  it('gives a bullish strategy more at a higher price and a bearish one more at a lower price', () => {
    for (const s of PAYOFF_STRATEGIES) {
      const legs = buildLegs(s.legs, pricing);
      const [low, high] = [strategyPnlAtExpiry(legs, 80), strategyPnlAtExpiry(legs, 120)];
      if (s.outlook === 'bullish') expect(high, s.id).toBeGreaterThan(low);
      if (s.outlook === 'bearish') expect(low, s.id).toBeGreaterThan(high);
    }
  });

  it('points scenarios at real strategies', () => {
    expect(new Set(OUTLOOK_SCENARIOS.map((s) => s.id)).size).toBe(OUTLOOK_SCENARIOS.length);
    for (const s of OUTLOOK_SCENARIOS) {
      for (const id of [s.answer, ...s.distractors]) expect(getStrategyTemplate(id), `${s.id}: ${id}`).toBeDefined();
      expect(s.distractors).toHaveLength(3);
      expect(s.distractors).not.toContain(s.answer);
    }
    expect(OPTION_STRATEGIES.length).toBeGreaterThanOrEqual(12);
  });
});

describe('question builders', () => {
  it.each(CANDLE_PATTERN_IDS)('candlestick: %s uses a real example the detector agrees with', (id) => {
    const rand = seededRandom(11);
    for (let i = 0; i < 5; i++) {
      const q = candlestickQuestion(id, index, datasets, rand)!;
      wellFormed(q);
      const chart = q.chart!;
      expect(chart.real).toBe(true);
      expect(chart.mark!.to).toBe(chart.candles.length - 1);
      // The marked candles are the pattern, and only that pattern.
      expect(patternsAt(chart.candles, chart.candles.length - 1).map((m) => m.id)).toEqual([id]);
      expect(chart.reveal.length).toBeGreaterThan(0);
      expect(chart.reveal[0].time).toBeGreaterThan(chart.candles[chart.candles.length - 1].time);
    }
  });

  it.each(CHART_PATTERNS.map((p) => p.id))('chart: %s is labelled as constructed', (id) => {
    const q = chartQuestion(id, seededRandom(3))!;
    wellFormed(q);
    expect(q.chart!.real).toBe(false);
    expect(q.chart!.title).toBe('Constructed example');
    expect(q.correctId).toBe(id);
  });

  it('what happened next: hides the future and scores it against the hidden candles', () => {
    const rand = seededRandom(21);
    for (let i = 0; i < 40; i++) {
      const q = nextQuestion(datasets, rand)!;
      wellFormed(q, 3);
      const chart = q.chart!;
      expect(chart.reveal).toHaveLength(NEXT_HORIZON);
      const lastVisible = chart.candles[chart.candles.length - 1];
      expect(chart.reveal[0].time).toBeGreaterThan(lastVisible.time);
      const change = chart.reveal[NEXT_HORIZON - 1].close / lastVisible.close - 1;
      if (q.correctId === 'up') expect(change).toBeGreaterThan(0);
      if (q.correctId === 'down') expect(change).toBeLessThan(0);
    }
  });

  it('what happened next: all three answers come up', () => {
    const rand = seededRandom(8);
    const seen = new Set(Array.from({ length: 60 }, () => nextQuestion(datasets, rand)!.correctId));
    expect([...seen].sort()).toEqual(['down', 'sideways', 'up']);
  });

  it.each(PAYOFF_STRATEGIES.map((s) => s.id))('payoff: %s never offers another right answer', (id) => {
    // Some strategies have the same shape at expiry. The twin of the right
    // answer would also be right, so it must not be among the choices.
    const twins: Record<string, string> = {
      'long-call': 'protective-put',
      'protective-put': 'long-call',
      'covered-call': 'cash-secured-put',
      'cash-secured-put': 'covered-call',
      'bull-call-spread': 'bull-put-spread',
      'bull-put-spread': 'bull-call-spread',
    };
    const rand = seededRandom(4);
    for (let i = 0; i < 20; i++) {
      const q = payoffQuestion(id, rand)!;
      wellFormed(q);
      expect(q.payoff!.legs.length).toBeGreaterThan(0);
      if (twins[id]) expect(q.choices.map((c) => c.id)).not.toContain(twins[id]);
    }
  });

  it('payoff: strategies treated as twins really do have the same shape', () => {
    const pricing = { spot: 100, days: 30, volatility: 0.3, rate: 0.04, strikeStep: 5 };
    // The shape is the sequence of directions the payoff line takes from left
    // to right (flat, rising, falling), ignoring where the corners sit.
    const shape = (id: string) => {
      const legs = buildLegs(getStrategyTemplate(id)!.legs, pricing);
      const slopes: number[] = [];
      for (let price = 60; price < 140; price += 1) {
        const slope = Math.sign(Math.round((strategyPnlAtExpiry(legs, price + 1) - strategyPnlAtExpiry(legs, price)) * 1000));
        if (slopes[slopes.length - 1] !== slope) slopes.push(slope);
      }
      return slopes;
    };
    expect(shape('covered-call')).toEqual([1, 0]);
    expect(shape('cash-secured-put')).toEqual([1, 0]);
    expect(shape('bull-call-spread')).toEqual([0, 1, 0]);
    expect(shape('bull-put-spread')).toEqual([0, 1, 0]);
    expect(shape('long-call')).toEqual([0, 1]);
    expect(shape('protective-put')).toEqual([0, 1]);
    // And ones that are not twins differ.
    expect(shape('long-put')).toEqual([-1, 0]);
    expect(shape('long-straddle')).toEqual([-1, 1]);
    expect(shape('iron-condor')).toEqual([0, 1, 0, -1, 0]);
  });

  it('payoff: skips strategies that cannot be drawn at one expiry', () => {
    expect(payoffQuestion('calendar-spread', seededRandom(1))).toBeNull();
  });

  it.each(OUTLOOK_SCENARIOS.map((s) => s.id))('outlook: %s', (id) => {
    wellFormed(outlookQuestion(id, seededRandom(2))!);
  });
});

describe('buildQuestion', () => {
  const context = (seed: number, cards: Record<string, ReviewCard> = {}) => ({ datasets, index, cards, now: NOW, rand: seededRandom(seed) });

  it('offers only drills that do not need data when none has loaded', () => {
    const empty = { datasets: [], index: {} };
    expect(availableKinds('mixed', empty)).toEqual(['chart', 'payoff', 'outlook']);
    expect(availableKinds('candlestick', empty)).toEqual([]);
    expect(buildQuestion('candlestick', { ...context(1), ...empty })).toBeNull();
    expect(buildQuestion('mixed', { ...context(1), ...empty })).not.toBeNull();
  });

  it('respects the chosen mode', () => {
    const c = context(5);
    for (let i = 0; i < 30; i++) {
      expect(buildQuestion('candlestick', c)!.drill).toBe('candlestick');
      expect(buildQuestion('chart', c)!.drill).toBe('chart');
      expect(buildQuestion('next', c)!.drill).toBe('next');
      expect(['payoff', 'outlook']).toContain(buildQuestion('options', c)!.drill);
    }
  });

  it('mixes every drill in mixed mode', () => {
    const c = context(6);
    const seen = new Set(Array.from({ length: 120 }, () => buildQuestion('mixed', c)!.drill));
    expect(seen.size).toBe(5);
  });

  it('asks a weak pattern far more often than mastered ones', () => {
    const cards: Record<string, ReviewCard> = {};
    for (const p of CHART_PATTERNS) {
      const weak = p.id === 'rising-wedge';
      cards[`pattern:${p.id}`] = { ...newCard('pattern', p.id, NOW), attempts: 10, correct: weak ? 1 : 10, dueAt: NOW + 86_400_000 };
    }
    const c = context(7, cards);
    let wedge = 0;
    for (let i = 0; i < 600; i++) if (buildQuestion('chart', c)!.refId === 'rising-wedge') wedge++;
    // Evenly spread it would be 1 in 12 (about 8%). Weighted 4.6 against 1 it is about 30%.
    expect(wedge / 600).toBeGreaterThan(0.22);
  });

  it('does not repeat the previous item', () => {
    const c = context(9);
    for (let i = 0; i < 100; i++) {
      const q = buildQuestion('chart', { ...c, previous: { drill: 'chart', refId: 'bull-flag' } })!;
      expect(q.refId).not.toBe('bull-flag');
    }
  });

  it('covers every candlestick pattern over time', () => {
    const c = context(12);
    const seen = new Set<string>();
    for (let i = 0; i < 400; i++) seen.add(buildQuestion('candlestick', c)!.refId);
    expect([...seen].sort()).toEqual([...(Object.keys(index) as CandlePatternId[])].sort());
    expect(seen.size).toBe(12);
  });
});
