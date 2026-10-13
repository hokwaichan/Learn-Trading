export { runBacktest } from './engine';
export type { BacktestOptions, BacktestOutput } from './engine';
export { COMPARATORS, compare, conditionLabel, createResolver, defaultOutput, operandLabel, resolveRule, ruleLabel, ruleTrueAt, strategyIndicators, validateStrategy, warmupBars } from './rules';
export { computeStats, drawdownSeries, maxDrawdownPct, sharpeRatio } from './stats';
