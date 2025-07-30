import { ChainType, getTokens, TokensResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import useChains from './useChains';
import { useChainAndTokenState } from '../../state/trade/hooks';

const useTokensByChain = () => {
  const { selectedChainId } = useChainAndTokenState();

  const { data, isLoading } = useQuery<TokensResponse>({
    queryKey: ['tokensByChain', selectedChainId],
    queryFn: () =>
      getTokens({
        chainTypes: [
          ChainType.EVM,          
        ],
      }),
    refetchInterval: 3_600_000,
    staleTime: 3_600_000,
  })

  const {
    chains,
    isLoading: isSupportedChainsLoading,
    getChainById,
  } = useChains()

  const filteredData = useMemo(() => {
    if (isSupportedChainsLoading || !data) {
      return
    }
    const chain = getChainById(selectedChainId, chains)
    const chainAllowed = selectedChainId && chain
    if (!chainAllowed) {
      return
    }
    let filteredTokens = data.tokens?.[selectedChainId] || []    

    return {
      tokens: filteredTokens,
      chain,
    }
  }, [
    chains,
    data,
    getChainById,
    isSupportedChainsLoading,
    selectedChainId,
  ])

  return {
    tokens: filteredData?.tokens,
    chain: filteredData?.chain,
    isLoading,
  }
};

export default useTokensByChain;