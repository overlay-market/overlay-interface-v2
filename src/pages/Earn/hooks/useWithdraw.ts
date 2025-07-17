import { useMemo } from 'react';
import { getVaultConfig, VaultConfig } from '../utils/getVaultConfig';
import { useWithdrawWithIchiAndErc4626 } from './useWithdrawWithIchiAndErc4626';
import { useWithdrawWithIchiAndMR } from './useWithdrawWithIchiAndMR';

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

  const vaultConfig = useMemo(() => getVaultConfig(vaultId), [vaultId]); 

  const withdrawWithIchiAndErc4626 = useWithdrawWithIchiAndErc4626({
    vaultId,
    typedAmount,
    setTypedAmount,
  });  

  const withdrawWithIchiAndMR = useWithdrawWithIchiAndMR({
    vaultId,
    typedAmount,
    setTypedAmount,
  });

  const allHooks: Record<VaultConfig, WithdrawResult> = {
    ichiPlusErc4626: withdrawWithIchiAndErc4626,
    ichiPlusMR: withdrawWithIchiAndMR,
  };

  return allHooks[vaultConfig];
};