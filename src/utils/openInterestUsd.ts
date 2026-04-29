import { formatPriceWithCurrency } from "./formatPriceWithCurrency";

export interface MarketOpenInterestInput {
  currency?: string;
  parsedMid?: string | number;
  mid?: string | number;
  priceCurrency?: string;
  parsedOiLong?: string | number;
  parsedOiShort?: string | number;
}

export const formatUsdOpenInterest = (value?: number) => {
  if (value === undefined || !Number.isFinite(value) || value < 0) return "-";

  return formatPriceWithCurrency(value, "$");
};

const normalizeCurrency = (value?: string) => {
  if (!value) return "";

  try {
    return decodeURIComponent(value)
      .toUpperCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  } catch {
    return value
      .toUpperCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
};

const USD_QUOTE_CURRENCIES = new Set(["USD", "USDC", "DAI", "PERCENTAGE"]);

const getQuoteUsdMultiplier = (market?: MarketOpenInterestInput) => {
  const normalizedCurrency = normalizeCurrency(market?.currency);

  if (
    market?.priceCurrency === "$" ||
    market?.priceCurrency === "%" ||
    USD_QUOTE_CURRENCIES.has(normalizedCurrency)
  ) {
    return 1;
  }

  return undefined;
};

export const getMarketOpenInterestUsd = (
  market: MarketOpenInterestInput | undefined
) => {
  // Mirrors data-api-backend aggregator/contractsService:
  // openInterestUsd = (oiLong + oiShort) * mid * quoteUsd.
  const longOi = Number(market?.parsedOiLong ?? 0);
  const shortOi = Number(market?.parsedOiShort ?? 0);
  const totalOi = longOi + shortOi;
  const openInterestPrice = Number(market?.parsedMid ?? market?.mid);
  const quoteUsdMultiplier = getQuoteUsdMultiplier(market);
  const canCalculateOpenInterestUsd =
    Number.isFinite(openInterestPrice) &&
    openInterestPrice > 0 &&
    quoteUsdMultiplier !== undefined;
  const longOiUsd = canCalculateOpenInterestUsd
    ? longOi * openInterestPrice * quoteUsdMultiplier
    : undefined;
  const shortOiUsd = canCalculateOpenInterestUsd
    ? shortOi * openInterestPrice * quoteUsdMultiplier
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
