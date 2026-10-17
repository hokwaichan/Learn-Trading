// Translations of content/, one file per lesson module plus the shared lists.
// Each maps textKey(english) to Chinese, with the English as a comment above.
import m01_basics from './01-basics';
import m02_candlesticks from './02-candlesticks';
import m03_market_structure from './03-market-structure';
import m04_chart_patterns from './04-chart-patterns';
import m05_indicators from './05-indicators';
import m06_strategies from './06-strategies';
import m07_risk_management from './07-risk-management';
import m08_futures from './08-futures';
import m09_options from './09-options';
import m10_psychology from './10-psychology';
import m11_fundamentals from './11-fundamentals';
import m12_bigger_picture from './12-bigger-picture';
import m13_smart_money from './13-smart-money';
import m14_ict from './14-ict';
import m15_day_trading from './15-day-trading';
import m16_trade_management from './16-trade-management';
import m17_markets_in_practice from './17-markets-in-practice';
import m18_staying_in_the_game from './18-staying-in-the-game';
import glossary from './glossary';
import indicators from './indicators';
import patterns from './patterns';
import strategies from './strategies';

export const CONTENT: Record<string, Record<string, string>> = {
  '01-basics': m01_basics,
  '02-candlesticks': m02_candlesticks,
  '03-market-structure': m03_market_structure,
  '04-chart-patterns': m04_chart_patterns,
  '05-indicators': m05_indicators,
  '06-strategies': m06_strategies,
  '07-risk-management': m07_risk_management,
  '08-futures': m08_futures,
  '09-options': m09_options,
  '10-psychology': m10_psychology,
  '11-fundamentals': m11_fundamentals,
  '12-bigger-picture': m12_bigger_picture,
  '13-smart-money': m13_smart_money,
  '14-ict': m14_ict,
  '15-day-trading': m15_day_trading,
  '16-trade-management': m16_trade_management,
  '17-markets-in-practice': m17_markets_in_practice,
  '18-staying-in-the-game': m18_staying_in_the_game,
  'glossary': glossary,
  'indicators': indicators,
  'patterns': patterns,
  'strategies': strategies,
};
