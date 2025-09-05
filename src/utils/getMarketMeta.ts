import { DEFAULT_LOGO, MARKETS_FULL_LOGOS } from "../constants/markets";

export interface MarketMeta {
  title: string;
  description: string;
  image: string;
}

export function getMarketMeta(encodedMarket?: string): MarketMeta {
  const marketKey = encodedMarket ?? "";
  const title = marketKey ? decodeURIComponent(marketKey) : "Overlay Markets";
  const image = MARKETS_FULL_LOGOS[marketKey] ?? DEFAULT_LOGO;
  const description = `Trade ${title} on Overlay Markets`;
  return { title, description, image };
}
