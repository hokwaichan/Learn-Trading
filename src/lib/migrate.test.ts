import { describe, expect, it } from 'vitest';
import { createMigrate } from './migrate';

interface V3 {
  theme: 'dark' | 'light';
  feeRate: number;
  riskFreeRate: number;
}

const defaults: V3 = { theme: 'dark', feeRate: 0.001, riskFreeRate: 0.04 };

const migrate = createMigrate<V3>(3, defaults, {
  // v1 stored the fee as a percentage.
  1: (s) => ({ ...s, feeRate: (s.feePct as number) / 100 }),
  // v2 -> v3 added riskFreeRate.
  2: (s) => ({ ...s, riskFreeRate: 0.05 }),
});

describe('createMigrate', () => {
  it('runs every step from the saved version up to the current one', () => {
    const out = migrate({ theme: 'light', feePct: 0.2 }, 1);
    expect(out.theme).toBe('light');
    expect(out.feeRate).toBeCloseTo(0.002);
    expect(out.riskFreeRate).toBe(0.05);
  });

  it('runs only the steps that are needed', () => {
    const out = migrate({ theme: 'light', feeRate: 0.003 }, 2);
    expect(out).toEqual({ theme: 'light', feeRate: 0.003, riskFreeRate: 0.05 });
  });

  it('leaves current-version data untouched and keeps user values', () => {
    const saved = { theme: 'light', feeRate: 0.005, riskFreeRate: 0.01 };
    expect(migrate(saved, 3)).toEqual(saved);
  });

  it('fills fields missing from saved data with defaults', () => {
    expect(migrate({ theme: 'light' }, 3)).toEqual({ ...defaults, theme: 'light' });
  });

  it('falls back to defaults for unusable data', () => {
    expect(migrate(null, 1)).toEqual(defaults);
    expect(migrate('garbage', 1)).toEqual(defaults);
  });

  it('does not run steps on data from a newer version', () => {
    const out = migrate({ theme: 'light', feeRate: 0.004, somethingNew: true }, 9);
    expect(out.theme).toBe('light');
    expect(out.feeRate).toBe(0.004);
  });
});
