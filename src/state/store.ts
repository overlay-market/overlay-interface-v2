import { configureStore } from "@reduxjs/toolkit";
import powercardsReducer from "./powercards/slice";
import tradeReducer from "./trade/reducer";

export const store = configureStore({
  reducer: {
    powercards: powercardsReducer,
    trade: tradeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
