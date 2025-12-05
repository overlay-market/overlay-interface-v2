import { MarketDataParsed } from "../../../../types/marketTypes";

export const formatTimeUTC = (date: Date) => {
  // returns "HH:mm"
  return date.toISOString().slice(11, 16);
};

export const formatDateUTC = (date: Date) => {
  // "DD MMM `YY" (backtick included as original)
  const d = date.getUTCDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const year = date.getUTCFullYear().toString().slice(-2);
  return `${d} ${month} \`${year}`;
};

export function priceFormatterFactory(symbolInfo: any, fractionDigitsAmount: number, market: MarketDataParsed) {
  if (symbolInfo === null) return null;

  const marketFormattingPrice = [
    "BTC / USD",
    "ETH / USD",
    "Magnus Carlsen",
    "Hikaru Nakamura",
  ];
  const marketName = market?.marketName || "";
  if (marketFormattingPrice.some((name) => marketName === name)) {
    return {
      format: (price: number) => {
        return Math.round(price).toLocaleString("en-US");
      },
    };
  }
  if (symbolInfo.format === "volume") {
    return {
      format: (price: number) => {
        if (price >= 1000000000) {
          return `${(price / 1000000000).toFixed(3)}B`;
        }
        if (price >= 1000000) {
          return `${(price / 1000000).toFixed(3)}M`;
        }
        if (price >= 1000) {
          return `${(price / 1000).toFixed(3)}K`;
        }
        if (price >= 1 && price < 10) {
          return price.toFixed(fractionDigitsAmount);
        }
        if (price < 1) {
          if (market.priceCurrency === "%") {
            return (price * 100).toFixed(2);
          } else {
            return price.toFixed(fractionDigitsAmount);
          }
        }
        return price.toFixed(2);
      },
    };
  }

  return null;
}