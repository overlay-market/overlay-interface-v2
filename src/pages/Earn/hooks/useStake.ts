import { useMemo } from 'react';
import { getVaultConfig, VaultConfig } from '../utils/getVaultConfig';
import { useStakeWithIchiAndErc4626 } from './useStakeWithIchiAndErc4626';
import { useStakeWithIchiAndMR } from './useStakeWithIchiAndMR';

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

  const vaultConfig = useMemo(() => getVaultConfig(vaultId), [vaultId]);

  const stakeWithIchiAndErc4626 = useStakeWithIchiAndErc4626({
    vaultId,
    typedAmount,
    setTypedAmount,
  });  

  const stakeWithIchiAndMR = useStakeWithIchiAndMR({
    vaultId,
    typedAmount,
    setTypedAmount,
  });

  const allHooks: Record<VaultConfig, StakeResult> = {
    ichiPlusErc4626: stakeWithIchiAndErc4626,
    ichiPlusMR: stakeWithIchiAndMR,
  };

  return allHooks[vaultConfig];
};