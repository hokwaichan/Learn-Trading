/** Number formatting shared by every screen. All output is plain text. */

const MINUS = '-';

function group(value: number, decimals: number): string {
  return Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** $1,234.50 or -$1,234.50 */
export function formatMoney(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '-';
  return `${value < 0 ? MINUS : ''}$${group(value, decimals)}`;
}

/** Always signed, so P&L never relies on colour: +$12.00, -$3.50, $0.00 */
export function formatSignedMoney(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '-';
  const rounded = Number(value.toFixed(decimals));
  const sign = rounded > 0 ? '+' : rounded < 0 ? MINUS : '';
  return `${sign}$${group(rounded, decimals)}`;
}

/** Takes a fraction: 0.0123 -> +1.23% */
export function formatSignedPct(fraction: number, decimals = 2): string {
  if (!Number.isFinite(fraction)) return '-';
  const pct = Number((fraction * 100).toFixed(decimals));
  const sign = pct > 0 ? '+' : pct < 0 ? MINUS : '';
  return `${sign}${group(pct, decimals)}%`;
}

/** Takes a fraction: 0.5 -> 50.0% */
export function formatPct(fraction: number, decimals = 1): string {
  if (!Number.isFinite(fraction)) return '-';
  return `${fraction < 0 ? MINUS : ''}${group(fraction * 100, decimals)}%`;
}

/** Number of decimal places implied by a tick or step size (0.01 -> 2). */
export function decimalsFor(step: number): number {
  if (!(step > 0) || step >= 1) return 0;
  return Math.min(8, Math.max(0, Math.round(-Math.log10(step))));
}

/** A price shown at the instrument's tick precision. */
export function formatPrice(value: number, tickSize = 0.01): string {
  if (!Number.isFinite(value)) return '-';
  return `${value < 0 ? MINUS : ''}${group(value, decimalsFor(tickSize))}`;
}

/** A quantity shown at the instrument's step precision, without trailing zeros. */
export function formatQty(value: number, stepSize = 0.0001): string {
  if (!Number.isFinite(value)) return '-';
  const fixed = value.toFixed(decimalsFor(stepSize));
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

/** Compact volume: 1.2K, 3.4M, 5.6B */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

/** Rounds down to a multiple of step (used for order quantities). */
export function floorToStep(value: number, step: number): number {
  if (!(step > 0)) return value;
  const d = decimalsFor(step);
  return Number((Math.floor(value / step + 1e-9) * step).toFixed(d));
}

/** Rounds to the nearest multiple of tick (used for prices). */
export function roundToTick(value: number, tick: number): number {
  if (!(tick > 0)) return value;
  return Number((Math.round(value / tick) * tick).toFixed(decimalsFor(tick)));
}
