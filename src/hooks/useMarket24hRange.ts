import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getMarketChartUrl } from "../pages/Trade/Chart/helpers";

interface OHLCCandle {
  high?: number;
  low?: number;
}

interface Market24hRange {
  high?: number;
  low?: number;
}

const HOURLY_CANDLE_COUNT = 24;
const HOUR_MS = 60 * 60 * 1000;

interface UseMarket24hRangeParams {
  marketAddress?: string;
  chainId?: number;
  enabled?: boolean;
}

export function useMarket24hRange({
  marketAddress,
  chainId,
  enabled = true,
}: UseMarket24hRangeParams) {
  return useQuery<Market24hRange>({
    queryKey: ["market24hRange", chainId, marketAddress?.toLowerCase()],
    queryFn: async () => {
      if (!marketAddress || !chainId) return {};

      const to = Date.now();
      const from = to - HOURLY_CANDLE_COUNT * HOUR_MS;

      const response = await axios.get<OHLCCandle[]>(
        getMarketChartUrl(chainId),
        {
          params: {
            market: marketAddress.toLowerCase(),
            binSize: 60,
            binUnit: "minute",
            from,
            to,
            limit: HOURLY_CANDLE_COUNT,
          },
        }
      );

      const candles = Array.isArray(response.data) ? response.data : [];
      const highs = candles.map((candle) => Number(candle.high)).filter(Number.isFinite);
      const lows = candles.map((candle) => Number(candle.low)).filter(Number.isFinite);

      return {
        high: highs.length > 0 ? Math.max(...highs) : undefined,
        low: lows.length > 0 ? Math.min(...lows) : undefined,
      };
    },
    enabled: enabled && Boolean(marketAddress && chainId),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
