import { useState, useMemo, useEffect } from "react";
import { Address, erc20Abi, parseUnits } from "viem";
import useAccount from "../../../hooks/useAccount";
import { useTransaction } from "./useTransaction";
import { TransactionType } from "../../../constants/transaction";
import { ichiVaultDepositGuardABI } from "../abi/ichiVaultDepositGuardABI";
import { ICHIVaultDepositGuard } from "../../../constants/vaults";
import { usePublicClient, useWalletClient, useReadContract } from "wagmi";

const ichiVaultAbi = [
  {
    constant: true,
    inputs: [],
    name: "token0",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

type UseStakeWithGuardProps = {
  ichiVaultAddress: Address;
  typedAmount: string;
  setTypedAmount: (val: string) => void;
};

export const useStakeWithGuard = ({
  ichiVaultAddress,
  typedAmount,
  setTypedAmount,
}: UseStakeWithGuardProps) => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
 
  const { sendTransaction: sendApproveTransaction } = useTransaction({
    type: TransactionType.APPROVAL,
    successMessage: "Approval successful!",
  });

  const { sendTransaction: sendStakeTransaction } = useTransaction({
    type: TransactionType.STAKE_OVL,
    successMessage: "Successfully staked!",
  });

  const [stakeStep, setStakeStep] = useState<"idle" | "wallet" | "pending">("idle");
  const [attemptingTransaction, setAttemptingTransaction] = useState(false);
  const [depositTokenAddress, setDepositTokenAddress] = useState<Address | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  const { data: token0 } = useReadContract({
    address: ichiVaultAddress,
    abi: ichiVaultAbi,
    functionName: "token0",
    query: {
      enabled: !!ichiVaultAddress, 
    },
  });

  const { data: decimals } = useReadContract({
    address: token0 as Address, 
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!token0, 
    },
  });

  useEffect(() => {
    if (token0) {
      setDepositTokenAddress(token0);
    }
    if (decimals !== undefined) {
      setTokenDecimals(decimals as number);
    }
  }, [token0, decimals]);

  const buttonTitle = useMemo(() => {
    if (stakeStep === "wallet") return "Confirm in wallet";
    if (stakeStep === "pending") return "Pending confirmation...";
    return "Stake";
  }, [stakeStep]);

  const handleStake = async () => {
    if (!typedAmount || !account || !publicClient || !walletClient || !depositTokenAddress) return;

    setAttemptingTransaction(true);
    setStakeStep("wallet");

    try {
      const parsedAmount = parseUnits(typedAmount, tokenDecimals);
      const chain = walletClient.chain;

      const approveHash = await sendApproveTransaction({
        address: depositTokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [ICHIVaultDepositGuard.depositGuardAddress, parsedAmount],
        account,
        chain,
      });
      if (!approveHash) throw new Error('Approve tx failed');

      const {result: estimatedLp} = await publicClient.simulateContract({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardDepositToICHIVault",
        args: [
          ichiVaultAddress,
          ICHIVaultDepositGuard.vaultDeployerAddress,
          depositTokenAddress,
          parsedAmount,
          0n,
          account,
        ],
        account,
        chain,
      });

      const minLpAmount = (estimatedLp * 99n) / 100n;

      setStakeStep("pending");

      const depositArgs = [
        ichiVaultAddress,
        ICHIVaultDepositGuard.vaultDeployerAddress,
        depositTokenAddress,
        parsedAmount,
        minLpAmount,
        account,
      ] as const;

      const estimatedGas = await publicClient.estimateContractGas({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: 'forwardDepositToICHIVault',
        args: depositArgs,
        account,
      });

      const depositHash = await sendStakeTransaction({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardDepositToICHIVault",
        args: depositArgs,
        gas: estimatedGas,
        account,
        chain,
      });

      if (!depositHash) throw new Error('Deposit transaction failed');

    } catch (err) {
      console.error("Stake error:", err);
    } finally {
      setStakeStep("idle");
      setAttemptingTransaction(false);
      setTypedAmount("");
    }
  };

  return {
    handleStake,
    buttonTitle,
    attemptingTransaction,
  };
};