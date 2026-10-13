import { computeIndicator, getIndicator, indicatorLabel, normalizeParams } from '@/lib/indicators';
import type { Series } from '@/lib/indicators';
import type { BacktestRule, BacktestStrategy, Candle, Comparator, Condition, IndicatorId, Operand } from '@/types';

export const COMPARATORS: { id: Comparator; label: string }[] = [
  { id: 'crosses_above', label: 'crosses above' },
  { id: 'crosses_below', label: 'crosses below' },
  { id: 'gt', label: 'is above' },
  { id: 'lt', label: 'is below' },
  { id: 'gte', label: 'is at or above' },
  { id: 'lte', label: 'is at or below' },
];

const PRICE_LABELS: Record<string, string> = { open: 'Open', high: 'High', low: 'Low', close: 'Close', volume: 'Volume' };

/** 'Close', 'EMA 20', 'BB 20, 2 upper', '30' */
export function operandLabel(operand: Operand): string {
  if (operand.kind === 'price') return PRICE_LABELS[operand.field];
  if (operand.kind === 'constant') return String(operand.value);
  const def = getIndicator(operand.indicator);
  const base = indicatorLabel({ id: operand.indicator, params: operand.params });
  if (def.outputs.length < 2) return base;
  const output = def.outputs.find((o) => o.key === operand.output) ?? def.outputs[0];
  return `${base} ${output.label.toLowerCase()}`;
}

/** 'EMA 20 crosses above EMA 50' */
export function conditionLabel(condition: Condition): string {
  const op = COMPARATORS.find((c) => c.id === condition.op)?.label ?? condition.op;
  return `${operandLabel(condition.left)} ${op} ${operandLabel(condition.right)}`;
}

/** 'RSI 14 is below 30 and Close is above EMA 200' */
export function ruleLabel(rule: BacktestRule): string {
  if (rule.conditions.length === 0) return 'never';
  return rule.conditions.map(conditionLabel).join(rule.combine === 'all' ? ' and ' : ' or ');
}

function operandKey(operand: Operand): string {
  if (operand.kind === 'price') return `p:${operand.field}`;
  if (operand.kind === 'constant') return `c:${operand.value}`;
  return `i:${operand.indicator}:${JSON.stringify(normalizeParams(operand.indicator, operand.params))}`;
}

/** Turns operands into one value per candle, computing each indicator once. */
export function createResolver(candles: Candle[], stepSeconds: number) {
  const indicators = new Map<string, Record<string, Series>>();
  return (operand: Operand): Series => {
    if (operand.kind === 'price') return candles.map((c) => c[operand.field]);
    if (operand.kind === 'constant') return candles.map(() => operand.value);
    const key = operandKey(operand);
    let outputs = indicators.get(key);
    if (!outputs) {
      outputs = computeIndicator({ id: operand.indicator, params: operand.params }, candles, stepSeconds);
      indicators.set(key, outputs);
    }
    const def = getIndicator(operand.indicator);
    const output = def.outputs.some((o) => o.key === operand.output) ? (operand.output as string) : defaultOutput(operand.indicator);
    return outputs[output];
  };
}

/** The line a rule uses when none is chosen: the main line, not a histogram. */
export function defaultOutput(indicator: IndicatorId): string {
  const outputs = getIndicator(indicator).outputs;
  return (outputs.find((o) => o.style === 'line') ?? outputs[0]).key;
}

/**
 * Whether a comparison holds on candle `i`. False while either side is still
 * warming up. A cross needs the candle before as well: 'crosses above' means
 * at or below on the previous candle and above on this one.
 */
export function compare(op: Comparator, left: Series, right: Series, i: number): boolean {
  const l = left[i];
  const r = right[i];
  if (l == null || r == null) return false;
  switch (op) {
    case 'gt':
      return l > r;
    case 'gte':
      return l >= r;
    case 'lt':
      return l < r;
    case 'lte':
      return l <= r;
    case 'crosses_above':
    case 'crosses_below': {
      const pl = left[i - 1];
      const pr = right[i - 1];
      if (pl == null || pr == null) return false;
      return op === 'crosses_above' ? pl <= pr && l > r : pl >= pr && l < r;
    }
  }
}

export interface ResolvedRule {
  combine: 'all' | 'any';
  conditions: { op: Comparator; left: Series; right: Series }[];
}

export function resolveRule(rule: BacktestRule, resolve: (operand: Operand) => Series): ResolvedRule {
  return { combine: rule.combine, conditions: rule.conditions.map((c) => ({ op: c.op, left: resolve(c.left), right: resolve(c.right) })) };
}

/** A rule with no conditions is never true. */
export function ruleTrueAt(rule: ResolvedRule, i: number): boolean {
  if (rule.conditions.length === 0) return false;
  const test = (c: ResolvedRule['conditions'][number]) => compare(c.op, c.left, c.right, i);
  return rule.combine === 'all' ? rule.conditions.every(test) : rule.conditions.some(test);
}

/**
 * Candles to load before the test period so indicators have settled by the
 * time it starts. Three times the longest period, because an EMA takes a
 * while to forget where it started.
 */
export function warmupBars(strategy: Pick<BacktestStrategy, 'entry' | 'exit'>): number {
  let longest = 0;
  for (const rule of [strategy.entry, strategy.exit]) {
    for (const condition of rule.conditions) {
      for (const operand of [condition.left, condition.right]) {
        if (operand.kind !== 'indicator') continue;
        for (const value of Object.values(normalizeParams(operand.indicator, operand.params))) longest = Math.max(longest, value);
      }
    }
  }
  return Math.min(1000, Math.max(50, Math.ceil(longest * 3)));
}

/** Every indicator a strategy's rules use, once each, for drawing on the chart. */
export function strategyIndicators(strategy: Pick<BacktestStrategy, 'entry' | 'exit'>): { id: IndicatorId; params: Record<string, number> }[] {
  const seen = new Map<string, { id: IndicatorId; params: Record<string, number> }>();
  for (const rule of [strategy.entry, strategy.exit]) {
    for (const condition of rule.conditions) {
      for (const operand of [condition.left, condition.right]) {
        if (operand.kind !== 'indicator') continue;
        const params = normalizeParams(operand.indicator, operand.params);
        seen.set(operandKey(operand), { id: operand.indicator, params });
      }
    }
  }
  return [...seen.values()];
}

/** Problems that stop a strategy from running, in plain words. Empty when it is fine. */
export function validateStrategy(strategy: BacktestStrategy): string[] {
  const problems: string[] = [];
  if (strategy.entry.conditions.length === 0) problems.push('Add at least one entry condition.');
  const hasExit = strategy.exit.conditions.length > 0 || strategy.stopLossPct != null || strategy.takeProfitPct != null;
  if (!hasExit) problems.push('Add an exit condition, a stop-loss or a take-profit, or the first trade never closes.');
  if (strategy.stopLossPct != null && !(strategy.stopLossPct > 0 && strategy.stopLossPct < 100)) problems.push('Stop-loss must be between 0% and 100%.');
  if (strategy.takeProfitPct != null && !(strategy.takeProfitPct > 0)) problems.push('Take-profit must be above 0%.');
  if (!(strategy.positionSizePct > 0 && strategy.positionSizePct <= 100)) problems.push('Position size must be between 0% and 100% of the account.');
  for (const rule of [strategy.entry, strategy.exit]) {
    for (const c of rule.conditions) {
      if ([c.left, c.right].some((o) => o.kind === 'constant' && !Number.isFinite(o.value))) problems.push('A condition is missing its number.');
      else if (c.left.kind === 'constant' && c.right.kind === 'constant') problems.push(`"${conditionLabel(c)}" compares two fixed numbers.`);
      else if (operandLabel(c.left) === operandLabel(c.right)) problems.push(`"${conditionLabel(c)}" compares a value with itself.`);
    }
  }
  return problems;
}
