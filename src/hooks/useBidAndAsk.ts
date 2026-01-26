import { useQuery } from "@tanstack/react-query";
import useSDK from "../providers/SDKProvider/useSDK";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import { limitDigitsInDecimals } from "overlay-sdk";

const useBidAndAsk = (marketId: string | null): { bid: number | undefined; ask: number | undefined } => {
  const sdk = useSDK();
  const { chainId } = useMultichainContext();

  const { data } = useQuery({
    queryKey: ["bidAsk", chainId, marketId],
    queryFn: async () => {
      if (!marketId) throw new Error("Market ID required");

      const bidAndAsk = await sdk.trade.getBidAndAsk(marketId, 8);

      return {
        bid: bidAndAsk?.bid
          ? Number(limitDigitsInDecimals(bidAndAsk.bid as number).replaceAll(",", ""))
          : undefined,
        ask: bidAndAsk?.ask
          ? Number(limitDigitsInDecimals(bidAndAsk.ask as number).replaceAll(",", ""))
          : undefined,
      };
    },
    enabled: Boolean(marketId && sdk),
    staleTime: 10_000,        // 10 seconds
    refetchInterval: 10_000,  // Poll every 10s
    refetchIntervalInBackground: true,
  });

  return {
    bid: data?.bid,
    ask: data?.ask,
  };
};

export default useBidAndAsk;
