import { useMemo } from 'react';
import { useWithdrawWithGuardAndERC4626 } from './useWithdrawWithGuardAndERC4626';
import { getVaultType, VaultType } from '../utils/getVaultType';

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

  const vaultType = useMemo(() => getVaultType(vaultId), [vaultId]); 

  const withdrawWithGuardAndERC4626 = useWithdrawWithGuardAndERC4626({
    vaultId,
    typedAmount,
    setTypedAmount,
  });  

  const allHooks: Record<VaultType, WithdrawResult> = {
    vaultWithGuardAndERC4626: withdrawWithGuardAndERC4626,
  };

  return allHooks[vaultType];
};