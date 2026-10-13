/** A small seeded random generator (mulberry32): the same seed gives the same sequence. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turns a string into a seed. */
export function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A shuffled copy (Fisher-Yates), decided entirely by the seed. */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  const rand = seededRandom(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface SimulatedRun {
  /** Account value after each trade, in R, starting from 0. */
  equity: number[];
  finalR: number;
  maxDrawdownR: number;
  longestLosingStreak: number;
}

/**
 * Simulates a run of trades that each win `avgWinR` with probability
 * `winRate` and otherwise lose 1R. Used to show how much luck there is in a
 * short run even when the long-run average is fixed.
 */
export function simulateTrades(winRate: number, avgWinR: number, trades: number, seed: number): SimulatedRun {
  const rand = seededRandom(seed);
  const equity = [0];
  let value = 0;
  let peak = 0;
  let maxDrawdownR = 0;
  let streak = 0;
  let longestLosingStreak = 0;
  for (let i = 0; i < trades; i++) {
    if (rand() < winRate) {
      value += avgWinR;
      streak = 0;
    } else {
      value -= 1;
      streak++;
      longestLosingStreak = Math.max(longestLosingStreak, streak);
    }
    peak = Math.max(peak, value);
    maxDrawdownR = Math.max(maxDrawdownR, peak - value);
    equity.push(value);
  }
  return { equity, finalR: value, maxDrawdownR, longestLosingStreak };
}
