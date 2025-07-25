import { TokenAmount } from "@lifi/sdk";
import { formatUnits, parseUnits } from "viem";

export const calculateOvlAmountFromToken = (
  token: TokenAmount,
  ovlPriceUsd: number,
  ovlDecimals = 18,
): bigint => {  
  const tokenAmountReadable = parseFloat(formatUnits(token.amount ?? 0n, token.decimals));  
  const tokenUsdValue = tokenAmountReadable * parseFloat(token.priceUSD);
  const ovlAmount = tokenUsdValue / ovlPriceUsd;
  if (isNaN(ovlAmount) || ovlAmount < 0) {
    return BigInt(0);
  }
 
  return parseUnits(ovlAmount.toFixed(ovlDecimals), ovlDecimals);
}