import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
} from "overlay-sdk";

const formatLargeNumber = (num: number): string => {
  if (isNaN(num)) return "0";

  let value = num;
  if (num.toString().includes("e")) {
    value = Number(num.toString().replace(",", ""));
  }

  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

export const formatPriceWithCurrency = (
  price: string | number,
  priceCurrency: string,
  significantFigures?: number
): string => {
  if (
    price === null ||
    price === undefined ||
    price === "" ||
    (typeof price === "string" && isNaN(Number(price)))
  ) {
    return priceCurrency === "BERA"
      ? "0 BERA"
      : priceCurrency === "%"
      ? "0%"
      : priceCurrency + "0";
  }

  const formattedPrice =
    priceCurrency === "%"
      ? toPercentUnit(price).toString()
      : priceCurrency === "Ξ"
      ? formatLargeNumber(Number(price.toString().replaceAll(",", "")))
      : toScientificNumber(
          limitDigitsInDecimals(price.toString().replaceAll(",", "")),
          significantFigures
        );

  return priceCurrency === "BERA"
    ? formattedPrice + " BERA"
    : priceCurrency === "%"
    ? formattedPrice + priceCurrency
    : priceCurrency + formattedPrice;
};
