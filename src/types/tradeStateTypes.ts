export interface TradeStateData {
  liquidationPriceEstimate: string | number;
  expectedOi: string | number;
  maxInputIncludingFees: number;
  priceInfo: {
    price: string | number | bigint;
    minPrice: string | number | bigint;
    priceImpactPercentage: string;
  };
  tradeState: string;
  tradingFeeRate: number;
  estimatedCollateral: number;
}

export interface SuccessUnwindStateData {
  pnl: string | number;
  side: string;
  value: string | number;
  oi: string | number;
  leverage: string;
  debt: string | number;
  cost: string | number;
  currentCollateral: string | number;
  currentNotional: string | number;
  initialCollateral: string | number;
  initialNotional: string | number;
  maintenanceMargin: string | number;
  entryPrice: string | number | bigint;
  currentPrice: string | number | bigint;
  estimatedReceivedPrice: string | number | bigint;
  priceImpact: string;
  liquidationPrice: string | number | bigint;
  unwindState: string;
}

export interface ErrorUnwindStateData {
  error: string;
  isShutdown: boolean;
  cost: string | number | bigint;
  unwindState: string;
}

export type UnwindStateData = | SuccessUnwindStateData | ErrorUnwindStateData 
