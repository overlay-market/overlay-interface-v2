import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./trackPageView";
import { trackEvent } from "./trackEvent";

const AnalyticsListener = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const market = searchParams.get("market");
  const decodedMarket = market ? decodeURIComponent(market) : undefined;

  useEffect(() => {
    trackPageView(location.pathname + location.search);

    if (location.pathname === "/trade" && decodedMarket) {
      trackEvent("view_trade_page", { market_name: decodedMarket });
    }
  }, [location.pathname, location.search, decodedMarket]);

  return null;
};

export default AnalyticsListener;
