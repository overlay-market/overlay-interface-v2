import { GA_TRACKING_ID } from "../constants/applications";

export const trackPageView = (url?: string) => {
  if (typeof window === "undefined" || !(window as any).gtag) return;

  const fullUrl = url || window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams(window.location.search);
  const market = searchParams.get("market");
  const decodedMarket = market ? decodeURIComponent(market) : undefined;

  (window as any).gtag("config", GA_TRACKING_ID, {
    page_path: fullUrl, 
    market_name: decodedMarket || "unknown",
  });
};