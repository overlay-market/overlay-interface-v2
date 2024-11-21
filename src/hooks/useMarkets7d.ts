import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MARKET_CHART_URL } from "../constants/applications";

interface MarketDataPoint {
  latestPrice: number;
  marketAddress: string;
  priceOneDayAgo: number;
  priceOneHourAgo: number;
  priceSevenDaysAgo: number;
  prices:  number[];
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
  const marketIdsRef = useRef(marketIds);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const responseOverview = await axios.get<MarketDataPoint[]>(
          `${MARKET_CHART_URL.SEPOLIA}/marketsPricesOverview`
        );
        const chartDataArray = responseOverview.data;

        const response2 = await axios.get(
          `https://api.overlay.market/data/api/markets`
        );

        console.log({responseOverview, response2})

        const updatedMarketsData = marketIdsRef.current.map((marketId) => {
          try {
            const marketAddressSepolia = response2.data[421614]
            .find(
              (item: {marketId: string}) =>
                item.marketId === marketId
            )
            ?.chains[0]
            ?.deploymentAddress.toLowerCase();

            const chartData = chartDataArray.filter((item) => item.marketAddress === marketAddressSepolia)[0]
            if (!chartData) {
              throw new Error(`No chart data available for ${marketId}`);
            }

            return {
              marketId,
              latestPrice: chartData.latestPrice,
              oneHourChange: 100 * (chartData.latestPrice - chartData.priceOneHourAgo) / chartData.priceOneHourAgo,
              twentyFourHourChange: 100 * (chartData.latestPrice - chartData.priceOneDayAgo) / chartData.priceOneDayAgo,
              sevenDayChange: 100 * (chartData.latestPrice - chartData.priceSevenDaysAgo) / chartData.priceSevenDaysAgo,
              sevenDaysChartData: chartData.prices,
            };
          } catch (err) {
            console.error(`Error fetching market data for ${marketId}:`, err);
            return {
              marketId,
              latestPrice: 0,
              oneHourChange: 0,
              twentyFourHourChange: 0,
              sevenDayChange: 0,
            };
          }
        })

        updatedMarketsData.length > 0 && setMarketsData(updatedMarketsData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();

    const intervalId = setInterval(fetchMarketData, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [marketIds]);

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
