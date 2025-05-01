import { useState, useMemo } from "react";
import { Address,  parseUnits, zeroAddress } from "viem";
import useAccount from "../../../hooks/useAccount";
import { useTransaction } from "./useTransaction";
import { TransactionType } from "../../../constants/transaction";
import { ichiVaultDepositGuardABI } from "../abi/ichiVaultDepositGuardABI";
import { ICHIVaultDepositGuard } from "../../../constants/vaults";
import { usePublicClient, useWalletClient } from "wagmi";

type UseWithdrawWithGuardProps = {
  ichiVaultAddress: Address;
  typedAmount: string;
  setTypedAmount: (val: string) => void;
};

export const useWithdrawWithGuard = ({
  ichiVaultAddress,
  typedAmount,
  setTypedAmount,
}: UseWithdrawWithGuardProps) => {
  if (ichiVaultAddress === zeroAddress) {
    return {
      handleWithdraw: async () => {},
      buttonTitle: 'Withdraw',
      attemptingTransaction: false,
    };
  }

  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { sendTransaction } = useTransaction({
    type: TransactionType.WITHDRAW_OVL,
    successMessage: "Withdrawal successful!",
  });

  const [withdrawStep, setWithdrawStep] = useState<"idle" | "pending">("idle");
  const [attemptingTransaction, setAttemptingTransaction] = useState(false);

  const buttonTitle = useMemo(() => {
    if (withdrawStep === "pending") return "Pending confirmation...";
    return "Withdraw";
  }, [withdrawStep]);

  const handleWithdraw = async () => {
    if (!typedAmount || !account || !publicClient || !walletClient) return;

    setAttemptingTransaction(true);
    setWithdrawStep("pending");
    
    try {
      const parsedAmount = parseUnits(typedAmount, 18);
      const chain = walletClient.chain;

      const {result: estimatedAmounts} = await publicClient.simulateContract({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardWithdrawFromICHIVault",
        args: [
          ichiVaultAddress,
          ICHIVaultDepositGuard.vaultDeployerAddress,
          parsedAmount,
          account,
          0n,
          0n,          
        ],
        account,
        chain,
      });

      let [minAmount0, minAmount1] = estimatedAmounts;

      minAmount0 = (minAmount0 * BigInt(99)) / BigInt(100);
      minAmount1 = (minAmount1 * BigInt(99)) / BigInt(100);

      const withdrawArgs = [
        ichiVaultAddress,
          ICHIVaultDepositGuard.vaultDeployerAddress,
          parsedAmount,
          account,
          minAmount0,
          minAmount1,
      ] as const;

      const estimatedGas = await publicClient.estimateContractGas({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: 'forwardWithdrawFromICHIVault',
        args: withdrawArgs,
        account,
      });

      const withdrawHash = await sendTransaction({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardWithdrawFromICHIVault",
        args: withdrawArgs,
        gas: estimatedGas,
        account,
        chain,
      });

      if (!withdrawHash) throw new Error('Withdraw transaction failed');

    } catch (err) {
      console.error("Withdraw error:", err);
    } finally {
      setWithdrawStep("idle");
      setAttemptingTransaction(false);
      setTypedAmount("");
    }
  };

  return {
    handleWithdraw,
    buttonTitle,
    attemptingTransaction,
  };
};