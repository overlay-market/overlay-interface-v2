import { formatUnits } from "viem";

export function formatAmount(
  value: bigint | string | number | undefined,
  decimals: number = 18,
  precision: number = 4,          
  maxFractionDigits: number = 18   
): string {
  if (value === undefined) return `0`;

  const numberValue = Number.parseFloat(formatUnits(BigInt(value), decimals));

  if (isNaN(numberValue)) return `0`;

  let formatted: string;

  if (numberValue !== 0 && Math.abs(numberValue) < 1e-6) {
    // very small numbers → show full precision with fixed decimals
    formatted = numberValue.toFixed(maxFractionDigits).replace(/0+$/, "");
  } else {
    // normal numbers → use significant digits
    formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: maxFractionDigits,
    }).format(Number(numberValue.toPrecision(precision)));
  }

  return formatted;
}