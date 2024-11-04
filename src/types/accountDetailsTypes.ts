export type OverviewDataByPeriod = {
  realizedPnl: number;
  date: Date;
}[]

export interface OverviewData {
  numberOfOpenPositions: string | number;
  realizedPnl: string | number;
  totalValueLocked: string;
  unrealizedPnL: string;
  lockedPlusUnrealized: string;
  dataByPeriod: OverviewDataByPeriod;
} 

export type IntervalType = '1D' | '1W' | '1M' | '6M' | '1Y'
