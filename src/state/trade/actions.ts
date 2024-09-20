import { createAction } from '@reduxjs/toolkit';

export enum DefaultTxnSettings { 
  DEFAULT_SLIPPAGE = '1',
  DEFAULT_DEADLINE = '30'
};

export const typeInput = createAction<{ typedValue: string | undefined }>('trade/typeInput');
export const selectLeverage = createAction<{ selectedLeverage: string }>('trade/selectLeverage');
export const selectPositionSide = createAction<{ isLong: boolean }>('trade/selectPositionSide');
export const setSlippage = createAction<{ slippageValue: DefaultTxnSettings | string }>('trade/setSlippage');
export const setTxnDeadline = createAction<{ txnDeadline: DefaultTxnSettings | string  }>('trade/setTxnDeadline');
export const resetTradeState = createAction<void>('trade/resetTradeState');