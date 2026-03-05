import { toPercentUnit } from "overlay-sdk";

export const formatNumberWithCommas = (number: number | string): string => {
  const num = Number(number);
  if (num >= 1_000_000) {
    return (
      (num / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
      " M"
    );
  }
  if (num < 0.01 && num > 0) {
    return num.toLocaleString("en-US", { maximumFractionDigits: 7 });
  }
  return num >= 100
    ? Math.round(num).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : num.toLocaleString("en-US", { maximumFractionDigits: 3 });
};

export const formatPriceWithCurrency = (
  price: string | number,
  priceCurrency: string
): string => {
  if (priceCurrency === "%") {
    return toPercentUnit(price).toString() + "%";
  }

  const numericPrice = Number(price.toString().replaceAll(",", ""));
  const isNegative = numericPrice < 0;
  const absPrice = Math.abs(numericPrice);

  const formattedPrice = formatNumberWithCommas(absPrice);

  return isNegative
    ? `-${priceCurrency}${formattedPrice}`
    : `${priceCurrency}${formattedPrice}`;
};
