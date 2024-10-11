import { createAction } from '@reduxjs/toolkit';
import { MarketData } from '../../types/marketTypes';

export const setCurrentMarket = createAction<{ currentMarket: MarketData}>('currentMarket/setCurrentMarket');
