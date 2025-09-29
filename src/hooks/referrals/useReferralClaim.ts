import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { encodeFunctionData, Hex } from "viem";
import { useAddPopup } from "../../state/application/hooks";
import { currentTimeParsed } from "../../utils/currentTime";
import { TransactionType } from "../../constants/transaction";
import { REFERRAL_LIST_ADDRESS } from "../../constants/applications";
import { referralListAbi } from "./abis/referralListAbi";
import { calculateGasMargin } from "../../utils/calculateGasMargin";

export enum ReferralClaimCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export const useReferralClaim = (
  amount: string,
  proof: Hex[]
): {
  state: ReferralClaimCallbackState;
  callback: null | ((account: `0x${string}`) => Promise<`0x${string}`>);
  error: string | null;
} => {
  const { address: account, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();

  const referralListAddress = chainId
    ? REFERRAL_LIST_ADDRESS[chainId]
    : undefined;

  const calldata = useMemo(() => {
    if (!amount || !proof?.length || !referralListAddress || !account)
      return undefined;

    try {
      return encodeFunctionData({
        abi: referralListAbi,
        functionName: "claimRewards",
        args: [account, BigInt(amount), proof],
      });
    } catch (e) {
      console.error("Error encoding calldata", e);
      return undefined;
    }
  }, [amount, proof, referralListAddress, account]);

  const [state, setState] = useState<ReferralClaimCallbackState>(
    account && calldata
      ? ReferralClaimCallbackState.VALID
      : ReferralClaimCallbackState.INVALID
  );

  useEffect(() => {
    const nextState =
      account && calldata
        ? ReferralClaimCallbackState.VALID
        : ReferralClaimCallbackState.INVALID;

    setState((prev) => {
      if (prev === ReferralClaimCallbackState.LOADING) {
        return prev;
      }

      return prev === nextState ? prev : nextState;
    });
  }, [account, calldata]);

  const callback = useCallback(
    async (claimAccount: `0x${string}`): Promise<`0x${string}`> => {
      if (
        !amount ||
        !proof?.length ||
        !publicClient ||
        !walletClient ||
        !chainId ||
        !referralListAddress ||
        !calldata
      ) {
        throw new Error("Missing Dependencies");
      }

      setState(ReferralClaimCallbackState.LOADING);

      try {
        // estimate gas
        let gasEstimate: bigint | undefined;
        try {
          gasEstimate = await publicClient.estimateGas({
            account: claimAccount,
            to: referralListAddress as `0x${string}`,
            data: calldata,
          });
        } catch (gasError: any) {
          console.debug("Gas estimation failed", gasError);
          try {
            await publicClient.call({
              account: claimAccount,
              to: referralListAddress as `0x${string}`,
              data: calldata,
            });
            throw new Error("Unexpected successful call after failed gas estimate.");
          } catch (callError: unknown) {
            const errorMessage =
              callError instanceof Error ? callError.message : "Call failed";

            addPopup(
              {
                txn: {
                  hash: currentTimeForId,
                  success: false,
                  message: errorMessage,
                  type: TransactionType.REFERRAL_CLAIM,
                },
              },
              currentTimeForId
            );

            throw callError instanceof Error
              ? callError
              : new Error(errorMessage);
          }
        }

        // send tx
        const hash = await walletClient.sendTransaction({
          account: claimAccount,
          to: referralListAddress as `0x${string}`,
          data: calldata,
          ...(gasEstimate ? { gas: calculateGasMargin(gasEstimate) } : {}),
        });

        await publicClient.waitForTransactionReceipt({ hash });

        addPopup(
          {
            txn: {
              hash,
              success: true,
              message: "Referral rewards claimed successfully",
              type: TransactionType.REFERRAL_CLAIM,
            },
          },
          hash
        );

        setState(ReferralClaimCallbackState.VALID);
        return hash;
      } catch (error: unknown) {
        setState(ReferralClaimCallbackState.VALID);

        const errorMessage =
          error instanceof Error ? error.message : "ReferralClaim failed";

        addPopup(
          {
            txn: {
              hash: currentTimeForId,
              success: false,
              message: errorMessage,
              type: TransactionType.REFERRAL_CLAIM,
            },
          },
          currentTimeForId
        );

        console.error("ReferralClaim failed", error);
        throw error instanceof Error
          ? error
          : new Error(`ReferralClaim failed: ${String(error)}`);
      }
    },
    [
      amount,
      proof,
      publicClient,
      walletClient,
      chainId,
      referralListAddress,
      calldata,
      addPopup,
      currentTimeForId,
    ]
  );

  return {
    state,
    callback: account && calldata ? callback : null,
    error: account && calldata ? null : "Missing Dependencies",
  };
};
