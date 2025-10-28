export const trackEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window === "undefined" || !(window as any).gtag) return;
  const gtag = (window as any).gtag;

  const safeParams = Object.fromEntries(
    Object.entries(params || {}).map(([key, val]) => {
      if (val === undefined || val === null) return [key, ""];
      if (typeof val === "string" && val.startsWith("0x")) {
        return [key, `addr_${val}`]; 
      }
      return [key, String(val)];
    })
  );

  gtag("event", action, safeParams);

  const wallet_address = params?.wallet_address;
  if (wallet_address) {
    gtag("set", "user_properties", { wallet_address: `addr_${wallet_address}` });
  }
};