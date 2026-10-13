import { useCallback, useState } from 'react';
import { FlaskConical, SearchX } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PriceChart } from '@/components/chart';
import { EmptyState, ErrorState, GlossaryTerm, LoadingState, Select, TabPanel, Tabs, useMediaQuery } from '@/components/ui';
import { OPTION_STRATEGIES } from '@/content/strategies';
import { displaySymbol, findInstrument, instrumentsOfKind } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { templateToDrafts } from '@/lib/pricing/draft';
import { MAX_LEGS } from '@/lib/pricing/strategy';
import { useAccount, useMarket } from '@/stores';
import type { Instrument, OptionQuote, Side } from '@/types';
import { useOptionMarket, VOLATILITY_LOOKBACK } from '../hooks/useOptionMarket';
import { BuilderPanel, newLegId, type BuilderState } from './BuilderPanel';
import { OptionChain } from './OptionChain';
import { OptionPositions } from './OptionPositions';

/** The expiry shown first: the third, about a month out. */
const DEFAULT_EXPIRY = 2;
const EMPTY: BuilderState = { legs: [], stock: null, templateId: null, name: '' };

type LowerTab = 'chain' | 'positions';
type PhoneTab = 'chain' | 'builder' | 'chart' | 'positions';

function SimulatedNotice({ volatility, measured }: { volatility: number; measured: boolean }) {
  return (
    <p role="note" className="flex shrink-0 items-start gap-2 border-b border-border bg-warning/10 px-3 py-1.5 text-xs text-fg">
      <FlaskConical aria-hidden className="mt-0.5 size-3.5 shrink-0 text-warning-text" />
      <span>
        <span className="font-semibold text-warning-text">Simulated prices, not market quotes.</span> Every price here comes from the{' '}
        <GlossaryTerm id="black-scholes">Black-Scholes</GlossaryTerm> model, using{' '}
        {measured ? (
          <>
            the last {VOLATILITY_LOOKBACK} days&apos; <GlossaryTerm id="historical-volatility">historical volatility</GlossaryTerm> of{' '}
            <span className="num font-medium">{(volatility * 100).toFixed(1)}%</span>
          </>
        ) : (
          <>
            a stand-in volatility of <span className="num font-medium">{(volatility * 100).toFixed(0)}%</span> until enough history has loaded
          </>
        )}
        . Real option prices differ.
      </span>
    </p>
  );
}

function OptionsWorkspace({ instrument }: { instrument: Instrument }) {
  const navigate = useNavigate();
  const wide = useMediaQuery('(min-width: 1024px)');
  const market = useOptionMarket(instrument);
  const load = useMarket((s) => s.load);
  const openCount = useAccount((s) => s.accounts.main.positions.filter((p) => p.option).length);
  const [builder, setBuilder] = useState<BuilderState>(EMPTY);
  const [expiryIndex, setExpiryIndex] = useState(DEFAULT_EXPIRY);
  const [lower, setLower] = useState<LowerTab>('chain');
  const [phoneTab, setPhoneTab] = useState<PhoneTab>('chain');
  const { chain, spot, series, multiplier } = market;

  const change = useCallback((patch: Partial<BuilderState>) => setBuilder((b) => ({ ...b, ...patch })), []);

  const applyTemplate = (id: string) => {
    const template = OPTION_STRATEGIES.find((t) => t.id === id);
    if (!template || spot == null) return;
    const drafts = templateToDrafts(template.legs, chain, expiryIndex, spot, multiplier, newLegId);
    setBuilder({ legs: drafts.legs, stock: drafts.stock, templateId: id, name: template.name });
  };

  const pick = (quote: OptionQuote, side: Side) => {
    const { contract } = quote;
    setBuilder((b) => {
      const same = b.legs.find((l) => l.expiry === contract.expiry && l.strike === contract.strike && l.type === contract.type);
      // Clicking the same price again removes the leg; the other side flips it.
      if (same) {
        const legs = same.side === side ? b.legs.filter((l) => l !== same) : b.legs.map((l) => (l === same ? { ...l, side } : l));
        return { ...b, legs, templateId: null };
      }
      if (b.legs.length >= MAX_LEGS) return b;
      return { ...b, legs: [...b.legs, { id: newLegId(), side, type: contract.type, strike: contract.strike, expiry: contract.expiry, quantity: 1 }], templateId: null };
    });
  };

  const header = (
    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-surface px-3 py-1.5">
      <Select
        aria-label="Underlying"
        className="num w-36 font-medium"
        value={instrument.symbol}
        onChange={(symbol) => navigate(`/options/${symbol}`)}
        options={instrumentsOfKind('spot').map((i) => ({ value: i.symbol, label: displaySymbol(i) }))}
      />
      <span className="flex items-baseline gap-1.5 text-xs text-muted">
        Price <span className="num text-base font-medium text-fg">{spot != null ? formatPrice(spot, instrument.tickSize) : '–'}</span>
      </span>
      <span className="flex items-baseline gap-1.5 text-xs text-muted">
        <GlossaryTerm id="historical-volatility">30-day volatility</GlossaryTerm> <span className="num text-sm text-fg">{(market.volatility * 100).toFixed(1)}%</span>
      </span>
      {!instrument.live && <span className="text-xs text-muted">Bundled daily history: last close, no live price.</span>}
    </div>
  );

  if (series.status === 'error' && series.candles.length === 0) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <ErrorState className="flex-1" title="Could not load prices" message={series.error} onRetry={() => void load(instrument, '1d')} />
      </div>
    );
  }
  if (spot == null || chain.length === 0) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <LoadingState className="flex-1" label={`Loading ${displaySymbol(instrument)} prices`} />
      </div>
    );
  }

  const chart = <PriceChart candles={series.candles} chartType="candles" timeframe="1d" tickSize={instrument.tickSize} title={displaySymbol(instrument)} viewKey={`options:${instrument.symbol}`} showVolume={false} embedded={!wide} />;
  const chainView = <OptionChain chain={chain} expiryIndex={expiryIndex} onExpiry={setExpiryIndex} onPick={pick} legs={builder.legs} tickSize={instrument.tickSize} compact={!wide} />;
  const builderView = <BuilderPanel instrument={instrument} market={market} state={builder} onChange={change} onTemplate={applyTemplate} expiryIndex={expiryIndex} />;
  const notice = <SimulatedNotice volatility={market.volatility} measured={market.measured} />;
  const hint = <p className="shrink-0 border-t border-border px-3 py-1.5 text-xs text-muted">Click an Ask to buy that option or a Bid to sell it. It is added to the builder as a leg; click it again to remove it.</p>;

  if (!wide) {
    return (
      <div className="flex h-full flex-col">
        {header}
        {notice}
        <Tabs<PhoneTab>
          label="Options sections"
          idBase="options"
          className="shrink-0"
          value={phoneTab}
          onChange={setPhoneTab}
          items={[
            { id: 'chain', label: 'Chain' },
            { id: 'builder', label: 'Builder', badge: builder.legs.length || undefined },
            { id: 'chart', label: 'Chart' },
            { id: 'positions', label: 'Positions', badge: openCount || undefined },
          ]}
        />
        <TabPanel idBase="options" id="chain" active={phoneTab === 'chain'} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">{chainView}</div>
          {hint}
        </TabPanel>
        <TabPanel idBase="options" id="builder" active={phoneTab === 'builder'} className="min-h-0 flex-1 overflow-y-auto">
          {builderView}
        </TabPanel>
        <TabPanel idBase="options" id="chart" active={phoneTab === 'chart'} className="min-h-0 flex-1">
          {chart}
        </TabPanel>
        <TabPanel idBase="options" id="positions" active={phoneTab === 'positions'} className="min-h-0 flex-1 overflow-y-auto">
          <OptionPositions />
        </TabPanel>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {header}
      {notice}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_26rem]">
        <div className="flex min-h-0 flex-col border-r border-border">
          <div className="h-[38%] min-h-40 shrink-0 border-b border-border">{chart}</div>
          <Tabs<LowerTab>
            label="Chain and positions"
            idBase="options-lower"
            className="shrink-0"
            value={lower}
            onChange={setLower}
            items={[
              { id: 'chain', label: 'Option chain' },
              { id: 'positions', label: 'Open positions', badge: openCount || undefined },
            ]}
          />
          <TabPanel idBase="options-lower" id="chain" active={lower === 'chain'} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">{chainView}</div>
            {hint}
          </TabPanel>
          <TabPanel idBase="options-lower" id="positions" active={lower === 'positions'} className="min-h-0 flex-1 overflow-y-auto">
            <OptionPositions />
          </TabPanel>
        </div>
        <aside aria-label="Strategy builder" className="min-h-0 overflow-y-auto">
          {builderView}
        </aside>
      </div>
    </div>
  );
}

export function OptionsPage() {
  const { symbol = '' } = useParams();
  const instrument = findInstrument(symbol, 'spot');
  if (!instrument) {
    return (
      <EmptyState
        className="h-full"
        icon={<SearchX />}
        title={`No options for "${symbol}"`}
        description="Pick one of the available symbols:"
        action={
          <div className="flex max-w-md flex-wrap justify-center gap-2">
            {instrumentsOfKind('spot').map((i) => (
              <Link key={i.symbol} to={`/options/${i.symbol}`} className="num text-sm text-accent-text underline underline-offset-4">
                {displaySymbol(i)}
              </Link>
            ))}
          </div>
        }
      />
    );
  }
  // The key gives each symbol a fresh builder.
  return <OptionsWorkspace key={instrument.symbol} instrument={instrument} />;
}
