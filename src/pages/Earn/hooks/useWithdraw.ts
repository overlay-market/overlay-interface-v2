import { useMemo } from 'react';
import { getIchiVaultItemByVaultId } from '../utils/getVaultItem';
import { useWithdrawWithGuard } from './useWithdrawWithGuard';
import { getVaultType, VaultType } from '../utils/getVaultType';
import { zeroAddress } from 'viem';

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

  const ichiVaultAddress =
    getIchiVaultItemByVaultId(vaultId)?.vaultAddress ?? zeroAddress;

  const withdrawWithGuard = useWithdrawWithGuard({
    ichiVaultAddress,
    typedAmount,
    setTypedAmount,
  });  

  const allHooks: Record<VaultType, WithdrawResult> = {
    vaultWithGuardAndERC4626: withdrawWithGuard,
  };

  return allHooks[vaultType];
};