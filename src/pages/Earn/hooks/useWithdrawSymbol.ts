import { useMemo } from 'react';
import { getERC4626VaultItemByVaultId } from '../utils/getVaultItem';
import { getVaultType } from '../utils/getVaultType';
import { zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC4626ABI } from '../abi/ERC4626ABI';

export const useWithdrawSymbol = (vaultId: number): string => {
  const vaultType = useMemo(() => getVaultType(vaultId), [vaultId]);

  const { vaultAddress, abi } = useMemo(() => {
    switch (vaultType) {
      case 'vaultWithGuardAndERC4626': {
        const vaultItem = getERC4626VaultItemByVaultId(vaultId);
        return { vaultAddress: vaultItem?.vaultAddress ?? zeroAddress, abi: ERC4626ABI };
      }
      default:
        return { vaultAddress: zeroAddress, abi: [] as const };
    }
  }, [vaultType, vaultId]);

  const { data: withdrawSymbol } = useReadContract({
    address: vaultAddress,
    abi,
    functionName: 'symbol',
    query: {
      enabled: !!vaultAddress && vaultAddress !== zeroAddress,
    },
  });

  return withdrawSymbol ?? '';
};