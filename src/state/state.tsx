import { configureStore } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import { setupListeners } from "@reduxjs/toolkit/query";
import { updateVersion } from "./global/actions";
import trade, { initialState as tradeInitialState } from "./trade/reducer";
import currentMarket from "./currentMarket/reducer";
import application from "./application/reducer";

const PERSISTED_KEYS: string[] = ["application", "trade", "currentMarket"];

function safeLoad(states: string[]) {
  try {
    const loaded = load({ states });
    // Merge loaded trade state with initialState to fill in missing fields
    if (loaded && typeof loaded === 'object' && 'trade' in loaded) {
      (loaded as Record<string, unknown>).trade = {
        ...tradeInitialState,
        ...(loaded.trade as Record<string, unknown>)
      };
    }
    return loaded;
  } catch (e) {
    console.warn("[Redux-LocalStorage-Simple] load failed, using defaults", e);
    return undefined; // fall back to reducer defaults
  }
}

const store = configureStore({
  reducer: {
    application,
    trade,
    currentMarket,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(
      save({ states: PERSISTED_KEYS, debounce: 1000 })
    ),
  preloadedState: safeLoad(PERSISTED_KEYS),
});

store.dispatch(updateVersion());
setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
