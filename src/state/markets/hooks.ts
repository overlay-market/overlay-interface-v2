import {AppState} from '../state'
import {useAppDispatch, useAppSelector} from '../hooks'
import { useCallback } from 'react';
import { updateMarkets } from './actions';
import { ExpandedMarketData } from 'overlay-sdk';

export function useMarketsState(): AppState['markets'] {
  return useAppSelector(state => state.markets)
}

export const useMarketsActionHandlers = (): {
  handleMarketsUpdate: (markets: ExpandedMarketData[]) => void;
} => {
  const dispatch = useAppDispatch();

  const handleMarketsUpdate = useCallback(
    (markets: ExpandedMarketData[]) => {
      const marketsParsed = markets.map((market) => {return {
        ...market,
        ask: market.ask.toString(),
        bid: market.bid.toString(),
        capOi: market.capOi.toString(),
        circuitBreakerLevel: market.circuitBreakerLevel.toString(),
        fundingRate: market.fundingRate.toString(),
        mid: market.mid.toString(),
        oiLong: market.oiLong.toString(),
        oiShort: market.oiShort.toString(),  
        volumeAsk: market.volumeAsk.toString(),
        volumeBid: market.volumeBid.toString(),
        parsedAnnualFundingRate: market.parsedAnnualFundingRate?.toString(),
        parsedAsk: market.parsedAsk?.toString(),
        parsedBid: market.parsedBid?.toString(),
        parsedCapOi: market.parsedCapOi?.toString(),
        parsedDailyFundingRate: market.parsedDailyFundingRate?.toString(),
        parsedMid: market.parsedMid?.toString(),
        parsedOiLong: market.parsedOiLong?.toString(),
        parsedOiShort: market.parsedOiShort?.toString(),
      }})

      dispatch(updateMarkets({ markets: marketsParsed }))
    },
    [dispatch]
  )

  return {
    handleMarketsUpdate
  }
};