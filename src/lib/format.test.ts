import { describe, expect, it } from 'vitest';
import {
  decimalsFor,
  floorToStep,
  formatMoney,
  formatPct,
  formatPrice,
  formatQty,
  formatSignedMoney,
  formatSignedPct,
  roundToTick,
} from './format';

describe('format', () => {
  it('formats money with grouping', () => {
    expect(formatMoney(10000)).toBe('$10,000.00');
    expect(formatMoney(-1234.5)).toBe('-$1,234.50');
  });

  it('always signs P&L, and never signs zero', () => {
    expect(formatSignedMoney(12)).toBe('+$12.00');
    expect(formatSignedMoney(-3.5)).toBe('-$3.50');
    expect(formatSignedMoney(0)).toBe('$0.00');
    expect(formatSignedMoney(-0.001)).toBe('$0.00');
  });

  it('formats percentages from fractions', () => {
    expect(formatSignedPct(0.0123)).toBe('+1.23%');
    expect(formatSignedPct(-0.5)).toBe('-50.00%');
    expect(formatPct(0.5)).toBe('50.0%');
  });

  it('derives decimals from tick and step sizes', () => {
    expect(decimalsFor(0.01)).toBe(2);
    expect(decimalsFor(0.00001)).toBe(5);
    expect(decimalsFor(1)).toBe(0);
    expect(formatPrice(67123.4, 0.1)).toBe('67,123.4');
    expect(formatQty(0.5, 0.0001)).toBe('0.5');
    expect(formatQty(100, 1)).toBe('100');
  });

  it('snaps to step and tick without float noise', () => {
    expect(floorToStep(0.123456, 0.001)).toBe(0.123);
    expect(floorToStep(0.3, 0.1)).toBe(0.3);
    expect(roundToTick(100.126, 0.01)).toBe(100.13);
  });

  it('shows a dash for non-finite values', () => {
    expect(formatMoney(NaN)).toBe('-');
    expect(formatSignedPct(Infinity)).toBe('-');
  });
});
