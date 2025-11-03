import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { DefaultTxnSettings, resetTradeState, selectChain, selectLeverage, selectPositionSide, selectToken, setChainState, setSlippage, setTokenState, typeInput, updateTxnHash } from "./actions";
import usePrevious from "../../hooks/usePrevious";
import useSDK from "../../providers/SDKProvider/useSDK";
import {  TokenAmount } from "@lifi/sdk";
import { deserializeWithBigInt, serializeWithBigInt } from "../../utils/serializeWithBigInt";
import { SelectState } from "../../types/selectChainAndTokenTypes";
import { useOvlTokenBalance } from "../../hooks/useOvlTokenBalance";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { useSelectedChain } from "../../hooks/lifi/useSelectedChain";
import { DEFAULT_TOKEN } from "../../constants/applications";
import useAccount from "../../hooks/useAccount";

export const MINIMUM_SLIPPAGE_VALUE = 0.05;

export function useTradeState(): AppState['trade'] {
  return useAppSelector((state) => state.trade);
}

export function useChainAndTokenState(): {
  selectedChainId: number;
  selectedToken: TokenAmount;
  chainState: SelectState;
  tokenState: SelectState;
} {
  return useAppSelector((state) => ({
    selectedChainId: state.trade.selectedChainId,
    selectedToken: deserializeWithBigInt(state.trade.selectedToken),
    chainState: state.trade.chainState,
    tokenState: state.trade.tokenState,
  }));
}

const slippageRegex: RegExp = /^(?:\d{1,2}(?:\.\d{0,2})?|\.\d{1,2}|100(?:\.0{1,2})?)?$/;

export const useTradeActionHandlers = (): {
  handleAmountInput: (typedValue: string) => void;
  handleLeverageSelect: (selectedLeverage: string) => void;
  handlePositionSideSelect: (isLong: boolean) => void;
  handleSlippageSet: (slippageValue: DefaultTxnSettings | string) => void;
  handleTxnHashUpdate: (txnHash: string, txnBlockNumber: number) => void;
  handleChainSelect: (selectedChainId: number) => void;
  handleTokenSelect: (selectedToken: TokenAmount) => void;
  handleChainStateChange: (chainState: SelectState) => void;
  handleTokenStateChange: (tokenState: SelectState) => void;
  handleTradeStateReset: () => void;
} => {
  const dispatch = useAppDispatch();
  const sdk = useSDK();

  const handleAmountInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }))
    },
    [dispatch]
  );

  const handleLeverageSelect = useCallback(
    (selectedLeverage: string) => {
      dispatch(selectLeverage({ selectedLeverage }))
    },
    [dispatch]
  );

  const handlePositionSideSelect = useCallback(
    (isLong: boolean) => {
      dispatch(selectPositionSide({ isLong }))
    },
    [dispatch]
  );

  const handleSlippageSet = useCallback(
    (slippageValue: DefaultTxnSettings | string) => {
      if (Number(slippageValue) < MINIMUM_SLIPPAGE_VALUE && slippageValue.length > 3) {
        dispatch(setSlippage({slippageValue: MINIMUM_SLIPPAGE_VALUE.toString()}))
      }
      if(slippageValue === '.') {
        dispatch(setSlippage({ slippageValue }))
      }
      if(slippageRegex.test(slippageValue)) {
        dispatch(setSlippage({ slippageValue }))
      }

      localStorage.setItem(`slippage`, slippageValue ?? DefaultTxnSettings.DEFAULT_SLIPPAGE)
    },
    [dispatch]
  )

  const handleChainSelect = useCallback(
    (selectedChainId: number) => {
      dispatch(selectChain({ selectedChainId }));
      localStorage.setItem('lifiSelectedChainId', selectedChainId.toString());
    },
    [dispatch]
  );

  const handleTokenSelect = useCallback(
  (selectedToken: TokenAmount) => {
    const serializedToken = serializeWithBigInt(selectedToken);
    dispatch(selectToken({ selectedToken: serializedToken }));
    localStorage.setItem('lifiSelectedToken', serializedToken);
  },
  [dispatch]
);

  const handleChainStateChange = useCallback(
    (chainState: SelectState) => {
      dispatch(setChainState({ chainState }));
    },
    [dispatch]
  );

  const handleTokenStateChange = useCallback(
    (tokenState: SelectState) => {
      dispatch(setTokenState({ tokenState }));
    },
    [dispatch]
  );

  const handleTxnHashUpdate =  useCallback(
    async (txnHash: string, txnBlockNumber: number) => {
      const checkSubgraphBlock = async () => {
        const lastSubgraphBlock = await sdk.core.getLastSubgraphProcessedBlock();

        if (lastSubgraphBlock > txnBlockNumber) {
          dispatch(updateTxnHash({ txnHash }));
        } else {
          setTimeout(checkSubgraphBlock, 1000);
        }
      };
  
      checkSubgraphBlock();          
    },
    [dispatch]
  );

  const handleTradeStateReset = useCallback(
    () => {
      dispatch(resetTradeState())
    },
    [dispatch]
  )

  return {
    handleAmountInput,
    handleLeverageSelect,
    handlePositionSideSelect,
    handleSlippageSet,
    handleChainSelect,
    handleTokenSelect,
    handleTxnHashUpdate,
    handleChainStateChange,
    handleTokenStateChange,
    handleTradeStateReset,
  }
};

export const useIsNewTxnHash = (): boolean => {
  const txnHash = useAppSelector((state) => state.trade.txnHash);
  const [hasInitialized, setHasInitialized] = useState(false);
  const previousTxnHash = usePrevious(txnHash)

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  return hasInitialized && txnHash !== '' && txnHash !== previousTxnHash;
}

export const useSelectStateManager = () => {
  const dispatch = useAppDispatch();
  const {selectedChainId, chainState,  selectedToken} = useChainAndTokenState();
  const { ovlBalance, isLoading } = useOvlTokenBalance();
  const { loadingChain } = useSelectedChain();
  const { address: account } = useAccount();
  const { handleTokenSelect } = useTradeActionHandlers();
  
  // Effect to manage chain state
  useEffect(() => {
    if ( isLoading || loadingChain) return;

    if (account === undefined) {
      dispatch(setChainState({ chainState: SelectState.EMPTY }));
      return;
    }  

    if (selectedChainId === DEFAULT_CHAINID && selectedToken.address === DEFAULT_TOKEN.address) {
      dispatch(setChainState({ chainState: SelectState.DEFAULT }));
    } else {
      dispatch(setChainState({ chainState: SelectState.SELECTED }));
    }
  }, [selectedChainId, isLoading, loadingChain, account, selectedToken]);

  // Effect to manage token state
  useEffect(() => {
    if ( isLoading || loadingChain) return;

    if (account === undefined) {
      dispatch(setTokenState({ tokenState: SelectState.EMPTY }));
      return;
    }
    if (selectedToken.chainId !== selectedChainId) {
      dispatch(setTokenState({ tokenState: SelectState.EMPTY }));
    }
    if (selectedChainId === DEFAULT_CHAINID && selectedToken.address === DEFAULT_TOKEN.address) {
      dispatch(setTokenState({ tokenState: SelectState.DEFAULT }));
      return;
    }
    if (selectedToken.chainId === selectedChainId && chainState === SelectState.SELECTED) {
      dispatch(setTokenState({ tokenState: SelectState.SELECTED }));
    }
  }, [selectedToken, selectedChainId, chainState, account]);

  useEffect(() => {
    if (ovlBalance === undefined || isLoading || loadingChain) return;

    if (selectedChainId === DEFAULT_CHAINID && ovlBalance > 0 && selectedToken.chainId !== DEFAULT_CHAINID && selectedToken.address !== DEFAULT_TOKEN.address) {
      handleTokenSelect(DEFAULT_TOKEN);
      dispatch(setChainState({ chainState: SelectState.DEFAULT }));
      dispatch(setTokenState({ tokenState: SelectState.DEFAULT }));
     
    }
  }, [selectedChainId, ovlBalance, isLoading, loadingChain, selectedToken]);
};