import { useMemo } from 'react';
import { useStakeWithGuard } from './useStakeWithGuard';
import { getIchiVaultItemByVaultId } from '../utils/getVaultItem';
import { getVaultType, VaultType } from '../utils/getVaultType';
import { zeroAddress } from 'viem';

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

  const vaultType = useMemo(() => getVaultType(vaultId), [vaultId]);

  const ichiVaultAddress =
    getIchiVaultItemByVaultId(vaultId)?.vaultAddress ?? zeroAddress;

  const stakeWithGuard = useStakeWithGuard({
    ichiVaultAddress,
    typedAmount,
    setTypedAmount,
  });  

  const allHooks: Record<VaultType, StakeResult> = {
    vaultWithGuard: stakeWithGuard,
  };

  return allHooks[vaultType];
};