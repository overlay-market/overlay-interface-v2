import { useMemo } from 'react';
import { getERC4626VaultItemByVaultId, getMRVaultItemByVaultId } from '../utils/getVaultItem';
import { getVaultConfig } from '../utils/getVaultConfig';
import { zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC4626ABI } from '../abi/ERC4626ABI';
import { stakingTokenABI } from '../abi/stakingTokenABI';

export const useWithdrawSymbol = (vaultId: number): string => {
  const vaultConfig = useMemo(() => getVaultConfig(vaultId), [vaultId]);

  const { vaultAddress, abi } = useMemo(() => {
    switch (vaultConfig) {
      case 'ichiPlusErc4626': {
        const vaultItem = getERC4626VaultItemByVaultId(vaultId);
        return { vaultAddress: vaultItem?.vaultAddress ?? zeroAddress, abi: ERC4626ABI };
      }
      case 'ichiPlusMR': {
        const vaultItem = getMRVaultItemByVaultId(vaultId);
        return { vaultAddress: vaultItem?.vaultAddress ?? zeroAddress, abi: stakingTokenABI };
      }
      default:
        return { vaultAddress: zeroAddress, abi: [] as const };
    }
  }, [vaultConfig, vaultId]);

  const { data: withdrawSymbol } = useReadContract({
    address: vaultAddress,
    abi,
    functionName: 'symbol',
    query: {
      enabled: !!vaultAddress && vaultAddress !== zeroAddress,
    },
  });

  return withdrawSymbol as string ?? '';
};