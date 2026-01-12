import { useCallback, useMemo } from 'react';
import { useBalance, useGasPrice } from 'wagmi';
import useAccount from './useAccount';
import { formatUnits } from 'viem';
import { DEFAULT_CHAINID } from '../constants/chains';

// Estimated gas units for building a position (typical range: 400k-800k)
const ESTIMATED_BUILD_GAS_UNITS = 600_000n;
// Add 20% buffer for gas price fluctuations
const GAS_BUFFER_MULTIPLIER = 1.2;

export interface GasCheckResult {
  hasInsufficientGas: boolean;
  currentBnbBalance: string; // in BNB
  requiredBnbAmount: string; // in BNB
  gasDeficit: string; // in BNB, how much more is needed
  isLoading: boolean;
  error: string | null;
}

export const useGasCheck = () => {
  const { address: account, chainId } = useAccount();
  const isDebugMode = import.meta.env.VITE_LIFI_DEBUG === 'true';

  // Get BNB balance on BSC
  const {
    data: bnbBalance,
    isLoading: isBalanceLoading,
    error: balanceError
  } = useBalance({
    address: account,
    chainId: DEFAULT_CHAINID,
  });

  // Get current gas price on BSC
  const {
    data: gasPrice,
    isLoading: isGasPriceLoading,
    error: gasPriceError
  } = useGasPrice({
    chainId: DEFAULT_CHAINID,
  });

  const checkGas = useCallback((): GasCheckResult => {
    // Debug mode: always return insufficient gas
    if (isDebugMode) {
      console.log("🐛 Debug mode: Simulating insufficient BNB");
      return {
        hasInsufficientGas: true,
        currentBnbBalance: '0.0001', // Very small amount
        requiredBnbAmount: '0.01',   // Required amount
        gasDeficit: '0.0099',        // Deficit
        isLoading: false,
        error: null,
      };
    }

    const isLoading = isBalanceLoading || isGasPriceLoading;
    const error = balanceError?.message || gasPriceError?.message || null;

    // Default return when loading or error
    if (isLoading || error || !bnbBalance || !gasPrice) {
      return {
        hasInsufficientGas: false, // Default to false to not block user
        currentBnbBalance: '0',
        requiredBnbAmount: '0',
        gasDeficit: '0',
        isLoading,
        error,
      };
    }

    // Calculate required BNB for gas
    const estimatedGasCost = ESTIMATED_BUILD_GAS_UNITS * gasPrice;
    const requiredGasWithBuffer = BigInt(Math.floor(Number(estimatedGasCost) * GAS_BUFFER_MULTIPLIER));

    // Convert to readable format
    const currentBnbBalance = formatUnits(bnbBalance.value, 18);
    const requiredBnbAmount = formatUnits(requiredGasWithBuffer, 18);

    // Check if insufficient
    const hasInsufficientGas = bnbBalance.value < requiredGasWithBuffer;
    const gasDeficit = hasInsufficientGas
      ? formatUnits(requiredGasWithBuffer - bnbBalance.value, 18)
      : '0';

    console.log('🔋 Gas Check Result:', {
      currentBalance: currentBnbBalance,
      requiredAmount: requiredBnbAmount,
      hasInsufficientGas,
      gasDeficit,
      gasPrice: gasPrice.toString(),
      estimatedGasUnits: ESTIMATED_BUILD_GAS_UNITS.toString(),
    });

    return {
      hasInsufficientGas,
      currentBnbBalance,
      requiredBnbAmount,
      gasDeficit,
      isLoading: false,
      error: null,
    };
  }, [bnbBalance, gasPrice, isBalanceLoading, isGasPriceLoading, balanceError, gasPriceError, isDebugMode]);

  // Memoize the result to avoid unnecessary recalculations
  const gasCheckResult = useMemo(() => checkGas(), [checkGas]);

  return {
    checkGas,
    gasCheckResult,
    isOnBSC: chainId === DEFAULT_CHAINID,
  };
};