import { useMemo } from 'react';
import { useStakeWithGuard } from './useStakeWithGuard';
import { VaultItemType, vaultsById } from '../../../constants/vaults';
import { getIchiVaultItemByVaultId } from '../utils/getVaultData';

type VaultType = 'vaultWithGuard'

interface StakeParams {
  vaultId: number;
  typedAmount: string;
  setTypedAmount: (amount: string) => void;
}

interface StakeResult {
  handleStake: () => Promise<void>;
  buttonTitle: string;
  attemptingTransaction: boolean;
}

export const useStake = (params: StakeParams): StakeResult => {
  const { vaultId, typedAmount, setTypedAmount } = params;

  const vaultType = useMemo(() => {
    if (vaultsById[vaultId].combinationType.includes(VaultItemType.ICHI)) {
      return 'vaultWithGuard' as VaultType;
    }
    
    throw new Error(`Unsupported vault type for vault: ${vaultsById[vaultId].vaultName}`);
  }, [vaultId]);

  if (vaultType === 'vaultWithGuard') {
    const ichiVaultAddress = getIchiVaultItemByVaultId(vaultId)?.vaultAddress;
    if (!ichiVaultAddress) {
      throw new Error(
        `No valid ICHI vault found for vault: ${vaultsById[vaultId].vaultName}`
      );
    }
    return useStakeWithGuard({
      ichiVaultAddress,
      typedAmount,
      setTypedAmount,
    });
  }

  throw new Error(`No staking hook for vault type: ${vaultType}`);
};