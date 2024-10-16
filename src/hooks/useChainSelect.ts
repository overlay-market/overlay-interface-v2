import { useCallback } from 'react'
import { useAppDispatch } from '../state/hooks'
import { UserRejectedRequestError } from 'viem'
import useChainSwitch from './useChainSwitch'

const useChainSelect = () => {
  const dispatch = useAppDispatch()
  const  switchChain = useChainSwitch()

  return useCallback(
     async (targetChain: number) => {
      try {
        switchChain(targetChain)
        return true
      } catch (error: any) {
        if (
          !error?.message?.includes("Request of type 'wallet_switchEthereumChain' already pending") &&
          !(error instanceof UserRejectedRequestError) /* request already pending */
        ) {
          console.log(error)
        }
        return false
      }
    },
    [dispatch, switchChain],
  )
}

export default useChainSelect;