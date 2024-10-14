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
      dispatch(updateMarkets({ markets }))
    },
    [dispatch]
  )

  return {
    handleMarketsUpdate
  }
};