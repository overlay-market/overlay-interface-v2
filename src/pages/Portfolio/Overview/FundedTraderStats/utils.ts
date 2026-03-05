import { formatUnits } from "viem";

export const formatUsdt = (value: string, decimals = 2): string => {
  const formatted = formatUnits(BigInt(value), 18);
  return Number(formatted).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const getHealthColor = (
  healthFill: number,
  isInProfit: boolean
): string => {
  if (isInProfit) return "#22c55e";
  if (healthFill <= 20) return "#ef4444";
  if (healthFill <= 40) return "#f97316";
  if (healthFill <= 60) return "#eab308";
  if (healthFill <= 80) return "#a3d9a5";
  return "#86cfb0";
};
