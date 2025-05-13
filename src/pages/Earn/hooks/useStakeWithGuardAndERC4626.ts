import { useState, useMemo, useEffect } from "react";
import { Address, erc20Abi, parseEventLogs, parseUnits, zeroAddress } from "viem";
import useAccount from "../../../hooks/useAccount";
import { useTransaction } from "./useTransaction";
import { TransactionType } from "../../../constants/transaction";
import { ichiVaultDepositGuardABI } from "../abi/ichiVaultDepositGuardABI";
import { ICHIVaultDepositGuard } from "../../../constants/vaults";
import { usePublicClient, useWalletClient, useReadContract } from "wagmi";
import { useVaultsState } from "../../../state/vaults/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ichiVaultABI } from "../abi/ichiVaultABI";
import { getERC4626VaultItemByVaultId, getIchiVaultItemByVaultId } from "../utils/getVaultItem";
import { StakeResult } from "./useStake";
import { ERC4626ABI } from "../abi/ERC4626ABI";

type UseStakeWithGuardAndERC4626Props = {
  vaultId: number;
  typedAmount: string;
  setTypedAmount: (val: string) => void;
};

export const useStakeWithGuardAndERC4626 = ({
  vaultId,
  typedAmount,
  setTypedAmount,
}: UseStakeWithGuardAndERC4626Props): StakeResult => {
  const ichiVaultAddress =
    getIchiVaultItemByVaultId(vaultId)?.vaultAddress ?? zeroAddress;
  const ERC4626VaultAddress = getERC4626VaultItemByVaultId(vaultId)?.vaultAddress ?? zeroAddress;  

  if (ichiVaultAddress === zeroAddress || ERC4626VaultAddress === zeroAddress) {
    return {
      handleStake: async () => {},
      buttonTitle: 'Stake',
      attemptingTransaction: false,
    };
  }

  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { slippageValue } = useVaultsState();
  const queryClient = useQueryClient();
 
  const { sendTransaction: sendApproveTransaction } = useTransaction({
    type: TransactionType.APPROVAL,
    successMessage: "Approval successful!",
    skipGasEstimation: true,
  });

  const { sendTransaction: sendStakeToIchiVault, txReceipt } = useTransaction({
    type: TransactionType.STAKE_OVL,
    successMessage: "Successfully staked!",
  });

  const { sendTransaction: sendStakeToERC4626, txHash } = useTransaction({
    type: TransactionType.STAKE_OVL,
    successMessage: "Successfully staked!",
  });

  const [stakeStep, setStakeStep] = useState<"idle" | "wallet" | "pending">("idle");
  const [attemptingTransaction, setAttemptingTransaction] = useState(false);
  const [depositTokenAddress, setDepositTokenAddress] = useState<Address | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  const { data: token0 } = useReadContract({
    address: ichiVaultAddress,
    abi: ichiVaultABI,
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

      const slippageBasisPoints = BigInt(Math.floor(parseFloat(slippageValue) * 100));
      const denominator = 10000n;
      const minLpAmount = (estimatedLp * (denominator - slippageBasisPoints)) / denominator;

      setStakeStep("pending");

      const depositArgs = [
        ichiVaultAddress,
        ICHIVaultDepositGuard.vaultDeployerAddress,
        depositTokenAddress,
        parsedAmount,
        minLpAmount,
        account,
      ] as const;

      await sendStakeToIchiVault({
        address: ICHIVaultDepositGuard.depositGuardAddress,
        abi: ichiVaultDepositGuardABI,
        functionName: "forwardDepositToICHIVault",
        args: depositArgs,
        account,
        chain,
      });

      if (!txReceipt) throw new Error('Stake tx failed');

      setStakeStep("wallet");
      
      const log = parseEventLogs({
        abi: ichiVaultABI,
        logs: txReceipt.logs,
        eventName: 'Deposit', 
      });

      const stakedTokensAmount = log[0].args.shares;
    
      if (!stakedTokensAmount || stakedTokensAmount === 0n) {
        throw new Error('Invalid staked tokens amount');
      }
     
      const approveERC4626Hash = await sendApproveTransaction({
        address: ichiVaultAddress,
        abi: ichiVaultABI,
        functionName: 'approve',
        args: [ERC4626VaultAddress, stakedTokensAmount],
        account,
        chain,
      });
      if (!approveERC4626Hash) throw new Error('Approve tx failed');

      setStakeStep("pending");

      await sendStakeToERC4626({
        address: ERC4626VaultAddress,
        abi: ERC4626ABI,
        functionName: "deposit",
        args: [stakedTokensAmount, ERC4626VaultAddress],
        account,
        chain,
      });

      if (!txHash) throw new Error('Stake tx failed');

      if (txHash) {
        await queryClient.refetchQueries({
          queryKey: ['userCurrentBalance', account, ichiVaultAddress],
          exact: true,
        });
      }

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