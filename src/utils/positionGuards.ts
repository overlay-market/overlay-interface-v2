import type { OpenPositionData } from "overlay-sdk";

const SHUTDOWN_MARKET_LABEL = "Market is shutdown";

export const isShutdownOpenPosition = (
  position: Pick<
    OpenPositionData,
    "marketName" | "size" | "entryPrice" | "currentPrice" | "liquidatePrice"
  >
): boolean => {
  return (
    position.marketName === SHUTDOWN_MARKET_LABEL ||
    (position.size === "0" &&
      position.entryPrice === "0" &&
      position.currentPrice === "0" &&
      position.liquidatePrice === "0")
  );
};
