import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { encodeFunctionData, Hex } from "viem";
import { referralListAbi } from "./abis/referralListAbi";
import { REFERRAL_LIST_ADDRESS } from "../../constants/applications";

export const useAlreadyClaimed = (
  amount: string,
  proof: Hex[],
): boolean | undefined  => {
  const { address: account, chainId } = useAccount();
  const publicClient = usePublicClient();

   const [alreadyClaimed, setAlreadyClaimed] = useState<boolean>();

    const referralListAddress = chainId
      ? REFERRAL_LIST_ADDRESS[chainId]
      : undefined;

    useEffect(() => {
    const check = async () => {
      if (!amount || !proof?.length || !account || !chainId || !publicClient || !referralListAddress) {
        setAlreadyClaimed(undefined);
        return;
      }

      const calldata = encodeFunctionData({
        abi: referralListAbi,
        functionName: "claimRewards",
        args: [account, BigInt(amount), proof],
      });

      try {
        await publicClient.estimateGas({
          account,
          to: referralListAddress,
          data: calldata,
        });

        setAlreadyClaimed(false);
      } catch (gasError: any) {
        try {
          await publicClient.call({
            account,
            to: referralListAddress,
            data: calldata,
          });
        } catch (callError: any) {
          if (callError.message.includes("0x646cf558")) {
            setAlreadyClaimed(true);
          } else {
            setAlreadyClaimed(false);
            console.error("Unexpected call error", callError);
          }         
        }
      }
    };

    check();
  }, [amount, proof, account, chainId, publicClient, referralListAddress]);

  return alreadyClaimed;
};  
