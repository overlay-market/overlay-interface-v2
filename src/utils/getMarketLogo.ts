import { DEFAULT_LOGO, MARKETS_FULL_LOGOS } from "../constants/markets";

export const getMarketLogo = (marketId: string): string => {
  return MARKETS_FULL_LOGOS[marketId] ?? DEFAULT_LOGO;
};