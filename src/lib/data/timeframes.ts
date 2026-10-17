import { t } from '@/i18n';
import type { Timeframe } from '@/types';

export const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

export const TIMEFRAME_SECONDS: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14_400,
  '1d': 86_400,
};

export const TIMEFRAME_NAMES: Record<Timeframe, string> = {
  '1m': t('1 minute'),
  '5m': t('5 minutes'),
  '15m': t('15 minutes'),
  '1h': t('1 hour'),
  '4h': t('4 hours'),
  '1d': t('1 day'),
};

export function isTimeframe(value: string): value is Timeframe {
  return (TIMEFRAMES as string[]).includes(value);
}
