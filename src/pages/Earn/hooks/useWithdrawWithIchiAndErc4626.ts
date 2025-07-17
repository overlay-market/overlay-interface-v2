import { useState, useMemo } from "react";
import { erc4626Abi,  parseEventLogs,  parseUnits, zeroAddress } from "viem";
import useAccount from "../../../hooks/useAccount";
import { useTransaction } from "./useTransaction";
import { TransactionType } from "../../../constants/transaction";
import { ichiVaultDepositGuardABI } from "../abi/ichiVaultDepositGuardABI";
import { ICHIVaultDepositGuard } from "../../../constants/vaults";
import { usePublicClient, useWalletClient } from "wagmi";
import { useVaultsState } from "../../../state/vaults/hooks";
import { getERC4626VaultItemByVaultId, getIchiVaultItemByVaultId } from "../utils/getVaultItem";
import { ERC4626ABI } from "../abi/ERC4626ABI";
import { useQueryClient } from "@tanstack/react-query";

type UseWithdrawWithIchiAndErc4626Props = {
  vaultId: number;
  typedAmount: string;
  setTypedAmount: (val: string) => void;
};

export const useWithdrawWithIchiAndErc4626 = ({
  vaultId,
  typedAmount,
  setTypedAmount,
}: UseWithdrawWithIchiAndErc4626Props) => {
  const ichiVaultAddress =
    getIchiVaultItemByVaultId(vaultId)?.vaultAddress ?? zeroAddress;
  const ERC4626VaultAddress = getERC4626VaultItemByVaultId(vaultId)?.vaultAddress ?? zeroAddress;  

  if (ichiVaultAddress === zeroAddress || ERC4626VaultAddress === zeroAddress) {
    return {
      handleWithdraw: async () => {},
      buttonTitle: 'Withdraw',
      attemptingTransaction: false,
    };
  }

  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { slippageValue } = useVaultsState();
  const queryClient = useQueryClient();

  const { sendTransaction: sendWithdrawFromERC4626, txReceipt } = useTransaction({
    type: TransactionType.WITHDRAW_OVL,
    successMessage: "Withdrawal successful!",
  });

  const { sendTransaction: sendWithdrawFromIchi, txHash } = useTransaction({
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

      await sendWithdrawFromERC4626({
        address: ERC4626VaultAddress,
        abi: ERC4626ABI,
        functionName: "withdraw",
        args: [parsedAmount, ICHIVaultDepositGuard.depositGuardAddress, account],
        account,
        chain,
      });

      if (!txReceipt) throw new Error('Withdraw tx failed');
      
      const log = parseEventLogs({
        abi: erc4626Abi,
        logs: txReceipt.logs,
        eventName: 'Withdraw', 
      });

      const lpTokensForIchi = log[0].args.assets;
    
      if (!lpTokensForIchi || lpTokensForIchi === 0n) {
        throw new Error('Invalid withdrawn tokens amount');
      }

      const {result: estimatedAmounts} = await publicClient.simulateContract({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardWithdrawFromICHIVault",
        args: [
          ichiVaultAddress,
          ICHIVaultDepositGuard.vaultDeployerAddress,
          lpTokensForIchi,
          account,
          0n,
          0n,          
        ],
        account,
        chain,
      });

      let [minAmount0, minAmount1] = estimatedAmounts;

      const slippageBasisPoints = BigInt(Math.floor(parseFloat(slippageValue) * 100));
      const denominator = 10000n;

      minAmount0 = (minAmount0 * (denominator - slippageBasisPoints)) / denominator;
      minAmount1 = (minAmount1 * (denominator - slippageBasisPoints)) / denominator;

      const withdrawArgs = [
        ichiVaultAddress,
          ICHIVaultDepositGuard.vaultDeployerAddress,
          lpTokensForIchi,
          account,
          minAmount0,
          minAmount1,
      ] as const;

      await sendWithdrawFromIchi({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardWithdrawFromICHIVault",
        args: withdrawArgs,
        account,
        chain,
      });

      if (!txHash) throw new Error('Withdraw tx failed');

      if (txHash) {
        await queryClient.refetchQueries({
          queryKey: ['userCurrentBalance', account, ichiVaultAddress],
          exact: true,
        });
      }

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