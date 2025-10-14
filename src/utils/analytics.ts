export const GA_TRACKING_ID = "G-LBE2VY2GPX";

export const trackEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    const safeParams = Object.fromEntries(
      Object.entries(params || {}).map(([key, val]) => [key, String(val)])
    );
    (window as any).gtag("event", action, safeParams);
  }
};

export const trackPageView = (url?: string) => {
  if (typeof window === "undefined" || !(window as any).gtag) return;

  const fullUrl = url || window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams(window.location.search);
  const market = searchParams.get("market");

  (window as any).gtag("config", GA_TRACKING_ID, {
    page_path: fullUrl, 
    market_name: market || "unknown",
  });
};