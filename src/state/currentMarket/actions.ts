import { createAction } from '@reduxjs/toolkit';
import { MarketDataParsed } from '../../types/marketTypes';

export const setCurrentMarket = createAction<{ currentMarket: MarketDataParsed}>('currentMarket/setCurrentMarket');
