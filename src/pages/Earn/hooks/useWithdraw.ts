import { useMemo } from 'react';
import { VaultItemType, vaultsById } from '../../../constants/vaults';
import { getIchiVaultItemByVaultId } from '../utils/getVaultData';
import { useWithdrawWithGuard } from './useWithdrawWithGuard';

type VaultType = 'vaultWithGuard'

interface WithdrawParams {
  vaultId: number;
  typedAmount: string;
  setTypedAmount: (amount: string) => void;
}

interface WithdrawResult {
  handleWithdraw: () => Promise<void>;
  buttonTitle: string;
  attemptingTransaction: boolean;
}

export const useWithdraw = (params: WithdrawParams): WithdrawResult => {
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
    return useWithdrawWithGuard({
      ichiVaultAddress,
      typedAmount,
      setTypedAmount,
    });
  }

  throw new Error(`No staking hook for vault type: ${vaultType}`);
};