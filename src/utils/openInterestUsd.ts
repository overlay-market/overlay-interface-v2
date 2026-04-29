import type { AggregatorContractTicker } from "../hooks/useAggregatorContracts";
import { formatPriceWithCurrency } from "./formatPriceWithCurrency";

export interface MarketOpenInterestInput {
  marketName?: string;
  marketId?: string;
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

const normalizeTickerKey = (value?: string) => {
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

const getAggregatorTickerKeys = (marketName?: string, marketId?: string) => {
  const pairKeys = new Set(
    [marketName, marketId]
      .map(normalizeTickerKey)
      .filter((key) => key.length > 0)
  );

  return new Set(
    Array.from(pairKeys).flatMap((key) => [key, `${key}-PERP`])
  );
};

const getQuoteUsdMultiplier = (
  openInterest?: number,
  openInterestUsd?: number,
  lastPrice?: number
) => {
  if (
    !openInterest ||
    !openInterestUsd ||
    !lastPrice ||
    !Number.isFinite(openInterest) ||
    !Number.isFinite(openInterestUsd) ||
    !Number.isFinite(lastPrice)
  ) {
    return undefined;
  }

  return openInterestUsd / (openInterest * lastPrice);
};

export const findAggregatorContractForMarket = (
  aggregatorContracts: AggregatorContractTicker[],
  marketName?: string,
  marketId?: string
) => {
  const tickerKeys = getAggregatorTickerKeys(marketName, marketId);

  if (tickerKeys.size === 0) return undefined;

  return aggregatorContracts.find((contract) => {
    const contractKeys = [
      contract.ticker_id,
      contract.index_name,
      `${contract.base_currency}-${contract.target_currency}`,
    ].map(normalizeTickerKey);

    return contractKeys.some((key) => tickerKeys.has(key));
  });
};

export const getMarketOpenInterestUsd = (
  market: MarketOpenInterestInput | undefined,
  aggregatorContracts: AggregatorContractTicker[]
) => {
  const longOi = Number(market?.parsedOiLong ?? 0);
  const shortOi = Number(market?.parsedOiShort ?? 0);
  const totalOi = longOi + shortOi;
  const aggregatorContract = findAggregatorContractForMarket(
    aggregatorContracts,
    market?.marketName,
    market?.marketId
  );
  const openInterestPrice = Number(
    aggregatorContract?.last_price ?? market?.parsedMid ?? market?.mid
  );
  const quoteUsdMultiplier =
    getQuoteUsdMultiplier(
      aggregatorContract?.open_interest,
      aggregatorContract?.open_interest_usd,
      aggregatorContract?.last_price
    ) ?? (market?.priceCurrency === "$" ? 1 : undefined);
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
