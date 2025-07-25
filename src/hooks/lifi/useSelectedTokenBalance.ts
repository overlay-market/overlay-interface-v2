import { useAccount } from "wagmi";
import { useTradeState } from "../../state/trade/hooks";
import { useQuery } from "@tanstack/react-query";
import { getTokenBalance } from "@lifi/sdk";
import { SelectState } from "../../types/selectChainAndTokenTypes";
import { serializeWithBigInt } from "../../utils/serializeWithBigInt";

export const useSelectedTokenBalance = () => {
  const { address } = useAccount();
  const { selectedToken, chainState, tokenState } = useTradeState();

  return useQuery({
    queryKey: ["tokenBalance", address, serializeWithBigInt(selectedToken)],
    queryFn: async () => {
      if (!address || !selectedToken) throw new Error("Missing address or token");
      return await getTokenBalance(address, selectedToken);
    },
    enabled: !!address && !!selectedToken && chainState === SelectState.SELECTED &&
      tokenState === SelectState.SELECTED,
    staleTime: 60_000, 
    refetchInterval: 60_000, 
  });
}