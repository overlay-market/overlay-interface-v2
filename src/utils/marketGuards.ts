import { MARKETS_WITH_GAMBLING_TIMELINE } from "../constants/markets";

export const isGamblingMarket = (marketName?: string | null): boolean => {
  if (!marketName) {
    return false;
  }

  const encodedName = encodeURIComponent(marketName);
  return MARKETS_WITH_GAMBLING_TIMELINE.includes(encodedName);
};
