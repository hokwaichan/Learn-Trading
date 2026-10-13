import type { Direction, Timeframe, UnixMs } from './market';
import type { EquityPoint } from './trading';

export type IndicatorId =
  | 'sma'
  | 'ema'
  | 'bollinger'
  | 'vwap'
  | 'rsi'
  | 'macd'
  | 'stochastic'
  | 'atr'
  | 'volumeMa'
  | 'donchian'
  | 'prevDay'
  | 'openingRange';

export type Operand =
  | { kind: 'price'; field: 'open' | 'high' | 'low' | 'close' | 'volume' }
  | {
      kind: 'indicator';
      indicator: IndicatorId;
      params: Record<string, number>;
      /** Which line of a multi-line indicator, e.g. 'upper' or 'signal'. */
      output?: string;
    }
  | { kind: 'constant'; value: number };

export type Comparator = 'gt' | 'gte' | 'lt' | 'lte' | 'crosses_above' | 'crosses_below';

export interface Condition {
  id: string;
  left: Operand;
  op: Comparator;
  right: Operand;
}

export interface BacktestRule {
  conditions: Condition[];
  combine: 'all' | 'any';
}

export interface BacktestStrategy {
  id: string;
  name: string;
  description: string;
  direction: Direction;
  entry: BacktestRule;
  exit: BacktestRule;
  stopLossPct?: number;
  takeProfitPct?: number;
  /** Share of equity committed per trade, 0-100. */
  positionSizePct: number;
  preset: boolean;
}

export interface BacktestConfig {
  symbol: string;
  timeframe: Timeframe;
  from: UnixMs;
  to: UnixMs;
  initialCapital: number;
  feeRate: number;
  slippagePct: number;
  futures?: {
    leverage: number;
    maintenanceMarginRate: number;
    applyFunding: boolean;
    /** Funding per eight hours as a fraction. Positive means longs pay. Defaults to 0.01%. */
    fundingRate?: number;
  };
}

export interface BacktestTrade {
  entryTime: number;
  exitTime: number;
  direction: Direction;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  returnPct: number;
  fees: number;
  funding: number;
  exitReason: 'rule' | 'stop_loss' | 'take_profit' | 'liquidation' | 'end_of_data';
}

export interface BacktestStats {
  totalReturnPct: number;
  buyHoldReturnPct: number;
  tradeCount: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  expectancy: number;
  maxDrawdownPct: number;
  sharpe: number;
  liquidations: number;
  totalFees: number;
  totalFunding: number;
}

export interface BacktestResult {
  id: string;
  ranAt: UnixMs;
  strategy: BacktestStrategy;
  config: BacktestConfig;
  trades: BacktestTrade[];
  equityCurve: EquityPoint[];
  buyHoldCurve: EquityPoint[];
  stats: BacktestStats;
}
