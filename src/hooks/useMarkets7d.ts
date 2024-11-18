import { useState, useEffect, useCallback, useRef } from "react";
import useSDK from "./useSDK";
import axios from "axios";
import { MARKET_CHART_URL } from "../constants/applications";

interface MarketDataPoint {
  _id: {
    market: string;
    time: string;
  };
  high: number;
  low: number;
  open: number;
  close: number;
}

interface MarketDataWithOpenPrice {
  marketId: string;
  latestPrice?: number;
  oneHourChange?: number;
  twentyFourHourChange?: number;
  sevenDayChange?: number;
  sevenDaysChartData?: number[];
}

export function useMarkets7d(marketIds: string[]): MarketDataWithOpenPrice[] {
  const [marketsData, setMarketsData] = useState<MarketDataWithOpenPrice[]>([]);
  const sdk = useSDK();
  const marketIdsRef = useRef(marketIds);

  const fetchMarketData = useCallback(async () => {
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    try {
      const updatedMarketsData = await Promise.all(
        marketIdsRef.current.map(async (marketId) => {
          try {
            const response2 = await axios.get(
              `https://api.overlay.market/data/api/markets/${marketId}`
            );

            const marketAddressSepolia = response2.data.chains
              .find(
                (chain: { chainId: number; deploymentAddress?: string }) =>
                  chain.chainId === 421614
              )
              ?.deploymentAddress.toLowerCase();

            console.log({ marketAddressSepolia });

            const binSize = 15;

            const response = await axios.get<MarketDataPoint[]>(
              MARKET_CHART_URL.SEPOLIA,
              {
                params: {
                  market: marketAddressSepolia,
                  binSize: binSize,
                  binUnit: "minute",
                  from: sevenDaysAgo,
                },
              }
            );

            const chartData = response.data;

            if (chartData.length === 0) {
              throw new Error(`No chart data available for ${marketId}`);
            }

            // Get the latest data point
            const latestDataPoint = chartData[chartData.length - 1];
            const oneHourDataPoint = chartData[chartData.length - 60 / binSize];
            const twentyFourHoursDataPoint =
              chartData[chartData.length - (24 * 60) / binSize];
            const sevenDaysChartData = chartData
              .filter(
                (_, index) => index % Math.floor(chartData.length / 20) === 0
              )
              .map((dataPoint) => dataPoint.close / chartData[0].close);

            console.log({ oneHourDataPoint });
            console.log({ twentyFourHoursDataPoint });
            console.log({ sevenDaysChartData });

            return {
              marketId,
              latestPrice: latestDataPoint.close,
              oneHourChange:
                (100 * (latestDataPoint.close - oneHourDataPoint.close)) /
                oneHourDataPoint.close,
              twentyFourHourChange:
                (100 *
                  (latestDataPoint.close - twentyFourHoursDataPoint.close)) /
                twentyFourHoursDataPoint.close,
              sevenDayChange:
                (100 * (latestDataPoint.close - chartData[0].close)) /
                chartData[0].close,
              sevenDaysChartData,
            };
          } catch (err) {
            console.error(`Error fetching market data for ${marketId}:`, err);
            return {
              marketId,
            };
          }
        })
      );

      setMarketsData(updatedMarketsData);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  }, [sdk.markets]);

  useEffect(() => {
    marketIdsRef.current = marketIds;
  }, [marketIds]);

  useEffect(() => {
    fetchMarketData();

    const intervalId = setInterval(fetchMarketData, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchMarketData]);

  return marketsData;
}
