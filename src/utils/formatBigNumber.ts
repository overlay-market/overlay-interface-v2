import { formatUnits } from "viem";

export function formatBigNumber(
  value: bigint | string | number | undefined,
  decimals: number = 18,
  digits: number = 4,
  returnNumberType: boolean = false
): number | string | undefined {
  if (value === undefined) return undefined;

  const formatted = formatUnits(BigInt(value), decimals);

  const formatWithDigits = Number.parseFloat(formatted).toFixed(digits);

  return returnNumberType ? Number(formatWithDigits) : formatWithDigits;
}