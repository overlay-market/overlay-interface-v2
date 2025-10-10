import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MARKET_CHART_URL } from "../constants/applications";
import { CHAINS } from "overlay-sdk";

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
  const [marketAddressMapping, setMarketAddressMapping] = useState<
    Record<string, string>
  >({});

  // Memoized version of marketIds to avoid unnecessary re-fetches
  const stableMarketIds = useMemo(() => marketIds, [marketIds]);

  // Fetch the market address mapping once
  useEffect(() => {
    const fetchMarketAddressMapping = async () => {
      try {
        const response2 = await axios.get(
          "https://api.overlay.market/data/api/markets"
        );
        const mapping: Record<string, string> = {};

        response2.data[CHAINS.BscMainnet].forEach(
          (item: {
            marketId: string;
            chains: { deploymentAddress: string }[];
          }) => {
            mapping[item.marketId] =
              item.chains[0]?.deploymentAddress.toLowerCase();
          }
        );

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
      if (
        Object.keys(marketAddressMapping).length === 0 ||
        stableMarketIds.length === 0
      )
        return;

      try {
        const responseOverview = await axios.get<MarketDataPoint[]>(
          `${MARKET_CHART_URL.BSC_MAINNET}/marketsPricesOverview`
        );
        const chartDataArray = responseOverview.data;

        const updatedMarketsData = stableMarketIds.map((marketId) => {
          try {
            const marketAddressSepolia = marketAddressMapping[marketId];
            const chartData = chartDataArray.find(
              (item) => item.marketAddress === marketAddressSepolia
            );

            if (!chartData) {
              throw new Error(`No chart data available for ${marketId}`);
            }

            const calculatePercentageChange = (
              current: number,
              previous: number
            ): number => {
              if (previous === 0 || !previous) return 0;
              const change = (100 * (current - previous)) / previous;
              return Number.isFinite(change) ? change : 0;
            };

            return {
              marketId,
              latestPrice: chartData.latestPrice,
              oneHourChange: calculatePercentageChange(
                chartData.latestPrice,
                chartData.priceOneHourAgo
              ),
              twentyFourHourChange: calculatePercentageChange(
                chartData.latestPrice,
                chartData.priceOneDayAgo
              ),
              sevenDayChange: calculatePercentageChange(
                chartData.latestPrice,
                chartData.priceSevenDaysAgo
              ),
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
            JSON.stringify(prevMarketsData) !==
            JSON.stringify(updatedMarketsData)
              ? updatedMarketsData
              : prevMarketsData
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
