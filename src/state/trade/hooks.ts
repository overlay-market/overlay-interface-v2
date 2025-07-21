import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { DefaultTxnSettings, resetTradeState, selectChain, selectLeverage, selectPositionSide, selectToken, setChainState, setSlippage, setTokenState, typeInput, updateTxnHash } from "./actions";
import usePrevious from "../../hooks/usePrevious";
import useSDK from "../../providers/SDKProvider/useSDK";
import { ExtendedChain, TokenAmount } from "@lifi/sdk";
import { serializeWithBigInt } from "../../utils/serializeWithBigInt";
import { SelectState } from "../../types/selectChainAndTokenTypes";
import { useOvlTokenBalance } from "../../hooks/useOvlTokenBalance";
import { DEFAULT_CHAINID } from "../../constants/chains";

export const MINIMUM_SLIPPAGE_VALUE = 0.05;

export function useTradeState(): AppState['trade'] {
  return useAppSelector((state) => state.trade);
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
      dispatch(selectToken({ selectedToken }));
      localStorage.setItem('lifiSelectedToken', serializeWithBigInt(selectedToken));
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
  const previousTxnHash = usePrevious(txnHash)
  
  return txnHash !== '' && txnHash !== previousTxnHash
}

export const useChainState = (): SelectState => {
  return useAppSelector((state) => state.trade.chainState);
};

export const useTokenState = (): SelectState => {
  return useAppSelector((state) => state.trade.tokenState);
};

export const useSelectStateManager = (selectedChain: ExtendedChain | undefined) => {
  const dispatch = useAppDispatch();
  const { selectedChainId, selectedToken, chainState, tokenState } = useAppSelector((state) => state.trade);
  const { ovlBalance, isLoading } = useOvlTokenBalance();

  // Effect to manage chain state
  useEffect(() => {
    if (!ovlBalance || isLoading) return;

    if (selectedChainId === DEFAULT_CHAINID && ovlBalance > 0) {
      dispatch(setChainState({ chainState: SelectState.DEFAULT }));
    }
    if (selectedChainId === DEFAULT_CHAINID && ovlBalance === 0) {
      dispatch(setChainState({ chainState: SelectState.EMPTY }));
    }
    if (selectedChainId !== DEFAULT_CHAINID && selectedChain !== undefined && selectedChain.id === selectedChainId) {
      dispatch(setChainState({ chainState: SelectState.SELECTED }));
    }
  }, [selectedChainId, chainState, dispatch, ovlBalance, selectedChain, isLoading]);

  // Effect to manage token state
  useEffect(() => {
    if (chainState === SelectState.DEFAULT) {
      dispatch(setTokenState({ tokenState: SelectState.DEFAULT }));
      return;
    }
    if (selectedToken.chainId !== selectedChainId ) {
      dispatch(setTokenState({ tokenState: SelectState.EMPTY }));
    }
    if (selectedToken.chainId === selectedChainId && chainState === SelectState.SELECTED) {
      dispatch(setTokenState({ tokenState: SelectState.SELECTED }));
    }
  }, [selectedToken, tokenState, dispatch, selectedChainId, chainState]);
};