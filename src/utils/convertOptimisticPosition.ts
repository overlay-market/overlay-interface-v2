import { OpenPositionData } from "overlay-sdk";
import { OptimisticPosition } from "../state/trade/reducer";
import { formatPriceWithCurrency } from "./formatPriceWithCurrency";

export function convertToOpenPositionData(
  op: OptimisticPosition
): OpenPositionData {
  const leverageNum = Number(op.leverage);
  const collateralNum = Number(op.collateral);
  const size = collateralNum * leverageNum;

  const positionSide = `${op.leverage}x ${op.isLong ? "Long" : "Short"}`;
  const currentTimestamp = new Date(op.createdAt).toISOString();

  // Format prices to match real position display
  const priceCurrency = op.priceCurrency || "$";
  const formattedEntryPrice = formatPriceWithCurrency(op.estimatedEntryPrice, priceCurrency);
  const formattedLiqPrice = formatPriceWithCurrency(op.estimatedLiquidationPrice, priceCurrency);

  return {
    marketName: op.marketName,
    positionSide,
    parsedCreatedTimestamp: currentTimestamp,
    entryPrice: formattedEntryPrice,
    liquidatePrice: formattedLiqPrice,
    currentPrice: formattedEntryPrice,
    size: size.toString(),
    unrealizedPnL: "0",
    parsedFunding: "0",
    marketAddress: op.marketAddress,
    positionId: -1, // Signals this is an optimistic position (negative ID = not real)
    priceCurrency: op.priceCurrency || "USD",
    initialCollateral: op.collateral,
    // Populate stableValues if USDT collateral
    stableValues: op.collateralType === 'USDT' ? {
      size: size.toString(),
      unrealizedPnL: "0",
      funding: "0",
      initialCollateral: op.collateral,
    } : undefined,
  };
}
