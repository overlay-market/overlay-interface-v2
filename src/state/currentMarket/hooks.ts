import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../state";
import { setCurrentMarket } from "./actions";
import { ExpandedMarketData } from "overlay-sdk";

export function useCurrentMarketState(): AppState['currentMarket'] {
  return useAppSelector((state) => state.currentMarket);
}

export const useCurrentMarketActionHandlers = (): {
  handleCurrentMarketSet: (currentMarket: ExpandedMarketData) => void;
} => {
  const dispatch = useAppDispatch();

  const handleCurrentMarketSet = useCallback(
    (currentMarket: ExpandedMarketData) => {
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
        parsedAnnualFundingRate: currentMarket.parsedAnnualFundingRate?.toString(),
        parsedAsk: currentMarket.parsedAsk?.toString(),
        parsedBid: currentMarket.parsedBid?.toString(),
        parsedCapOi: currentMarket.parsedCapOi?.toString(),
        parsedDailyFundingRate: currentMarket.parsedDailyFundingRate?.toString(),
        parsedMid: currentMarket.parsedMid?.toString(),
        parsedOiLong: currentMarket.parsedOiLong?.toString(),
        parsedOiShort: currentMarket.parsedOiShort?.toString(),
      }

      dispatch(setCurrentMarket({ currentMarket: currentMarketParsed }))
    },
    [dispatch]
  )

  return {
    handleCurrentMarketSet
  }
};
