import { limitDigitsInDecimals, toPercentUnit, toScientificNumber } from "overlay-sdk";

export const formatPriceWithCurrency = (price: string | number, priceCurrency: string, significantFigures?: number): string => {
  const formattedPrice = priceCurrency === '%' 
      ? toPercentUnit(price).toString() 
      : toScientificNumber(limitDigitsInDecimals(price.toString().replaceAll(",", "")), significantFigures);

  return priceCurrency === 'BERA' ? formattedPrice + ' BERA' : priceCurrency === '%' ? formattedPrice + priceCurrency : priceCurrency + formattedPrice
}