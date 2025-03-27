import { limitDigitsInDecimals, toPercentUnit, toScientificNumber } from "overlay-sdk";
import { BERA_CURRENCY_MARKETS } from "../constants/markets";

export const formatPriceWithCurrency = (price: string | number, priceCurrency: string, marketId: string, significantFigures?: number): string => {
  const formattedPrice = priceCurrency === '%' 
      ? toPercentUnit(price).toString() 
      : toScientificNumber(limitDigitsInDecimals(price.toString().replaceAll(",", "")), significantFigures);

  return BERA_CURRENCY_MARKETS.includes(marketId) ? formattedPrice + ' BERA' : priceCurrency === '%' ? formattedPrice + priceCurrency : priceCurrency + formattedPrice
}