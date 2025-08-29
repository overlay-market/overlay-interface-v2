import { parseUnits } from 'viem';
import { BRIDGE_FEE } from '../../constants/bridge';
import { OVL_DECIMALS } from '../../constants/applications';

/**
 * Calculates the adjusted bridge amount including fees
 * This ensures the user receives approximately the amount they typed after fees
 * 
 * @param baseAmount - The amount the user typed (as string)
 * @param leverage - The selected leverage multiplier
 * @param decimals - Token decimals (defaults to OVL_DECIMALS)
 * @returns The adjusted amount as bigint (base + fees)
 */
export const calculateAdjustedBridgeAmount = (
  baseAmount: string,
  leverage: string | number,
  decimals: number = OVL_DECIMALS
): bigint => {
  const baseOvlAmount = parseUnits(baseAmount, decimals);
  const leverageNum = Number(leverage) || 1;
  
  // Calculate bridge fee: baseAmount * leverage * BRIDGE_FEE (0.5%)
  const bridgeFeeAmount = baseOvlAmount * BigInt(Math.floor(leverageNum * 1000)) * BigInt(Math.floor(BRIDGE_FEE * 1000)) / BigInt(1000000);
  
  // Return adjusted amount: base + fees
  return baseOvlAmount + bridgeFeeAmount;
};

/**
 * Formats the adjusted bridge amount for display
 * 
 * @param baseAmount - The amount the user typed (as string)
 * @param leverage - The selected leverage multiplier
 * @param decimals - Token decimals (defaults to OVL_DECIMALS)
 * @returns The adjusted amount as formatted string
 */
export const formatAdjustedBridgeAmount = (
  baseAmount: string,
  leverage: string | number,
  decimals: number = OVL_DECIMALS
): string => {
  const adjustedAmount = calculateAdjustedBridgeAmount(baseAmount, leverage, decimals);
  return (Number(adjustedAmount) / Math.pow(10, decimals)).toFixed(4);
};