import { createAction } from '@reduxjs/toolkit';

export enum DefaultTxnSettings { 
  DEFAULT_SLIPPAGE = '1',
};

export const typeInput = createAction<{ typedValue: string }>('trade/typeInput');
export const selectLeverage = createAction<{ selectedLeverage: string }>('trade/selectLeverage');
export const selectPositionSide = createAction<{ isLong: boolean }>('trade/selectPositionSide');
export const setSlippage = createAction<{ slippageValue: DefaultTxnSettings | string }>('trade/setSlippage');
export const updateTxnHash = createAction<{ txnHash: string }>('trade/updateTxnHash')
export const resetTradeState = createAction<void>('trade/resetTradeState');