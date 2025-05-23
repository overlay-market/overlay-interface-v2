import { Address } from "viem";
export interface MarketDataParsed {
  ask: string;
  bid: string; 
  capOi: string;
  circuitBreakerLevel: string;
  currency: string;
  descriptionText?: string;
  disabled: boolean;
  fullLogo?: string;
  fundingRate: string;
  id: string;
  logo: string;
  marketId: string;
  marketLogo: string;
  marketName: string;
  marketAddress: Address;
  oracleLogo: string;
  mid: string;
  oiLong: string;
  oiShort: string;
  parsedAnnualFundingRate?: string;
  parsedAsk?: string;
  parsedBid?: string;
  parsedCapOi?: string;
  parsedDailyFundingRate?: string;
  parsedMid?: string;
  parsedOiLong?: string;
  parsedOiShort?: string;
  priceCurrency: string;
  capleverage?: string;
  volumeAsk: string;
  volumeBid: string;
  buttons?: {
    long: string;
    short: string;
  };
}