import { createReducer } from "@reduxjs/toolkit";
import {
  setCurrentMarket
} from "./actions";
import { MarketDataParsed } from "../../types/marketTypes";

export interface CurrentMarketState {
  readonly currentMarket: MarketDataParsed | undefined;
}

export const initialState: CurrentMarketState = {
  currentMarket: undefined
};

export default createReducer<CurrentMarketState>(initialState, (builder) =>
  builder
    .addCase(setCurrentMarket, (state, action) => {
      state.currentMarket = action.payload.currentMarket;
    })
);
