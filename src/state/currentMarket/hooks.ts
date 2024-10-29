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
      const currentMarketParsed = {
        ...currentMarket,
        ask: currentMarket.ask.toString(),
        bid: currentMarket.bid.toString(),
        capOi: currentMarket.capOi.toString(),
        circuitBreakerLevel: currentMarket.circuitBreakerLevel.toString(),
        fundingRate: currentMarket.fundingRate.toString(),
        mid: currentMarket.mid.toString(),
        oiLong: currentMarket.oiLong.toString(),
        oiShort: currentMarket.oiShort.toString(),  
        volumeAsk: currentMarket.volumeAsk.toString(),
        volumeBid: currentMarket.volumeBid.toString(),
      }

      dispatch(setCurrentMarket({ currentMarket: currentMarketParsed }))
    },
    [dispatch]
  )

  return {
    handleCurrentMarketSet
  }
};
