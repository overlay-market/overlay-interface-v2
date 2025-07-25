import { useQuery } from "@tanstack/react-query";
import { ExtendedChain } from "@lifi/sdk";
import { useTradeState } from "../../state/trade/hooks";
import useChains from "./useChains";

export const useSelectedChain = () => {
  const { selectedChainId } = useTradeState();
  const { getChainById, isLoading: chainsLoading } = useChains();

  const queryEnabled = !!selectedChainId && !chainsLoading;

  const {
    data: selectedChain,
    isLoading: loadingChain,
    isFetching,
  } = useQuery<ExtendedChain | undefined>({
    queryKey: ["selected-chain", selectedChainId],
    queryFn: () => {
      if (!selectedChainId) return undefined;
      return getChainById(selectedChainId);
    },
    enabled: queryEnabled,
    refetchOnWindowFocus: false,
  });

  return { selectedChain, loadingChain: loadingChain || isFetching };
};