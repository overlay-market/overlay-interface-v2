import {createAction} from '@reduxjs/toolkit'
import { MarketDataParsed } from '../../types/marketTypes'

export const updateMarkets = createAction<{
  markets: MarketDataParsed[]
}>('/markets/updateMarkets')