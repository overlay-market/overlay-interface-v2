import { useCallback } from "react"
import { SUPPORTED_CHAINID, WORKING_CHAINS } from "../constants/chains"

export const useSupportedChainId = (chainId?: number): number | undefined => {
  if (!chainId || WORKING_CHAINS.indexOf(SUPPORTED_CHAINID[chainId]) === -1) {
    return
  }

  return chainId as number
}

export const isSupportedChainId = (chainId: number | null): boolean => {
  return !!chainId && WORKING_CHAINS.includes(SUPPORTED_CHAINID[chainId])
}

export const useIsSupportedChainIdCallback = (): (chainId: number) => boolean => {
  return useCallback(
    (chainId: number ) => {
      return isSupportedChainId(chainId)
    },
    [],
  )
}