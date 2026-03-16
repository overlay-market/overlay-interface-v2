import { MARKETS_WITH_GAMBLING_TIMELINE, PREDICTION_MARKET_GROUPS, PredictionMarketGroup } from "../constants/markets";

export const isGamblingMarket = (marketName?: string | null): boolean => {
  if (!marketName) {
    return false;
  }

  const encodedName = encodeURIComponent(marketName);
  return MARKETS_WITH_GAMBLING_TIMELINE.includes(encodedName);
};

export const isPredictionGroupMarket = (marketName?: string | null): boolean => {
  if (!marketName) return false;
  const encodedName = encodeURIComponent(marketName);
  return PREDICTION_MARKET_GROUPS.some((group) =>
    group.marketIds.includes(encodedName)
  );
};

export const getMarketGroup = (marketName?: string | null): PredictionMarketGroup | undefined => {
  if (!marketName) return undefined;
  const encodedName = encodeURIComponent(marketName);
  return PREDICTION_MARKET_GROUPS.find((group) =>
    group.marketIds.includes(encodedName)
  );
};

export const getGroupById = (groupId: string): PredictionMarketGroup | undefined => {
  return PREDICTION_MARKET_GROUPS.find((group) => group.groupId === groupId);
};
