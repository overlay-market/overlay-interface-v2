export const formatFixedPoint18 = (value: string): string => {
  if (value.trim() === "") return "-";

  const bigIntValue = BigInt(value);
  const divisor = BigInt(1e18);
  const precision = BigInt(1e10);

  const scaledValue = (bigIntValue * precision) / divisor;
  const unscaledValue = Number(scaledValue) / 1e10;

  if (unscaledValue < 1) {
    return unscaledValue.toLocaleString("en-US", {
      maximumSignificantDigits: 3,
    });
  } else {
    return unscaledValue
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
      .replaceAll(",", " ");
  }
};