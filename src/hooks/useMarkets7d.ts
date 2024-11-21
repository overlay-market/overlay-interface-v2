import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MARKET_CHART_URL } from "../constants/applications";

interface MarketDataPoint {
  _id: string;
  latestPrice: number;
  priceSevenDaysAgo: number;
  marketId: string;
  priceOneHourAgo: number;
  priceOneDayAgo: number;
  sevenDaysChartData: number[];
}

interface MarketDataWithOpenPrice {
  marketId: string;
  latestPrice?: number;
  oneHourChange?: number;
  twentyFourHourChange?: number;
  sevenDayChange?: number[];
}

export function useMarkets7d(marketIds: string[]): MarketDataWithOpenPrice[] {
  const [marketsData, setMarketsData] = useState<MarketDataWithOpenPrice[]>([]);
  const marketIdsRef = useRef(marketIds);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const updatedMarketsData = await Promise.all(
          marketIdsRef.current.map(async (marketId) => {
            try {
              const responseOverview = await axios.get<MarketDataPoint[]>(
                `${MARKET_CHART_URL.SEPOLIA}/marketsPricesOverview`
              );

              const chartData = responseOverview.data;

              console.log("chartData", chartData);

              if (chartData.length === 0) {
                throw new Error(`No chart data available for ${marketId}`);
              }

              const latestDataPoint =
                chartData[chartData.length - 1]?.latestPrice;
              const oneHourDataPoint =
                chartData[chartData.length - 1]?.priceOneHourAgo;
              const twentyFourHoursDataPoint =
                chartData[chartData.length - 1]?.priceOneDayAgo;
              const sevenDaysChartData = chartData.map(
                (dataPoint) => dataPoint.latestPrice
              );

              return {
                marketId,
                latestPrice: latestDataPoint,
                oneHourChange: oneHourDataPoint,
                twentyFourHourChange: twentyFourHoursDataPoint,
                sevenDayChange: sevenDaysChartData,
              };
            } catch (err) {
              console.error(`Error fetching market data for ${marketId}:`, err);
              return {
                marketId,
              };
            }
          })
        );

        updatedMarketsData.length > 0 && setMarketsData(updatedMarketsData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();

    const intervalId = setInterval(fetchMarketData, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [marketIdsRef]);

  useEffect(() => {
    marketIdsRef.current = marketIds;
  }, [marketIds]);

  // useEffect(() => {
  //   fetchMarketData();

  //   const intervalId = setInterval(fetchMarketData, 300000); // 5 minutes

  //   return () => clearInterval(intervalId);
  // }, [fetchMarketData]);

  return marketsData;
}
