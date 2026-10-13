import { describe, expect, it } from 'vitest';
import { INDICATOR_INFO } from '@/content/indicators';
import { defaultParams, INDICATORS } from '@/lib/indicators';
import type { Candle, IndicatorConfig, IndicatorId } from '@/types';
import { explainIndicator } from './indicator';

const DAY = 86_400;
const config = (id: IndicatorId, params = defaultParams(id)): IndicatorConfig => ({ key: id, id, params, visible: true });

/** Closes with a matching high/low half a point either side. */
function series(closes: number[], volume: (i: number) => number = () => 1000): Candle[] {
  return closes.map((close, i) => ({ time: i * DAY, open: close, high: close + 0.5, low: close - 0.5, close, volume: volume(i) }));
}

const rising = series(Array.from({ length: 60 }, (_, i) => 100 + i));
const falling = series(Array.from({ length: 60 }, (_, i) => 200 - i));
const explain = (id: IndicatorId, candles: Candle[], index = candles.length - 1, params?: Record<string, number>) =>
  explainIndicator(config(id, params), INDICATOR_INFO[id], candles, index, { stepSeconds: DAY })!;
const reading = (e: ReturnType<typeof explain>) => e.paragraphs[0].text;

describe('indicator content', () => {
  it('has an explanation for every indicator in the registry', () => {
    for (const def of INDICATORS) {
      const info = INDICATOR_INFO[def.id];
      expect(info, def.id).toBeDefined();
      expect(info.summary.length).toBeGreaterThan(20);
      expect(info.signals.length).toBeGreaterThanOrEqual(2);
      expect(info.weaknesses.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('explainIndicator', () => {
  it.each(INDICATORS.map((d) => d.id))('%s: has a reading, then the four teaching sections', (id) => {
    const e = explain(id, rising);
    expect(e.paragraphs.map((p) => p.heading)).toEqual([
      'Reading at this candle',
      'What it measures',
      'How it is calculated',
      'Typical signals',
      'Weaknesses',
    ]);
    expect(reading(e).length).toBeGreaterThan(20);
    expect(e.facts.at(-1)).toEqual({ label: 'Close', value: '159.00' });
  });

  it('says so when there is not enough data for a value', () => {
    const e = explain('sma', rising, 5);
    expect(reading(e)).toContain('There is no value here yet');
    expect(e.facts[0]).toEqual({ label: 'SMA', value: 'not enough data yet' });
  });

  it('puts the parameters in the title', () => {
    expect(explain('sma', rising, 59, { period: 50 }).title).toBe('Simple Moving Average (SMA 50)');
  });

  it('SMA: reports which side of the average price is on', () => {
    expect(reading(explain('sma', rising))).toMatch(/above the SMA 20.*leans bullish/);
    expect(reading(explain('sma', falling))).toMatch(/below the SMA 20.*leans bearish/);
  });

  it('RSI: names the overbought and oversold zones without calling them signals', () => {
    expect(reading(explain('rsi', rising))).toMatch(/RSI is 100\.0.*above 70.*not a sell signal/);
    expect(reading(explain('rsi', falling))).toMatch(/RSI is 0\.0.*below 30.*not a buy signal/);
  });

  it('RSI: describes the neutral zone by which side of 50 it is on', () => {
    const choppy = series(Array.from({ length: 60 }, (_, i) => 100 + (i % 2 === 0 ? 1 : -0.8) + i * 0.01));
    expect(reading(explain('rsi', choppy))).toContain('neutral zone');
  });

  it('MACD: reads the zero line and the signal line', () => {
    expect(reading(explain('macd', rising))).toMatch(/above zero.*uptrend/);
    expect(reading(explain('macd', falling))).toMatch(/below zero.*downtrend/);
  });

  it('Stochastic: flags closes at the top and bottom of the range', () => {
    expect(reading(explain('stochastic', rising))).toContain('above 80 (overbought)');
    expect(reading(explain('stochastic', falling))).toContain('below 20 (oversold)');
  });

  it('Bollinger: says when price is outside or inside the bands', () => {
    const flatThenSpike = series([...Array(30).fill(100), 130]);
    expect(reading(explain('bollinger', flatThenSpike))).toContain('above the upper band');
    const wavy = series(Array.from({ length: 40 }, (_, i) => 100 + Math.sin(i) * 2));
    expect(reading(explain('bollinger', wavy))).toContain('inside the bands');
  });

  it('ATR: relates the value to stop placement', () => {
    // Every candle spans exactly 1.00 and steps up 1.00, so the true range is 1.50.
    const text = reading(explain('atr', rising));
    expect(text).toContain('ATR is 1.50');
    expect(text).toContain('stop-loss closer than 1.50');
  });

  it('Volume MA: compares the candle with normal volume', () => {
    const quietThenBusy = series(Array(40).fill(100), (i) => (i === 39 ? 5000 : 1000));
    expect(reading(explain('volumeMa', quietThenBusy))).toMatch(/4\.2 times normal.*Heavy volume/);
  });

  it('VWAP: has no value without volume', () => {
    expect(reading(explain('vwap', series(Array(10).fill(100), () => 0)))).toContain('There is no value here yet');
  });
});
