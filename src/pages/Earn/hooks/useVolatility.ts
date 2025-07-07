import { useReadContract } from 'wagmi';
import { VOLATILITY_CHECK_ADDRESS } from '../../../constants/vaults';
import { volatilityCheckABI } from '../abi/volatilityCheckABI';

export const useVolatility = (vaultAddress: `0x${string}`) => {
  return useReadContract({
    address: VOLATILITY_CHECK_ADDRESS,
    abi: volatilityCheckABI,
    functionName: 'currentVolatility',
    args: [vaultAddress],
    query: {
      enabled: !!vaultAddress,
    },
  });
}