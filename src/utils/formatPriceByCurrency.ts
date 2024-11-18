import { limitDigitsInDecimals, toPercentUnit, toScientificNumber } from "overlay-sdk";

export const formatPriceByCurrency = (price: string | number, priceCurrency: string): string => {
  return priceCurrency === '%' 
      ? toPercentUnit(price).toString() 
      : toScientificNumber(limitDigitsInDecimals(price.toString().replaceAll(",", "")));
}