import { PriceItem } from "../hooks/useTokenPrices";

export const getTokenPrice = (
  prices: PriceItem[],
  tokenAddress: string
): number => {
  const price = prices.find(
    (item) => item.address.toLowerCase() === tokenAddress.toLowerCase()
  )?.price;

  if (price === undefined) {
    console.warn(`Missing price for token ${tokenAddress}`);
    // return 0;
    return prices[0].price
  }

  return price;
};