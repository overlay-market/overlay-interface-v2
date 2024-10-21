const enum TradeState {
  PositionUnderwater = "Position Underwater",
  ExceedsOICap = "Exceeds OI Cap",
  ExceedsCircuitBreakerOICap = "Exceeds Circuit Breaker OI Cap",
  OVLBalanceBelowMinimum = "OVL Balance Below Minimum",
  NeedsApproval = "Approve OVL",
  Trade = "Trade",
  TradeHighPriceImpact = "Trade - High Price Impact",
  AmountExceedsMaxInput = "Amount Exceeds Max Input",
}

export interface TradeStateData {
  liquidationPriceEstimate: number;
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