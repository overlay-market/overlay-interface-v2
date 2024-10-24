import { createReducer } from "@reduxjs/toolkit";
import {
  updateMarkets
} from "./actions";
import { MarketDataParsed } from "../../types/marketTypes";

export interface MarketsState {
  readonly markets: MarketDataParsed[] | undefined;
}

export const initialState: MarketsState = {
  markets: undefined
};

export default createReducer<MarketsState>(initialState, (builder) =>
  builder
    .addCase(updateMarkets, (state, action) => {
      state.markets = action.payload.markets;
    })
);
