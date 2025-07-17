import { ChainType, getChains, type ExtendedChain } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined

const useChains = (chainTypes?: ChainType[]) => {
  const { data, isLoading } = useQuery<ExtendedChain[]>({
    queryKey: ['availableChains', chainTypes],
    queryFn: async () => {
      const availableChains = await getChains({ chainTypes });
      return availableChains;
    },
    staleTime: 3_600_000,  
    refetchOnWindowFocus: false, 
    refetchOnMount: false,
  })

  const getChainById: GetChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      if (!chainId) {
        return
      }
      const chain = chains?.find((chain) => chain.id === chainId)
  
      return chain
    },
    [data]
  )

  return {
    chains: data,
    getChainById,
    isLoading,
  }
};

export default useChains;