import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MARKET_CHART_URL } from "../constants/applications";
import { SUPPORTED_CHAINID } from "../constants/chains";

interface MarketDataPoint {
  latestPrice: number;
  marketAddress: string;
  priceOneDayAgo: number;
  priceOneHourAgo: number;
  priceSevenDaysAgo: number;
  prices: number[];
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
  const [marketAddressMapping, setMarketAddressMapping] = useState<Record<string, string>>({});

  // Memoized version of marketIds to avoid unnecessary re-fetches
  const stableMarketIds = useMemo(() => marketIds, [marketIds]);

  // Fetch the market address mapping once
  useEffect(() => {
    const fetchMarketAddressMapping = async () => {
      try {
        const response2 = await axios.get("https://api.overlay.market/data/api/markets");
        const mapping: Record<string, string> = {};

        response2.data[SUPPORTED_CHAINID.BERACHAIN].forEach((item: { marketId: string; chains: { deploymentAddress: string }[] }) => {
          mapping[item.marketId] = item.chains[0]?.deploymentAddress.toLowerCase();
        });

        setMarketAddressMapping(mapping);
      } catch (error) {
        console.error("Error fetching response2 data:", error);
      }
    };

    fetchMarketAddressMapping();
  }, []);

  // Fetch marketsPricesOverview whenever marketIds or the mapping changes
  useEffect(() => {
    const fetchMarketsPricesOverview = async () => {
      if (Object.keys(marketAddressMapping).length === 0 || stableMarketIds.length === 0) return;

      try {
        const responseOverview = await axios.get<MarketDataPoint[]>(
          `${MARKET_CHART_URL}/marketsPricesOverview`
        );
        const chartDataArray = responseOverview.data;

        const updatedMarketsData = stableMarketIds.map((marketId) => {
          try {
            const marketAddressBerachain = marketAddressMapping[marketId];
            const chartData = chartDataArray.find((item) => item.marketAddress === marketAddressBerachain);

            if (!chartData) {
              throw new Error(`No chart data available for ${marketId}`);
            }

            return {
              marketId,
              latestPrice: chartData.latestPrice,
              oneHourChange:
                (100 * (chartData.latestPrice - chartData.priceOneHourAgo)) / chartData.priceOneHourAgo,
              twentyFourHourChange:
                (100 * (chartData.latestPrice - chartData.priceOneDayAgo)) / chartData.priceOneDayAgo,
              sevenDayChange:
                (100 * (chartData.latestPrice - chartData.priceSevenDaysAgo)) / chartData.priceSevenDaysAgo,
              sevenDaysChartData: chartData.prices,
            };
          } catch (err) {
            console.error(`Error processing market data for ${marketId}:`, err);
            return {
              marketId,
              latestPrice: 0,
              oneHourChange: 0,
              twentyFourHourChange: 0,
              sevenDayChange: 0,
            };
          }
        });

        if (updatedMarketsData.length > 0) {
          setMarketsData((prevMarketsData) =>
            JSON.stringify(prevMarketsData) !== JSON.stringify(updatedMarketsData) ? updatedMarketsData : prevMarketsData
          );
        }
      } catch (error) {
        console.error("Error fetching market prices overview:", error);
      }
    };

    fetchMarketsPricesOverview();

    const intervalId = setInterval(fetchMarketsPricesOverview, 300000); // 5 minutes interval

    return () => clearInterval(intervalId);
  }, [marketAddressMapping, stableMarketIds]);

  return marketsData;
}
