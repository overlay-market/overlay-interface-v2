import { parseUnits } from 'viem';
import { OVL_DECIMALS } from '../../constants/applications';

/**
 * Calculates the adjusted bridge amount including trading fees
 * This ensures the user receives approximately the amount they typed after fees
 *
 * @param baseAmount - The amount the user typed (as string)
 * @param leverage - The selected leverage multiplier
 * @param tradingFeeRate - The trading fee rate as string in FixedPoint18 format
 * @param decimals - Token decimals (defaults to OVL_DECIMALS)
 * @returns The adjusted amount as bigint (base + fees)
 */
export const calculateAdjustedBridgeAmount = (
  baseAmount: string,
  leverage: string | number,
  tradingFeeRate: string,
  decimals: number = OVL_DECIMALS
): bigint => {
  const baseOvlAmount = parseUnits(baseAmount, decimals);
  const leverageNum = Number(leverage) || 1;

  // Convert trading fee rate from FixedPoint18 to decimal
  const tradingFeeDecimal = Number(tradingFeeRate) / 1e18;

  // Calculate trading fee: baseAmount * leverage * tradingFeeRate
  const tradingFeeAmount = baseOvlAmount * BigInt(Math.floor(leverageNum * 1000)) * BigInt(Math.floor(tradingFeeDecimal * 1000)) / BigInt(1000000);

  // Return adjusted amount: base + fees
  return baseOvlAmount + tradingFeeAmount;
};

/**
 * Formats the adjusted bridge amount for display
 *
 * @param baseAmount - The amount the user typed (as string)
 * @param leverage - The selected leverage multiplier
 * @param tradingFeeRate - The trading fee rate as string in FixedPoint18 format
 * @param decimals - Token decimals (defaults to OVL_DECIMALS)
 * @returns The adjusted amount as formatted string
 */
export const formatAdjustedBridgeAmount = (
  baseAmount: string,
  leverage: string | number,
  tradingFeeRate: string,
  decimals: number = OVL_DECIMALS
): string => {
  const adjustedAmount = calculateAdjustedBridgeAmount(baseAmount, leverage, tradingFeeRate, decimals);
  return (Number(adjustedAmount) / Math.pow(10, decimals)).toFixed(4);
};