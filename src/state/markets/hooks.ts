import {AppState} from '../state'
import {useAppDispatch, useAppSelector} from '../hooks'
import { MarketData } from '../../types/marketTypes';
import { useCallback } from 'react';
import { updateMarkets } from './actions';

export function useMarketsState(): AppState['markets'] {
  return useAppSelector(state => state.markets)
}

export const useMarketsActionHandlers = (): {
  handleMarketsUpdate: (markets: MarketData[]) => void;
} => {
  const dispatch = useAppDispatch();

  const handleMarketsUpdate = useCallback(
    (markets: MarketData[]) => {
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
      }})

      dispatch(updateMarkets({ markets: marketsParsed }))
    },
    [dispatch]
  )

  return {
    handleMarketsUpdate
  }
};