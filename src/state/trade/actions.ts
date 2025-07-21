import { TokenAmount } from '@lifi/sdk';
import { createAction } from '@reduxjs/toolkit';
import { SelectState } from '../../types/selectChainAndTokenTypes';

export enum DefaultTxnSettings { 
  DEFAULT_SLIPPAGE = '1',
};

export const typeInput = createAction<{ typedValue: string }>('trade/typeInput');
export const selectLeverage = createAction<{ selectedLeverage: string }>('trade/selectLeverage');
export const selectPositionSide = createAction<{ isLong: boolean }>('trade/selectPositionSide');
export const setSlippage = createAction<{ slippageValue: DefaultTxnSettings | string }>('trade/setSlippage');
export const updateTxnHash = createAction<{ txnHash: string }>('trade/updateTxnHash');
export const selectChain = createAction<{ selectedChainId: number }>('trade/selectChain');
export const selectToken = createAction<{ selectedToken: TokenAmount }>('trade/selectToken');
export const setChainState = createAction<{
  chainState: SelectState;
}>('trade/setChainState');
export const setTokenState = createAction<{
  tokenState: SelectState;
}>('trade/setTokenState');
export const resetTradeState = createAction<void>('trade/resetTradeState');