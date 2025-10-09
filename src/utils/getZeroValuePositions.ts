import { OpenPositionData, OverlaySDK } from "overlay-sdk";
import { Address } from "viem";
import { getOnchainPositionsData } from "./getOnchainPositionsData";
import { formatBigNumber } from "./formatBigNumber";
import { formatPriceWithCurrency } from "./formatPriceWithCurrency";

export async function getZeroValuePositions(
  sdkCore: OverlaySDK['core'], 
  invalidPositionsWithMarket: OpenPositionData[],
  walletClientAddress: Address
): Promise<OpenPositionData[]> {
  if (invalidPositionsWithMarket.length === 0) {
    return [];
  }

  const positionsInput = invalidPositionsWithMarket.map((pos) => ({
    marketId: pos.marketAddress,
    positionId: BigInt(pos.positionId),
    walletClient: walletClientAddress,
  }));

  try {
    const extraData = await getOnchainPositionsData( 
      sdkCore,
      sdkCore.chainId,
      positionsInput
    );

    const zeroValuePositions = invalidPositionsWithMarket.map((pos) => {
      const key = `${pos.marketAddress}-${pos.positionId}`;
      const fetched = extraData[key];
      if (!fetched) return pos;

      const { liquidatePrice, cost, tradingFee, marketMid } = fetched;            

      const unrealizedPnL: string | number | undefined = (() => {
        const diff =
          (0 - Number(cost) - Number(tradingFee)) /
          10 ** 18;
        return diff < 1 ? diff.toFixed(6) : diff.toFixed(2);
      })();

      return {
        ...pos,
        size: "0", 
        currentPrice: marketMid && formatBigNumber(marketMid, Number(18), 4)
          ? formatPriceWithCurrency(formatBigNumber(marketMid, Number(18), 4), pos.priceCurrency)
          : "-", 
        liquidatePrice: liquidatePrice && formatBigNumber(liquidatePrice, Number(18), 4) 
          ? formatPriceWithCurrency(formatBigNumber(liquidatePrice, Number(18), 4), pos.priceCurrency) 
          : "-", 
        unrealizedPnL: unrealizedPnL ? unrealizedPnL : "-",  
        parsedFunding: "0",
      };
    });

    return zeroValuePositions;
  } catch (err) {
    console.error("Error fetching data for invalid positions:", err);
    return []; 
  }
}