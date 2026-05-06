import { formatPriceWithCurrency } from "./formatPriceWithCurrency";

export interface MarketOpenInterestInput {
  parsedMid?: string | number;
  mid?: string | number;
  parsedOiLong?: string | number;
  parsedOiShort?: string | number;
}

export const formatUsdOpenInterest = (value?: number) => {
  if (value === undefined || !Number.isFinite(value) || value < 0) return "-";

  return formatPriceWithCurrency(value, "$");
};

export const getMarketOpenInterestUsd = (
  market: MarketOpenInterestInput | undefined,
  ovlUsd?: number
) => {
  // Mirrors data-api-backend aggregator/contractsService:
  // openInterestUsd = (oiLong + oiShort) * mid * ovlUsd.
  const longOi = Number(market?.parsedOiLong ?? 0);
  const shortOi = Number(market?.parsedOiShort ?? 0);
  const totalOi = longOi + shortOi;
  const openInterestPrice = Number(market?.parsedMid ?? market?.mid);
  const canCalculateOpenInterestUsd =
    Number.isFinite(openInterestPrice) &&
    openInterestPrice > 0 &&
    typeof ovlUsd === "number" &&
    Number.isFinite(ovlUsd) &&
    ovlUsd > 0;
  const longOiUsd = canCalculateOpenInterestUsd
    ? longOi * openInterestPrice * ovlUsd
    : undefined;
  const shortOiUsd = canCalculateOpenInterestUsd
    ? shortOi * openInterestPrice * ovlUsd
    : undefined;
  const totalOiUsd =
    longOiUsd !== undefined && shortOiUsd !== undefined
      ? longOiUsd + shortOiUsd
      : undefined;

  return {
    longOi,
    shortOi,
    totalOi,
    longOiUsd,
    shortOiUsd,
    totalOiUsd,
  };
};
