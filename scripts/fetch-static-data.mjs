// Downloads real daily history for the bundled (offline) instruments and
// writes it to public/data/<SYMBOL>.json. Run it again to refresh the files:
//
//   npm run fetch-data
//
// Source: Yahoo Finance's public chart endpoint (no key). Prices are
// split-adjusted. The files are for personal, educational use.
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = 'public/data';
const YEARS = 10;

/** Our symbol -> Yahoo symbol, and how many decimals to keep. */
const SYMBOLS = [
  { symbol: 'AAPL', yahoo: 'AAPL', decimals: 2 },
  { symbol: 'TSLA', yahoo: 'TSLA', decimals: 2 },
  { symbol: 'SPY', yahoo: 'SPY', decimals: 2 },
  // Yahoo's daily forex bars carry an "open" that is almost always equal to
  // the close (it is one snapshot per day, not a real opening price). Forex
  // trades around the clock, so each day really opens where the last one
  // closed: the open is rebuilt from the previous close.
  { symbol: 'EURUSD', yahoo: 'EURUSD=X', decimals: 5, openFromPreviousClose: true },
];

async function fetchDaily({ symbol, yahoo, decimals, openFromPreviousClose }) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?range=${YEARS}y&interval=1d`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const result = (await res.json()).chart?.result?.[0];
  if (!result?.timestamp) throw new Error(`${symbol}: no data in response`);

  const quote = result.indicators.quote[0];
  const offset = result.meta.gmtoffset ?? 0;
  const round = (n) => Number(n.toFixed(decimals));
  const byDay = new Map();

  result.timestamp.forEach((ts, i) => {
    const [o, h, l, c] = [quote.open[i], quote.high[i], quote.low[i], quote.close[i]];
    if ([o, h, l, c].some((v) => v == null || !Number.isFinite(v))) return;
    // Key each bar by its exchange-local calendar date, stored as UTC midnight.
    const day = Math.floor((ts + offset) / 86400) * 86400;
    byDay.set(day, [day, round(o), round(Math.max(o, h, l, c)), round(Math.min(o, h, l, c)), round(c), Math.round(quote.volume[i] ?? 0)]);
  });

  let candles = [...byDay.values()].sort((a, b) => a[0] - b[0]);
  if (openFromPreviousClose) {
    candles = candles.slice(1).map(([day, , high, low, close, volume], i) => {
      const open = candles[i][4];
      return [day, open, round(Math.max(high, open)), round(Math.min(low, open)), close, volume];
    });
  }
  if (candles.length < 200) throw new Error(`${symbol}: only ${candles.length} bars`);
  return {
    symbol,
    timeframe: '1d',
    source: 'Yahoo Finance',
    ...(openFromPreviousClose ? { note: 'Open is the previous close; the source has no real daily open for forex.' } : {}),
    fetchedAt: new Date().toISOString(),
    columns: ['time', 'open', 'high', 'low', 'close', 'volume'],
    candles,
  };
}

mkdirSync(OUT, { recursive: true });
let failed = 0;
for (const spec of SYMBOLS) {
  try {
    const file = await fetchDaily(spec);
    writeFileSync(`${OUT}/${spec.symbol}.json`, JSON.stringify(file));
    const first = new Date(file.candles[0][0] * 1000).toISOString().slice(0, 10);
    const last = new Date(file.candles.at(-1)[0] * 1000).toISOString().slice(0, 10);
    console.log(`${spec.symbol}: ${file.candles.length} daily bars, ${first} to ${last}`);
  } catch (err) {
    failed++;
    console.error(`FAILED ${err.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
