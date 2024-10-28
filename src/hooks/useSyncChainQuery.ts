import { useEffect } from 'react'
import useAccount from './useAccount'
import useMultichainContext from '../providers/MultichainContextProvider/useMultichainContext'
import useChainSelect from './useChainSelect'
import usePrevious from './usePrevious'

const useSyncChainQuery = (chainIdRef: React.MutableRefObject<number | undefined>) => {
  const account = useAccount()
  
  const { chainId: chainIdMultichainContext } = useMultichainContext()
  const prevConnectedChainId = usePrevious(chainIdMultichainContext)
  const prevAccountAddress = usePrevious(account.address)

  const selectChain = useChainSelect()
  
  useEffect(() => {
    if (account.address && !prevAccountAddress && prevConnectedChainId && account.chainId !== prevConnectedChainId) {
      chainIdRef.current = prevConnectedChainId as number
      selectChain(prevConnectedChainId as number)
    }
   }, [prevConnectedChainId, prevAccountAddress, account.address,  chainIdRef, selectChain, chainIdMultichainContext, account.chainId])

  useEffect(() => {
    if (chainIdRef.current || chainIdRef.current === account.chainId) {
      chainIdRef.current = undefined
      return
    }
  }, [
    account.chainId,
    account.isConnected,
    chainIdRef,
  ])
}

export default useSyncChainQuery;