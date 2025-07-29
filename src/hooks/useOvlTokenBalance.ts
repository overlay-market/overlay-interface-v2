import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import useSDK from "../providers/SDKProvider/useSDK";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import { useIsNewTxnHash } from "../state/trade/hooks";
import { useEffect } from "react";

const fetchTokenBalance = async (
  sdk: ReturnType<typeof useSDK>,
  account: `0x${string}`,
) => {
  const balance = await sdk.ovl.balance(account, 8);
  return Number(balance);
};

export const useOvlTokenBalance = () => {
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();

  const queryKey = ["ovlBalance", account, chainId];

  const {
    data: ovlBalance,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      account && chainId && sdk ? fetchTokenBalance(sdk, account) : undefined,
    enabled: Boolean(account && chainId && sdk),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,  
  });

  useEffect(() => {
    if (isNewTxnHash) {
      refetch();
    }
  }, [isNewTxnHash, refetch]);

  return { ovlBalance, isLoading, isError, refetch };
};