import { TokenAmount } from "@lifi/sdk";
import { formatUnits, parseUnits } from "viem";
import { OVL_DECIMALS } from "../../constants/applications";

const USD_DECIMALS = 6;

export const calculateOvlAmountFromToken = (
  token: TokenAmount,
  ovlPriceUsd: number,
): bigint => {  
  const tokenAmountReadable = parseFloat(formatUnits(token.amount ?? 0n, token.decimals));  
  const tokenUsdValue = tokenAmountReadable * parseFloat(token.priceUSD);
  const ovlAmount = tokenUsdValue / ovlPriceUsd;
  if (isNaN(ovlAmount) || ovlAmount < 0) {
    return BigInt(0);
  }
 
  return parseUnits(ovlAmount.toFixed(OVL_DECIMALS), OVL_DECIMALS);
}

export const calculateTokenAmountFromOvlAmount = (
  userInput: string,  
  token: TokenAmount,
  ovlPriceUsd: number,
): bigint => {  

  console.log(userInput,Number(userInput) <= 0, parseFloat(token.priceUSD) <= 0, ovlPriceUsd <= 0);
   if (!userInput || Number(userInput) <= 0 || parseFloat(token.priceUSD) <= 0 || ovlPriceUsd <= 0) {
    return 0n;
  }
  
  const ovlAmount = parseUnits(userInput, OVL_DECIMALS);
  const ovlUsdPrice = parseUnits(ovlPriceUsd.toString(), USD_DECIMALS); 
  const tokenUsdPrice = parseUnits(token.priceUSD.toString(), USD_DECIMALS); 
  const usdValue = (ovlAmount * ovlUsdPrice) / 10n ** BigInt(OVL_DECIMALS);
  const tokenAmount = (usdValue * 10n ** BigInt(token.decimals)) / tokenUsdPrice;
  
  return tokenAmount;
}