import {createAction} from '@reduxjs/toolkit'
import { MarketData } from '../../types/marketTypes'

export const updateMarkets = createAction<{
  markets: MarketData[]
}>('/markets/updateMarkets')