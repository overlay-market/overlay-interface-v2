import { createReducer } from "@reduxjs/toolkit";
import {
  DefaultTxnSettings,
  typeInput,
  selectLeverage,
  selectPositionSide,
  setSlippage,
  selectChain,
  updateTxnHash,
  resetTradeState,
  selectToken,
  setChainState,
  setTokenState,
  setCollateralType
} from "./actions";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { getFromLocalStorage } from "../../utils/getFromLocalStorage";
import { deserializeWithBigInt, serializeWithBigInt } from "../../utils/serializeWithBigInt";
import { DEFAULT_TOKEN } from "../../constants/applications";
import { SelectState } from "../../types/selectChainAndTokenTypes";

export interface TradeState {
  readonly typedValue: string;
  readonly selectedLeverage: string;
  readonly isLong: boolean;
  readonly slippageValue: DefaultTxnSettings | string;
  readonly selectedChainId: number;
  readonly selectedToken: string;
  readonly txnHash: string;
  readonly previousTxnHash: string;
  readonly chainState: SelectState;
  readonly tokenState: SelectState;
  readonly collateralType: 'OVL' | 'USDT';
}

export const initialState: TradeState = {
  typedValue: "",
  selectedLeverage: "5",
  isLong: true,
  slippageValue: "1",
  selectedChainId: getFromLocalStorage('lifiSelectedChainId', DEFAULT_CHAINID as number),
  selectedToken: serializeWithBigInt(getFromLocalStorage(
    'lifiSelectedToken',
    DEFAULT_TOKEN,
    deserializeWithBigInt
  )),
  txnHash: '',
  previousTxnHash: '',
  chainState: SelectState.LOADING,
  tokenState: SelectState.LOADING,
  collateralType: getFromLocalStorage('collateralType', 'USDT') as 'OVL' | 'USDT',
};

export default createReducer<TradeState>(initialState, (builder) =>
  builder
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      state.typedValue = typedValue;
    })
    .addCase(selectLeverage, (state, { payload: { selectedLeverage } }) => {
      state.selectedLeverage = selectedLeverage;
    })
    .addCase(selectPositionSide, (state, { payload: { isLong } }) => {
      state.isLong = isLong;
    })
    .addCase(setSlippage, (state, action) => {
      state.slippageValue = action.payload.slippageValue;
    })
    .addCase(selectChain, (state, action) => {
      state.selectedChainId = action.payload.selectedChainId;
    })
    .addCase(selectToken, (state, action) => {
      state.selectedToken = action.payload.selectedToken;
    })
    .addCase(setChainState, (state, action) => {
      state.chainState = action.payload.chainState;
    })
    .addCase(setTokenState, (state, action) => {
      state.tokenState = action.payload.tokenState;
    })
    .addCase(updateTxnHash, (state, action) => {
      state.previousTxnHash = state.txnHash;
      state.txnHash = action.payload.txnHash;
    })
    .addCase(setCollateralType, (state, action) => {
      state.collateralType = action.payload.collateralType;
    })
    .addCase(resetTradeState, (state) => {
      state.typedValue = initialState.typedValue;
      state.selectedLeverage = initialState.selectedLeverage;
      state.isLong = initialState.isLong;
    })
);
