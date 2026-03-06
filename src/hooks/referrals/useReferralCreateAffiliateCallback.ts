import { useCallback, useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { encodeFunctionData } from "viem";
import { useAddPopup } from "../../state/application/hooks";
import { currentTimeParsed } from "../../utils/currentTime";
import { TransactionType } from "../../constants/transaction";
import { REFERRAL_LIST_ADDRESS } from "../../constants/applications";
import { referralListAbi } from "./abis/referralListAbi";
import { calculateGasMargin } from "../../utils/calculateGasMargin";

export enum ReferralCreateAffiliateCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export const useReferralCreateAffiliateCallback = (
  signature: `0x${string}`
): {
  state: ReferralCreateAffiliateCallbackState;
  callback: null | (() => Promise<`0x${string}`>);
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
    if (!signature || !referralListAddress) return undefined;
    try {
      return encodeFunctionData({
        abi: referralListAbi,
        functionName: "allowAffiliate",
        args: [signature],
      });
    } catch (e) {
      console.error("Error encoding calldata", e);
      return undefined;
    }
  }, [signature, referralListAddress]);

  const [state, setState] = useState<ReferralCreateAffiliateCallbackState>(
    account && calldata
      ? ReferralCreateAffiliateCallbackState.VALID
      : ReferralCreateAffiliateCallbackState.INVALID
  );

  const callback = useCallback(async (): Promise<`0x${string}`> => {
    if (
      !signature ||
      !publicClient ||
      !walletClient ||
      !account ||
      !chainId ||
      !referralListAddress ||
      !calldata
    ) {
      throw new Error("Missing Dependencies");
    }

    setState(ReferralCreateAffiliateCallbackState.LOADING);

    try {
      // estimate gas
      let gasEstimate: bigint | undefined;
      try {
        gasEstimate = await publicClient.estimateGas({
          account,
          to: referralListAddress as `0x${string}`,
          data: calldata,
        });
      } catch (gasError: any) {
        console.debug("Gas estimation failed", gasError);
        try {
          await publicClient.call({
            account,
            to: referralListAddress as `0x${string}`,
            data: calldata,
          });
          throw new Error(
            "Unexpected successful call after failed gas estimate."
          );
        } catch (callError: unknown) {
          const errorMessage =
            callError instanceof Error ? callError.message : "Call failed";

          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: errorMessage,
                type: TransactionType.REFERRAL_CREATE_AFFILIATE,
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
        account,
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
            message: "Referral affiliate creation confirmed",
            type: TransactionType.REFERRAL_CREATE_AFFILIATE,
          },
        },
        hash
      );

      setState(ReferralCreateAffiliateCallbackState.VALID);
      return hash;
    } catch (error: unknown) {
      setState(ReferralCreateAffiliateCallbackState.VALID);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "ReferralCreateAffiliate failed";

      addPopup(
        {
          txn: {
            hash: currentTimeForId,
            success: false,
            message: errorMessage,
            type: TransactionType.REFERRAL_CREATE_AFFILIATE,
          },
        },
        currentTimeForId
      );

      console.error("ReferralCreateAffiliate failed", error);
      throw error instanceof Error
        ? error
        : new Error(`ReferralCreateAffiliate failed: ${String(error)}`);
    }
  }, [
    signature,
    publicClient,
    walletClient,
    account,
    chainId,
    referralListAddress,
    calldata,
    addPopup,
    currentTimeForId,
  ]);

  return {
    state,
    callback: account && calldata ? callback : null,
    error:
      account && calldata
        ? null
        : "Missing Dependencies",
  };
}