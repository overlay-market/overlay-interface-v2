import { createReducer } from "@reduxjs/toolkit";
import {
  updateMarkets
} from "./actions";
import { MarketData } from "../../types/marketTypes";

export interface MarketsState {
  readonly markets: MarketData[] | undefined;
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
