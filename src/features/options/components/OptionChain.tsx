import { useEffect, useRef } from 'react';
import { cn, Tabs } from '@/components/ui';
import { intlLocale, t } from '@/i18n';
import { formatPrice } from '@/lib/format';
import type { ChainExpiry } from '@/lib/pricing/chain';
import type { DraftLeg } from '@/lib/pricing/draft';
import type { OptionQuote, Side } from '@/types';

export interface OptionChainProps {
  chain: ChainExpiry[];
  expiryIndex: number;
  onExpiry: (index: number) => void;
  /** Called when a price is clicked: the ask to buy, the bid to sell. */
  onPick: (quote: OptionQuote, side: Side) => void;
  /** Legs already in the builder, to mark their cells. */
  legs: DraftLeg[];
  tickSize: number;
  /** Leave out delta and volatility, for narrow screens. */
  compact?: boolean;
}

const dateLabel = (ms: number) => new Date(ms).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'short', timeZone: 'UTC' });
const daysLabel = (days: number) => (days < 1 ? t('<1d') : t('{n}d', { n: Math.round(days) }));

function PriceCell({ quote, side, picked, tickSize, compact, onPick }: { quote: OptionQuote; side: Side; picked: boolean; tickSize: number; compact?: boolean; onPick: OptionChainProps['onPick'] }) {
  const price = side === 'buy' ? quote.ask : quote.bid;
  // On a narrow screen large premiums drop their cents so all four prices fit.
  const shown = compact && price >= 1000 ? formatPrice(price, 1) : formatPrice(price, tickSize);
  const { contract } = quote;
  const name = `${contract.strike} ${contract.type === 'call' ? t('call') : t('put')}`;
  // Nothing can be sold for a bid of zero.
  const disabled = side === 'sell' && price <= 0;
  return (
    <td className="p-0.5 text-right">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={picked}
        aria-label={
          side === 'buy'
            ? t('Buy the {name} at {price}', { name, price: formatPrice(price, tickSize) })
            : t('Sell the {name} at {price}', { name, price: formatPrice(price, tickSize) })
        }
        onClick={() => onPick(quote, side)}
        className={cn(
          'num w-full rounded-control py-1 text-right text-xs transition-colors duration-150 disabled:opacity-40',
          compact ? 'px-1' : 'px-1.5',
          picked ? 'bg-accent font-medium text-on-solid' : 'text-fg hover:bg-accent/20',
        )}
      >
        {shown}
      </button>
    </td>
  );
}

/**
 * One expiry of the simulated chain: calls on the left, puts on the right,
 * strikes down the middle, with the at-the-money row marked.
 */
export function OptionChain({ chain, expiryIndex, onExpiry, onPick, legs, tickSize, compact }: OptionChainProps) {
  const expiry = chain[Math.min(expiryIndex, chain.length - 1)] as ChainExpiry | undefined;
  // Start with the at-the-money row in the middle of the list.
  const scroller = useRef<HTMLDivElement>(null);
  const expiryTime = expiry?.expiry;
  useEffect(() => {
    const box = scroller.current;
    const row = box?.querySelector<HTMLElement>('tr[data-atm]');
    if (box && row) box.scrollTop = row.offsetTop - box.clientHeight / 2 + row.offsetHeight / 2;
  }, [expiryTime]);

  if (!expiry) return null;
  const picked = (quote: OptionQuote, side: Side) => legs.some((l) => l.expiry === quote.contract.expiry && l.strike === quote.contract.strike && l.type === quote.contract.type && l.side === side);
  const stat = 'num px-1.5 py-1 text-right text-xs text-muted';
  const head = 'px-1.5 py-1 text-right text-[11px] font-medium text-muted';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Tabs
        label={t('Expiry date')}
        idBase="chain-expiry"
        className="shrink-0"
        value={String(expiryIndex)}
        onChange={(id) => onExpiry(Number(id))}
        items={chain.map((e, i) => ({ id: String(i), label: dateLabel(e.expiry), badge: daysLabel(e.days) }))}
      />
      <div ref={scroller} className="min-h-0 flex-1 overflow-auto" role="tabpanel" id={`chain-expiry-panel-${expiryIndex}`} aria-labelledby={`chain-expiry-tab-${expiryIndex}`}>
        <table className="w-full border-collapse" aria-label={t('Simulated option chain expiring {date}', { date: dateLabel(expiry.expiry) })}>
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              <th scope="colgroup" colSpan={compact ? 2 : 4} className="border-b border-border px-2 py-1 text-left text-xs font-semibold text-up-text">
                {t('Calls')} <span className="font-normal text-muted">{t('(right to buy)')}</span>
              </th>
              <th className="border-b border-border" />
              <th scope="colgroup" colSpan={compact ? 2 : 4} className="border-b border-border px-2 py-1 text-right text-xs font-semibold text-down-text">
                {t('Puts')} <span className="font-normal text-muted">{t('(right to sell)')}</span>
              </th>
            </tr>
            <tr className="border-b border-border">
              {!compact && <th scope="col" className={head}>{t('Delta')}</th>}
              {!compact && <th scope="col" className={head}>{t('IV')}</th>}
              <th scope="col" className={head}>{t('Bid')}</th>
              <th scope="col" className={head}>{t('Ask')}</th>
              <th scope="col" className="px-2 py-1 text-center text-[11px] font-medium text-fg">{t('Strike')}</th>
              <th scope="col" className={head}>{t('Bid')}</th>
              <th scope="col" className={head}>{t('Ask')}</th>
              {!compact && <th scope="col" className={head}>{t('IV')}</th>}
              {!compact && <th scope="col" className={head}>{t('Delta')}</th>}
            </tr>
          </thead>
          <tbody>
            {expiry.rows.map((row) => {
              // In-the-money cells are tinted: calls below the price, puts above it.
              const callItm = row.call.moneyness === 'ITM';
              const putItm = row.put.moneyness === 'ITM';
              return (
                <tr key={row.strike} data-atm={row.atm || undefined} className={cn('border-b border-border/50', row.atm && 'outline outline-1 -outline-offset-1 outline-accent')}>
                  {!compact && <td className={cn(stat, callItm && 'bg-raised')}>{row.call.greeks.delta.toFixed(2)}</td>}
                  {!compact && <td className={cn(stat, callItm && 'bg-raised')}>{(row.call.iv * 100).toFixed(1)}%</td>}
                  <PriceCell quote={row.call} side="sell" picked={picked(row.call, 'sell')} tickSize={tickSize} compact={compact} onPick={onPick} />
                  <PriceCell quote={row.call} side="buy" picked={picked(row.call, 'buy')} tickSize={tickSize} compact={compact} onPick={onPick} />
                  <th scope="row" className={cn('num px-2 py-1 text-center text-xs font-medium', row.atm ? 'bg-accent/15 text-fg' : 'bg-bg text-fg')}>
                    {formatPrice(row.strike, tickSize).replace(/\.0+$/, '')}
                    {row.atm && <span className="ml-1 rounded-sm bg-accent px-1 text-[10px] font-semibold text-on-solid">{t('ATM')}</span>}
                  </th>
                  <PriceCell quote={row.put} side="sell" picked={picked(row.put, 'sell')} tickSize={tickSize} compact={compact} onPick={onPick} />
                  <PriceCell quote={row.put} side="buy" picked={picked(row.put, 'buy')} tickSize={tickSize} compact={compact} onPick={onPick} />
                  {!compact && <td className={cn(stat, putItm && 'bg-raised')}>{(row.put.iv * 100).toFixed(1)}%</td>}
                  {!compact && <td className={cn(stat, putItm && 'bg-raised')}>{row.put.greeks.delta.toFixed(2)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
