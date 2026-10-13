/** One value per candle; null while an indicator is still warming up. */
export type Series = (number | null)[];

export function emptySeries(length: number): Series {
  return new Array<number | null>(length).fill(null);
}

/** Simple moving average of a series that may start with nulls. */
export function smaOf(values: Series, period: number): Series {
  const out = emptySeries(values.length);
  if (period < 1) return out;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) {
      sum = 0;
      count = 0;
      continue;
    }
    sum += v;
    count++;
    if (count > period) {
      sum -= values[i - period] as number;
      count = period;
    }
    if (count === period) out[i] = sum / period;
  }
  return out;
}

/**
 * Exponential moving average of a series that may start with nulls.
 * Seeded with the simple average of the first `period` values, then
 *   EMA = previous EMA + k * (value - previous EMA),  k = 2 / (period + 1)
 */
export function emaOf(values: Series, period: number): Series {
  const out = emptySeries(values.length);
  if (period < 1) return out;
  const k = 2 / (period + 1);
  let seedSum = 0;
  let seedCount = 0;
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) continue;
    if (prev == null) {
      seedSum += v;
      seedCount++;
      if (seedCount === period) {
        prev = seedSum / period;
        out[i] = prev;
      }
    } else {
      prev = prev + k * (v - prev);
      out[i] = prev;
    }
  }
  return out;
}
