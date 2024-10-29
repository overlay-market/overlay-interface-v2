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