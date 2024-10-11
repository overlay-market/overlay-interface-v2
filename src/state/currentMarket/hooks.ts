import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { setCurrentMarket } from "./actions";
import { MarketData } from "../../types/marketTypes";

export function useCurrentMarketState(): AppState['currentMarket'] {
  return useAppSelector((state) => state.currentMarket);
}

export const useCurrentMarketActionHandlers = (): {
  handleCurrentMarketSet: (currentMarket: MarketData) => void;
} => {
  const dispatch = useAppDispatch();

  const handleCurrentMarketSet = useCallback(
    (currentMarket: MarketData) => {
      dispatch(setCurrentMarket({ currentMarket }))
    },
    [dispatch]
  )

  return {
    handleCurrentMarketSet
  }
};
