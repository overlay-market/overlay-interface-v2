export const formatNumberForDisplay = (
  value: number,
  precision: number = 10,
  maxFractionDigits: number = 6
): string => {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(parseFloat(value.toPrecision(precision)));
}
