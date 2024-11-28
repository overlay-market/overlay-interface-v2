import { useEffect } from 'react'
import useAccount from './useAccount'
import useMultichainContext from '../providers/MultichainContextProvider/useMultichainContext'
import useChainSelect from './useChainSelect'
import usePrevious from './usePrevious'
import { CHAIN_ID_LOCAL_STORAGE_KEY } from '../components/Wallet/ChainSwitch'

const useSyncChainQuery = (chainIdRef: React.MutableRefObject<number | undefined>) => {
  const account = useAccount()
  
  const { chainId: chainIdMultichainContext } = useMultichainContext()
  const prevConnectedChainId = usePrevious(chainIdMultichainContext)
  const prevAccountAddress = usePrevious(account.address)

  const selectChain = useChainSelect()

  // Sync chainId changes to localStorage
  useEffect(() => {
    console.log("Sync chainId changes to localStorage usesync", {chainIdMultichainContext, current: localStorage.getItem(CHAIN_ID_LOCAL_STORAGE_KEY)})
    if (chainIdMultichainContext) {
      localStorage.setItem(CHAIN_ID_LOCAL_STORAGE_KEY, chainIdMultichainContext.toString());
    }
  }, [chainIdMultichainContext]);

  // Handle chain switching logic on reconnect
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