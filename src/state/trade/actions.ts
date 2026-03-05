import { createAction } from '@reduxjs/toolkit';
import { SelectState } from '../../types/selectChainAndTokenTypes';
import { OptimisticPosition } from './reducer';

export enum DefaultTxnSettings {
  DEFAULT_SLIPPAGE = '1',
}

export const typeInput = createAction<{ typedValue: string }>('trade/typeInput');
export const selectLeverage = createAction<{ selectedLeverage: string }>('trade/selectLeverage');
export const selectPositionSide = createAction<{ isLong: boolean }>('trade/selectPositionSide');
export const setSlippage = createAction<{ slippageValue: DefaultTxnSettings | string }>('trade/setSlippage');
export const updateTxnHash = createAction<{ txnHash: string }>('trade/updateTxnHash');
export const selectChain = createAction<{ selectedChainId: number }>('trade/selectChain');
export const selectToken = createAction<{ selectedToken: string }>('trade/selectToken');
export const setChainState = createAction<{
  chainState: SelectState;
}>('trade/setChainState');
export const setTokenState = createAction<{
  tokenState: SelectState;
}>('trade/setTokenState');
export const setCollateralType = createAction<{
  collateralType: 'OVL' | 'USDT';
}>('trade/setCollateralType');
export const setUnwindPreference = createAction<{
  unwindPreference: 'normal' | 'stable';
}>('trade/setUnwindPreference');
export const resetTradeState = createAction<void>('trade/resetTradeState');
export const addOptimisticPosition = createAction<OptimisticPosition>('trade/addOptimisticPosition');
export const removeOptimisticPosition = createAction<{ txHash: string }>('trade/removeOptimisticPosition');
export const clearOptimisticPositions = createAction<void>('trade/clearOptimisticPositions');