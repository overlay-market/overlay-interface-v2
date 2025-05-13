import { useMemo } from 'react';
import { getVaultType, VaultType } from '../utils/getVaultType';
import { useStakeWithGuardAndERC4626 } from './useStakeWithGuardAndERC4626';

interface StakeParams {
  vaultId: number;
  typedAmount: string;
  setTypedAmount: (amount: string) => void;
}

export interface StakeResult {
  handleStake: () => Promise<void>;
  buttonTitle: string;
  attemptingTransaction: boolean;
}

export const useStake = (params: StakeParams): StakeResult => {
  const { vaultId, typedAmount, setTypedAmount } = params;

  const vaultType = useMemo(() => getVaultType(vaultId), [vaultId]);

  const stakeWithGuardAndERC4626 = useStakeWithGuardAndERC4626({
    vaultId,
    typedAmount,
    setTypedAmount,
  });  

  const allHooks: Record<VaultType, StakeResult> = {
    vaultWithGuardAndERC4626: stakeWithGuardAndERC4626,
  };

  return allHooks[vaultType];
};