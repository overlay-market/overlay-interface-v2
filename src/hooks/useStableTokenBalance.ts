import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import useSDK from "../providers/SDKProvider/useSDK";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import { useIsNewTxnHash } from "../state/trade/hooks";
import { formatUnits } from "viem";
import { useStableTokenInfo } from "./useStableTokenInfo";

const fetchStableTokenBalance = async (
  sdk: ReturnType<typeof useSDK>,
  account: `0x${string}`,
  stableTokenAddress: `0x${string}`,
  decimals: number,
) => {
  const balance = await sdk.core.rpcProvider.readContract({
    address: stableTokenAddress,
    abi: [
      {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
      },
    ],
    functionName: "balanceOf",
    args: [account],
  });

  const balanceNumber = Number(formatUnits(balance as bigint, decimals));
  return Number(balanceNumber.toFixed(2));
};

export const useStableTokenBalance = () => {
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();
  const { data: stableTokenInfo } = useStableTokenInfo();

  const queryKey = ["stableTokenBalance", account, chainId];

  const {
    data: stableBalance,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      account && chainId && sdk && stableTokenInfo
        ? fetchStableTokenBalance(
            sdk,
            account,
            stableTokenInfo.address,
            stableTokenInfo.decimals,
          )
        : undefined,
    enabled: Boolean(account && chainId && sdk && stableTokenInfo),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (isNewTxnHash) {
      refetch();
    }
  }, [isNewTxnHash, refetch]);

  return { stableBalance, isLoading, isError, refetch };
};
