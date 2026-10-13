import { CANDLESTICK_PATTERNS, CHART_PATTERNS, getPattern } from '@/content/patterns';
import { getStrategyTemplate, OPTION_STRATEGIES, OUTLOOK_SCENARIOS } from '@/content/strategies';
import { formatPct, formatSignedPct } from '@/lib/format';
import { unambiguousPatterns, type CandlePatternId, type PatternMatch } from '@/lib/patterns/detectors';
import { classifyOutcome, type Outcome } from '@/lib/patterns/outcome';
import type { PayoffLeg } from '@/lib/pricing/payoff';
import { buildLegs } from '@/lib/pricing/templates';
import { shuffled } from '@/lib/random';
import { findFairValueGaps, findStructureBreaks, findSweeps, findSwings } from '@/lib/structure/structure';
import { pickWeighted } from '@/lib/srs/sm2';
import type { Candle, ReviewCard } from '@/types';

export type DrillMode = 'mixed' | 'candlestick' | 'chart' | 'structure' | 'next' | 'options';
export type DrillKind = 'candlestick' | 'chart' | 'structure' | 'next' | 'payoff' | 'outlook';

/** A series of real candles the trainer can cut questions from. */
export interface Dataset {
  symbol: string;
  title: string;
  tickSize: number;
  candles: Candle[];
}

export interface TrainerQuestion {
  /** Unique per question shown, for React keys. */
  key: string;
  drill: DrillKind;
  /** Spaced-repetition card this answer is recorded against. */
  kind: ReviewCard['kind'];
  refId: string;
  /** Short label for the strip above the question. */
  topic: string;
  prompt: string;
  chart?: {
    title: string;
    tickSize: number;
    candles: Candle[];
    /** Candles added to the right once the question is answered. */
    reveal: Candle[];
    /** Positions (in `candles`) of the pattern being asked about. */
    mark?: { from: number; to: number };
    /** True for real market history, false for a constructed example. */
    real: boolean;
  };
  payoff?: { legs: PayoffLeg[]; spot: number };
  choices: { id: string; label: string }[];
  correctId: string;
  explanation: { heading: string; paragraphs: string[]; lesson?: string };
}

export const DRILL_NAMES: Record<DrillKind, string> = {
  candlestick: 'Candlestick pattern',
  chart: 'Chart pattern',
  structure: 'Smart money concept',
  next: 'What happened next?',
  payoff: 'Payoff diagram',
  outlook: 'Strategy for an outlook',
};

const KINDS_BY_MODE: Record<DrillMode, DrillKind[]> = {
  mixed: ['candlestick', 'chart', 'structure', 'next', 'payoff', 'outlook'],
  candlestick: ['candlestick'],
  chart: ['chart'],
  structure: ['structure'],
  next: ['next'],
  options: ['payoff', 'outlook'],
};

/** How often each drill comes up in mixed mode. */
const MIX_WEIGHT: Record<DrillKind, number> = { candlestick: 3, chart: 3, structure: 2, next: 2, payoff: 1.5, outlook: 1.5 };

const CONTEXT = 44; // candles shown before a candlestick pattern
const AFTER_PATTERN = 8; // candles revealed after it
const NEXT_VISIBLE = 70;
export const NEXT_HORIZON = 15;

/** Each pattern's opposite, always offered as a wrong answer so the question is not trivial. */
const MIRROR: Record<string, string> = {
  hammer: 'shooting-star',
  'shooting-star': 'hammer',
  'bullish-engulfing': 'bearish-engulfing',
  'bearish-engulfing': 'bullish-engulfing',
  'bullish-harami': 'bullish-engulfing',
  'bearish-harami': 'bearish-engulfing',
  'morning-star': 'evening-star',
  'evening-star': 'morning-star',
  'three-white-soldiers': 'three-black-crows',
  'three-black-crows': 'three-white-soldiers',
  doji: 'hammer',
  marubozu: 'three-white-soldiers',
  'head-and-shoulders': 'double-top',
  'inverse-head-and-shoulders': 'double-bottom',
  'double-top': 'head-and-shoulders',
  'double-bottom': 'inverse-head-and-shoulders',
  'ascending-triangle': 'symmetrical-triangle',
  'descending-triangle': 'symmetrical-triangle',
  'symmetrical-triangle': 'ascending-triangle',
  'bull-flag': 'rising-wedge',
  'bear-flag': 'falling-wedge',
  'rising-wedge': 'ascending-triangle',
  'falling-wedge': 'descending-triangle',
  'cup-and-handle': 'double-bottom',
};

/**
 * Strategies whose payoff at expiry has the same shape. A payoff question
 * never offers two from the same group, because both would be right.
 */
const SAME_PAYOFF = [
  ['long-call', 'protective-put'],
  ['covered-call', 'cash-secured-put'],
  ['bull-call-spread', 'bull-put-spread'],
];

export const PAYOFF_STRATEGIES = OPTION_STRATEGIES.filter((s) => s.singleExpiry);

export type PatternIndex = Record<string, { dataset: number; match: PatternMatch }[]>;

/** Finds every clear candlestick pattern in the datasets that has room around it for a question. */
export function indexPatterns(datasets: Dataset[]): PatternIndex {
  const index: PatternIndex = {};
  datasets.forEach((dataset, d) => {
    for (const match of unambiguousPatterns(dataset.candles)) {
      if (match.end < CONTEXT || match.end + AFTER_PATTERN >= dataset.candles.length) continue;
      (index[match.id] ??= []).push({ dataset: d, match });
    }
  });
  return index;
}

function choicesFor(correct: string, mirror: string | undefined, pool: string[], count: number, seed: number, name: (id: string) => string) {
  const wrong = shuffled(pool.filter((id) => id !== correct && id !== mirror), seed).slice(0, count - (mirror ? 2 : 1));
  const ids = shuffled([correct, ...(mirror ? [mirror] : []), ...wrong], seed + 1);
  return ids.map((id) => ({ id, label: name(id) }));
}

const patternName = (id: string) => getPattern(id)?.name ?? id;
const strategyName = (id: string) => getStrategyTemplate(id)?.name ?? id;
const int = (rand: () => number, n: number) => Math.floor(rand() * n);

export function candlestickQuestion(id: CandlePatternId, index: PatternIndex, datasets: Dataset[], rand: () => number): TrainerQuestion | null {
  const found = index[id];
  const pattern = getPattern(id);
  if (!found?.length || !pattern) return null;
  const { dataset, match } = found[int(rand, found.length)];
  const data = datasets[dataset];
  const candles = data.candles.slice(match.end - CONTEXT, match.end + 1);
  const reveal = data.candles.slice(match.end + 1, match.end + 1 + AFTER_PATTERN);
  const after = reveal.length ? reveal[reveal.length - 1].close / candles[candles.length - 1].close - 1 : 0;
  const seed = int(rand, 1e9);
  return {
    key: `candlestick-${id}-${data.symbol}-${match.end}`,
    drill: 'candlestick',
    kind: 'pattern',
    refId: id,
    topic: DRILL_NAMES.candlestick,
    prompt: match.length === 1 ? 'What is the marked candle?' : `What pattern do the ${match.length} marked candles form?`,
    chart: { title: `${data.title} · daily`, tickSize: data.tickSize, candles, reveal, mark: { from: candles.length - match.length, to: candles.length - 1 }, real: true },
    choices: choicesFor(id, MIRROR[id], CANDLESTICK_PATTERNS.map((p) => p.id), 4, seed, patternName),
    correctId: id,
    explanation: {
      heading: pattern.name,
      paragraphs: [
        pattern.description,
        `How traders read it: ${pattern.howToRead}`,
        `Weakness: ${pattern.weaknesses}`,
        `What happened here: over the next ${reveal.length} candles price moved ${formatSignedPct(after)}. ` +
          (pattern.bias === 'neutral'
            ? 'This pattern does not point either way by itself.'
            : (pattern.bias === 'bullish') === after > 0
              ? 'This time it went the way the pattern suggests.'
              : 'This time it did not go the way the pattern suggests, which happens often.'),
      ],
      lesson: id === 'doji' || id === 'hammer' || id === 'shooting-star' || id === 'marubozu' ? 'candlesticks/single-candle-patterns' : 'candlesticks/multi-candle-patterns',
    },
  };
}

const CHART_LESSON: Record<string, string> = {
  'head-and-shoulders': 'chart-patterns/head-and-shoulders',
  'inverse-head-and-shoulders': 'chart-patterns/head-and-shoulders',
  'double-top': 'chart-patterns/double-tops-and-bottoms',
  'double-bottom': 'chart-patterns/double-tops-and-bottoms',
  'ascending-triangle': 'chart-patterns/triangles',
  'descending-triangle': 'chart-patterns/triangles',
  'symmetrical-triangle': 'chart-patterns/triangles',
  'bull-flag': 'chart-patterns/flags-and-wedges',
  'bear-flag': 'chart-patterns/flags-and-wedges',
  'rising-wedge': 'chart-patterns/flags-and-wedges',
  'falling-wedge': 'chart-patterns/flags-and-wedges',
  'cup-and-handle': 'chart-patterns/cup-and-handle',
};

export function chartQuestion(id: string, rand: () => number): TrainerQuestion | null {
  const pattern = getPattern(id);
  if (!pattern?.build) return null;
  const seed = int(rand, 1e6);
  const built = pattern.build(seed);
  return {
    key: `chart-${id}-${seed}`,
    drill: 'chart',
    kind: 'pattern',
    refId: id,
    topic: DRILL_NAMES.chart,
    prompt: 'Which chart pattern is this?',
    chart: { title: 'Constructed example', tickSize: 0.01, candles: built.candles, reveal: [], mark: { from: built.from, to: built.to }, real: false },
    choices: choicesFor(id, MIRROR[id], CHART_PATTERNS.map((p) => p.id), 4, seed, patternName),
    correctId: id,
    explanation: {
      heading: pattern.name,
      paragraphs: [pattern.description, `How traders read it: ${pattern.howToRead}`, `Weakness: ${pattern.weaknesses}`],
      lesson: CHART_LESSON[id],
    },
  };
}

const OUTCOME_LABEL: Record<Outcome, string> = { up: 'Up', sideways: 'Sideways', down: 'Down' };

// ── Smart money concepts ───────────────────────────────────────────────

export type StructureItemId = 'fair-value-gap' | 'liquidity-sweep' | 'break-of-structure' | 'change-of-character';

/** The structure events the trainer asks about, each found on real charts by the rules in lib/structure. */
export const STRUCTURE_ITEMS: { id: StructureItemId; name: string; lesson: string; rule: string; reading: string }[] = [
  {
    id: 'fair-value-gap',
    name: 'Fair value gap',
    lesson: 'smart-money/fair-value-gaps',
    rule: 'Three candles where the first and the third do not overlap, so the prices between them were traded only by the large middle candle.',
    reading: 'Traders watch for price to come back into the gap and treat it as a zone where the move may resume. Many gaps are simply filled.',
  },
  {
    id: 'liquidity-sweep',
    name: 'Liquidity sweep',
    lesson: 'smart-money/liquidity',
    rule: 'The last candle trades beyond the earlier swing point at the start of the box, but closes back on the original side of it.',
    reading: 'Stops resting beyond the level were triggered and price could not stay there. It often leads to a move the other way, but only the close made it a sweep and not a breakout.',
  },
  {
    id: 'break-of-structure',
    name: 'Break of structure',
    lesson: 'smart-money/structure-bos-choch',
    rule: 'The last candle closes beyond the earlier swing point at the start of the box, in the same direction as the trend before it.',
    reading: 'The trend is continuing. Traders look for a pullback to join it.',
  },
  {
    id: 'change-of-character',
    name: 'Change of character',
    lesson: 'smart-money/structure-bos-choch',
    rule: 'The last candle closes beyond the earlier swing point at the start of the box, against the trend before it: the first break in the new direction.',
    reading: 'The trend may be turning. It is a reason to stop trading the old direction, not yet proof of a new one.',
  },
];

const STRUCTURE_CONTEXT = 54; // candles shown, ending at the event
const SWING_STRENGTH = 3;
/** Longest stretch, in candles, between the swing point and the candle that breaks or sweeps it. */
const MAX_SPAN = 30;

interface StructureEvent {
  /** First and last candle of the box, as positions in the dataset. */
  from: number;
  to: number;
  direction: 'up' | 'down';
}

const structureCache = new WeakMap<Candle[], Record<StructureItemId, StructureEvent[]>>();

/** Every structure event in a dataset that is clear enough, and has room around it, to ask about. */
export function structureEvents(candles: Candle[]): Record<StructureItemId, StructureEvent[]> {
  const cached = structureCache.get(candles);
  if (cached) return cached;
  const swings = findSwings(candles, SWING_STRENGTH);
  const breaks = findStructureBreaks(candles, swings);
  const breakAt = new Set(breaks.map((b) => b.index));
  const room = (e: StructureEvent) => e.to >= STRUCTURE_CONTEXT && e.to + AFTER_PATTERN < candles.length;
  const spanOk = (e: StructureEvent) => e.to - e.from >= 4 && e.to - e.from <= MAX_SPAN;
  const events: Record<StructureItemId, StructureEvent[]> = {
    // Only gaps of at least 0.5% of price, and not ones made by a candle that also broke structure.
    'fair-value-gap': findFairValueGaps(candles, 0.005)
      .filter((g) => !breakAt.has(g.index) && !breakAt.has(g.index + 1))
      .map((g) => ({ from: g.index - 1, to: g.index + 1, direction: g.direction === 'bullish' ? ('up' as const) : ('down' as const) }))
      .filter(room),
    'liquidity-sweep': findSweeps(candles, swings)
      .map((s) => ({ from: s.swingIndex, to: s.index, direction: s.side === 'high' ? ('up' as const) : ('down' as const) }))
      .filter((e) => room(e) && spanOk(e)),
    'break-of-structure': breaks.filter((b) => b.kind === 'bos').map((b) => ({ from: b.swingIndex, to: b.index, direction: b.direction === 'bullish' ? ('up' as const) : ('down' as const) })).filter((e) => room(e) && spanOk(e)),
    'change-of-character': breaks.filter((b) => b.kind === 'choch').map((b) => ({ from: b.swingIndex, to: b.index, direction: b.direction === 'bullish' ? ('up' as const) : ('down' as const) })).filter((e) => room(e) && spanOk(e)),
  };
  structureCache.set(candles, events);
  return events;
}

export function structureQuestion(id: StructureItemId, datasets: Dataset[], rand: () => number): TrainerQuestion | null {
  const item = STRUCTURE_ITEMS.find((s) => s.id === id);
  const usable = datasets.map((d) => ({ data: d, events: structureEvents(d.candles)[id] })).filter((d) => d.events.length > 0);
  if (!item || usable.length === 0) return null;
  const { data, events } = usable[int(rand, usable.length)];
  const event = events[int(rand, events.length)];
  const start = event.to + 1 - STRUCTURE_CONTEXT;
  const candles = data.candles.slice(start, event.to + 1);
  const reveal = data.candles.slice(event.to + 1, event.to + 1 + AFTER_PATTERN);
  const after = reveal.length ? reveal[reveal.length - 1].close / candles[candles.length - 1].close - 1 : 0;
  const gap = id === 'fair-value-gap';
  const side = event.direction === 'up' ? 'high' : 'low';
  return {
    key: `structure-${id}-${data.symbol}-${event.to}`,
    drill: 'structure',
    kind: 'concept',
    refId: `smc-${id}`,
    topic: DRILL_NAMES.structure,
    prompt: gap ? 'What do the 3 marked candles show?' : `The box runs from an earlier swing ${side} to the last candle. What has just happened?`,
    chart: { title: `${data.title} · daily`, tickSize: data.tickSize, candles, reveal, mark: { from: event.from - start, to: event.to - start }, real: true },
    choices: shuffled(STRUCTURE_ITEMS.map((s) => ({ id: s.id, label: s.name })), int(rand, 1e9)),
    correctId: id,
    explanation: {
      heading: `${item.name}${gap ? (event.direction === 'up' ? ' (bullish)' : ' (bearish)') : `, of a swing ${side}`}`,
      paragraphs: [
        `The rule: ${item.rule}`,
        `How traders read it: ${item.reading}`,
        `What happened here: over the next ${reveal.length} candles price moved ${formatSignedPct(after)}. These are descriptions of what price did, found by fixed rules. They are not predictions, and they fail often.`,
      ],
      lesson: item.lesson,
    },
  };
}

export function nextQuestion(datasets: Dataset[], rand: () => number): TrainerQuestion | null {
  const usable = datasets.filter((d) => d.candles.length > NEXT_VISIBLE + NEXT_HORIZON + 20);
  if (usable.length === 0) return null;
  const data = usable[int(rand, usable.length)];
  const cut = NEXT_VISIBLE + int(rand, data.candles.length - NEXT_VISIBLE - NEXT_HORIZON - 1);
  const result = classifyOutcome(data.candles, cut, NEXT_HORIZON);
  if (!result) return null;
  return {
    key: `next-${data.symbol}-${cut}`,
    drill: 'next',
    kind: 'what-next',
    refId: 'all',
    topic: DRILL_NAMES.next,
    prompt: `Where will price be ${NEXT_HORIZON} candles from now?`,
    // Only candles up to the cut are handed over; the future arrives in `reveal`.
    chart: {
      title: `${data.title} · daily`,
      tickSize: data.tickSize,
      candles: data.candles.slice(cut - NEXT_VISIBLE + 1, cut + 1),
      reveal: data.candles.slice(cut + 1, cut + 1 + NEXT_HORIZON),
      real: true,
    },
    choices: (['up', 'sideways', 'down'] as Outcome[]).map((id) => ({ id, label: OUTCOME_LABEL[id] })),
    correctId: result.outcome,
    explanation: {
      heading: `It went ${OUTCOME_LABEL[result.outcome].toLowerCase()}`,
      paragraphs: [
        `Over the next ${NEXT_HORIZON} candles price moved ${formatSignedPct(result.change)}, which is ${Math.abs(result.changeInAtr).toFixed(1)} times the average candle range (ATR) at the time.`,
        `A move of less than about ${result.thresholdAtr.toFixed(1)} ATR either way counts as sideways. The threshold is set so that random movement would land in each of the three answers about equally often.`,
        'Nobody predicts this reliably, and a score near one in three is what guessing gives. The point of the drill is to practise reading trend, levels and momentum before committing, and to see for yourself how often an obvious-looking setup fails.',
      ],
    },
  };
}

export function payoffQuestion(id: string, rand: () => number): TrainerQuestion | null {
  const template = getStrategyTemplate(id);
  if (!template?.singleExpiry) return null;
  const spot = 100;
  const legs = buildLegs(template.legs, { spot, days: 30, volatility: 0.3, rate: 0.04, strikeStep: 5 });
  const twins = SAME_PAYOFF.find((group) => group.includes(id)) ?? [];
  const pool = PAYOFF_STRATEGIES.map((s) => s.id).filter((other) => !twins.includes(other));
  const seed = int(rand, 1e9);
  return {
    key: `payoff-${id}-${seed}`,
    drill: 'payoff',
    kind: 'option-payoff',
    refId: id,
    topic: DRILL_NAMES.payoff,
    prompt: 'Which strategy has this payoff at expiry? The underlying is at 100 now.',
    payoff: { legs, spot },
    choices: choicesFor(id, undefined, pool, 4, seed, strategyName),
    correctId: id,
    explanation: {
      heading: template.name,
      paragraphs: [
        `${template.summary} ${template.when}`,
        `Maximum profit: ${template.maxProfit}. Maximum loss: ${template.maxLoss}. Break-even: ${template.breakEven}.`,
        ...(twins.length
          ? [`${strategyName(twins.find((t) => t !== id)!)} has the same shape at expiry, so it was not offered as a choice.`]
          : []),
      ],
      lesson: template.lesson,
    },
  };
}

export function outlookQuestion(id: string, rand: () => number): TrainerQuestion | null {
  const scenario = OUTLOOK_SCENARIOS.find((s) => s.id === id);
  if (!scenario) return null;
  const answer = getStrategyTemplate(scenario.answer);
  const ids = shuffled([scenario.answer, ...scenario.distractors], int(rand, 1e9));
  return {
    key: `outlook-${id}-${ids.join('')}`,
    drill: 'outlook',
    kind: 'option-outlook',
    refId: id,
    topic: DRILL_NAMES.outlook,
    prompt: scenario.prompt,
    choices: ids.map((choice) => ({ id: choice, label: strategyName(choice) })),
    correctId: scenario.answer,
    explanation: { heading: answer?.name ?? scenario.answer, paragraphs: [scenario.why], lesson: answer?.lesson },
  };
}

export interface QuestionContext {
  datasets: Dataset[];
  index: PatternIndex;
  cards: Record<string, ReviewCard>;
  now: number;
  /** Returns a number from 0 to 1. */
  rand: () => number;
  /** The previous question, so the same item is not asked twice running. */
  previous?: { drill: DrillKind; refId: string };
}

/** Drill kinds that can be asked right now. Two of them need price history to have loaded. */
export function availableKinds(mode: DrillMode, context: Pick<QuestionContext, 'datasets' | 'index'>): DrillKind[] {
  return KINDS_BY_MODE[mode].filter((kind) => {
    if (kind === 'candlestick') return Object.keys(context.index).length > 0;
    if (kind === 'next' || kind === 'structure') return context.datasets.length > 0;
    return true;
  });
}

/**
 * Chooses and builds the next question. Within a drill, the item is picked
 * by spaced repetition: weak, overdue and unseen items come up more often.
 */
export function buildQuestion(mode: DrillMode, context: QuestionContext): TrainerQuestion | null {
  const kinds = availableKinds(mode, context);
  if (kinds.length === 0) return null;
  const { rand, cards, now, previous } = context;

  // Try a few times: a pick can fail if, say, a pattern has no example with room around it.
  for (let attempt = 0; attempt < 8; attempt++) {
    let r = rand() * kinds.reduce((sum, k) => sum + MIX_WEIGHT[k], 0);
    const drill = kinds.find((k) => (r -= MIX_WEIGHT[k]) < 0) ?? kinds[kinds.length - 1];
    const avoid = previous?.drill === drill ? previous.refId : undefined;
    let question: TrainerQuestion | null;

    if (drill === 'candlestick') {
      const ids = Object.keys(context.index) as CandlePatternId[];
      question = candlestickQuestion(pickWeighted(ids, cards, (id) => `pattern:${id}`, now, rand, avoid as CandlePatternId), context.index, context.datasets, rand);
    } else if (drill === 'chart') {
      const ids = CHART_PATTERNS.map((p) => p.id);
      question = chartQuestion(pickWeighted(ids, cards, (id) => `pattern:${id}`, now, rand, avoid), rand);
    } else if (drill === 'structure') {
      const ids = STRUCTURE_ITEMS.map((s) => s.id);
      question = structureQuestion(pickWeighted(ids, cards, (id) => `concept:smc-${id}`, now, rand, avoid?.replace('smc-', '') as StructureItemId | undefined), context.datasets, rand);
    } else if (drill === 'next') {
      question = nextQuestion(context.datasets, rand);
    } else if (drill === 'payoff') {
      const ids = PAYOFF_STRATEGIES.map((s) => s.id);
      question = payoffQuestion(pickWeighted(ids, cards, (id) => `option-payoff:${id}`, now, rand, avoid), rand);
    } else {
      const ids = OUTLOOK_SCENARIOS.map((s) => s.id);
      question = outlookQuestion(pickWeighted(ids, cards, (id) => `option-outlook:${id}`, now, rand, avoid), rand);
    }
    if (question) return question;
  }
  return null;
}

/** Share of answers right, as text, or a dash before any answer. */
export function accuracyText(card: Pick<ReviewCard, 'attempts' | 'correct'> | undefined): string {
  return card && card.attempts > 0 ? formatPct(card.correct / card.attempts, 0) : '–';
}
