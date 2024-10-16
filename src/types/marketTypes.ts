export interface MarketData {
  ask: bigint;
  bid: bigint; 
  capOi: bigint;
  circuitBreakerLevel: bigint;
  currency: string;
  descriptionText: string;
  disabled: boolean;
  fullLogo: string;
  fundingRate: bigint;
  id: string;
  logo: string;
  marketId: string;
  marketLogo: string;
  marketName: string;
  mid: bigint;
  oiLong: bigint;
  oiShort: bigint;
  oracleLogo: string;
  parsedAnnualFundingRate: string;
  parsedAsk: string;
  parsedBid: string;
  parsedCapOi: string;
  parsedDailyFundingRate: string;
  parsedMid: string;
  parsedOiLong: string;
  parsedOiShort: string;
  priceCurrency: string;
  volumeAsk: bigint;
  volumeBid: bigint;
}

export interface MarketDataParsed {
  ask: string;
  bid: string; 
  capOi: string;
  circuitBreakerLevel: string;
  currency: string;
  descriptionText: string;
  disabled: boolean;
  fullLogo: string;
  fundingRate: string;
  id: string;
  logo: string;
  marketId: string;
  marketLogo: string;
  marketName: string;
  mid: string;
  oiLong: string;
  oiShort: string;
  oracleLogo: string;
  parsedAnnualFundingRate: string;
  parsedAsk: string;
  parsedBid: string;
  parsedCapOi: string;
  parsedDailyFundingRate: string;
  parsedMid: string;
  parsedOiLong: string;
  parsedOiShort: string;
  priceCurrency: string;
  volumeAsk: string;
  volumeBid: string;
}