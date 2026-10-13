import type { AccountId, Direction, InstrumentKind, MarginMode, Side, UnixMs } from './market';
import type { Strategy } from './options';

export type OrderType = 'market' | 'limit' | 'stop' | 'take_profit';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'rejected' | 'expired';

export interface Order {
  id: string;
  accountId: AccountId;
  symbol: string;
  kind: InstrumentKind;
  side: Side;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  reduceOnly: boolean;
  /** Set for a stop-loss or take-profit attached to a position. */
  positionId?: string;
  leverage?: number;
  marginMode?: MarginMode;
  /** Set for multi-leg option orders. */
  strategyId?: string;
  status: OrderStatus;
  createdAt: UnixMs;
  filledAt?: UnixMs;
  avgFillPrice?: number;
  fee?: number;
  slippage?: number;
  rejectReason?: string;
}

export interface FuturesPositionState {
  leverage: number;
  marginMode: MarginMode;
  /** Margin allocated to this position (isolated), or its share (cross). */
  margin: number;
  maintenanceMargin: number;
  liquidationPrice: number;
  /** Cumulative funding; positive means paid. */
  fundingPaid: number;
  lastFundingAt: UnixMs;
}

export interface Position {
  id: string;
  accountId: AccountId;
  symbol: string;
  kind: InstrumentKind;
  direction: Direction;
  quantity: number;
  /** Average entry price. */
  entryPrice: number;
  openedAt: UnixMs;
  stopLoss?: number;
  takeProfit?: number;
  /** Dollars at risk at entry; used for R-multiples. */
  initialRisk?: number;
  /** Realised from partial closes. */
  realizedPnl: number;
  feesPaid: number;
  futures?: FuturesPositionState;
  option?: { strategy: Strategy; lastMarkedAt: UnixMs; markValue: number };
}

export type ExitReason =
  | 'manual'
  | 'stop_loss'
  | 'take_profit'
  | 'liquidation'
  | 'expiry'
  | 'assignment'
  | 'account_reset';

/** One closed round trip. */
export interface Trade {
  id: string;
  accountId: AccountId;
  positionId: string;
  symbol: string;
  kind: InstrumentKind;
  direction: Direction;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  openedAt: UnixMs;
  closedAt: UnixMs;
  grossPnl: number;
  fees: number;
  funding: number;
  netPnl: number;
  /** Net P&L as a fraction of the margin or cost committed. */
  returnPct: number;
  initialRisk?: number;
  /** netPnl / initialRisk */
  rMultiple?: number;
  leverage?: number;
  exitReason: ExitReason;
  strategyTemplateId?: string;
}

export interface LedgerEntry {
  id: string;
  time: UnixMs;
  type: 'realized_pnl' | 'fee' | 'funding' | 'liquidation' | 'premium' | 'reset';
  amount: number;
  refId?: string;
  note?: string;
}

export interface EquityPoint {
  time: UnixMs;
  equity: number;
}

export interface Account {
  id: AccountId;
  startingBalance: number;
  cash: number;
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  ledger: LedgerEntry[];
  equityHistory: EquityPoint[];
  createdAt: UnixMs;
  resetCount: number;
}

/** Derived from an Account plus current prices; never stored. */
export interface AccountSnapshot {
  equity: number;
  unrealizedPnl: number;
  todayPnl: number;
  marginUsed: number;
  freeMargin: number;
}
