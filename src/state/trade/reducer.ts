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
  selectToken
} from "./actions";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { getFromLocalStorage } from "../../utils/getFromLocalStorage";
import { TokenAmount } from "@lifi/sdk";
import { deserializeWithBigInt } from "../../utils/serializeWithBigInt";
import { DEFAULT_TOKEN } from "../../constants/applications";

export interface TradeState {
  readonly typedValue: string;
  readonly selectedLeverage: string;
  readonly isLong: boolean;
  readonly slippageValue: DefaultTxnSettings | string;
  readonly selectedChainId: number;
  readonly selectedToken: TokenAmount;
  readonly txnHash: string;
  readonly previousTxnHash: string;
}

export const initialState: TradeState = {
  typedValue: "",
  selectedLeverage: "1",
  isLong: true,
  slippageValue: "1",
  selectedChainId: getFromLocalStorage('lifiSelectedChainId', DEFAULT_CHAINID as number),
  selectedToken: getFromLocalStorage(
    'lifiSelectedToken',
    DEFAULT_TOKEN,
    deserializeWithBigInt
  ),
  txnHash: '',
  previousTxnHash: '',
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
    .addCase(updateTxnHash, (state, action) => {
      state.previousTxnHash = state.txnHash;
      state.txnHash = action.payload.txnHash;
    })
    .addCase(resetTradeState, (state) => {
      state.typedValue = initialState.typedValue;
      state.selectedLeverage = initialState.selectedLeverage;
      state.isLong = initialState.isLong;
    })
);
