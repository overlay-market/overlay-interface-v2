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

      const { liquidatePrice, cost, tradingFee, marketMid, currentOi, info } = fetched;            

      const unrealizedPnL: string | number | undefined = (() => {
        const diff =
          (0 - Number(cost) - Number(tradingFee)) /
          10 ** 18;
        return diff < 1 ? diff.toFixed(6) : diff.toFixed(2);
      })();

      const ONE_BN = 10n ** 18n;
      const tickToPrice = (tick: number): bigint => BigInt(Math.floor(Math.pow(1.0001, tick) * 1e18)); 

      const parsedFunding: string | number | undefined = (() => { 
        if (info === undefined || !currentOi || !marketMid) return undefined; 
        const baseFractionRemaining = 10000n; 
        const remainingNotionalInitial = (BigInt(info.notionalInitial) * BigInt(info.fractionRemaining)) / baseFractionRemaining; 
        const remainingOiInitial = (remainingNotionalInitial * ONE_BN) / tickToPrice(info.midTick); 
        if (remainingOiInitial === 0n) return undefined; 
        const fundingPayments = (BigInt(marketMid) * (BigInt(currentOi) - remainingOiInitial)) / ONE_BN; 
        const fullValue = formatBigNumber( fundingPayments < 0n ? -fundingPayments : fundingPayments, 18, 18 ); 
        if (fullValue === undefined) return "-"; 
        return +fullValue < 1 ? formatBigNumber(fundingPayments, 18, 6) : formatBigNumber(fundingPayments, 18, 2); })();

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
        parsedFunding: parsedFunding ? parsedFunding : "-",
      };
    });

    return zeroValuePositions;
  } catch (err) {
    console.error("Error fetching data for invalid positions:", err);
    return []; 
  }
}