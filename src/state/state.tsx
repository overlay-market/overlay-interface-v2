import { configureStore } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import { setupListeners } from "@reduxjs/toolkit/query";
import { updateVersion } from "./global/actions";
import trade from "./trade/reducer";
import currentMarket from "./currentMarket/reducer";
import markets from "./markets/reducer";
import application from "./application/reducer";

const PERSISTED_KEYS: string[] = ["user", "transactions"];

const store = configureStore({
  reducer: {
    application,
    trade,
    currentMarket,
    markets,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(
      save({ states: PERSISTED_KEYS, debounce: 1000 })
    ),
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
