import { useQuery } from "@tanstack/react-query";
import { ExtendedChain } from "@lifi/sdk";
import { useChainAndTokenState } from "../../state/trade/hooks";
import useChains from "./useChains";

export const useSelectedChain = () => {
  const { selectedChainId } = useChainAndTokenState();
  const { getChainById, isLoading: chainsLoading } = useChains();

  const queryEnabled = !!selectedChainId && !chainsLoading;

  const {
    data: selectedChain,
    isLoading: loadingChain,
    isFetching,
  } = useQuery<ExtendedChain | null>({
    queryKey: ["selected-chain", selectedChainId],
    queryFn: () => {
      if (!selectedChainId) return null;
      return getChainById(selectedChainId) ?? null;
    },
    enabled: queryEnabled,
    refetchOnWindowFocus: false,
  });

  return { selectedChain: selectedChain ?? null, loadingChain: loadingChain || isFetching };
};