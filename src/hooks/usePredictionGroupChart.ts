import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useMultichainContext from "../providers/MultichainContextProvider/useMultichainContext";
import { PredictionMarketGroup } from "../constants/markets";
import { getMarketChartUrl, getBinSizeAndUnit } from "../pages/Trade/Chart/helpers";
import { fetchMarketAddressMapping } from "../utils/fetchMarketAddressMapping";

export type PredictionChartResolution = "60" | "240" | "1D" | "1W";

export interface PredictionChartPoint {
  time: string;
  [outcomeLabel: string]: number | string | null;
}

interface OHLCCandle {
  _id: {
    market: string;
    time: string;
  };
  open: number;
  high: number;
  low: number;
  close: number;
}

// Map resolution to the time window we want to display
function getTimeWindowMs(resolution: PredictionChartResolution): number {
  switch (resolution) {
    case "60":
      return 48 * 60 * 60 * 1000; // 48 hours
    case "240":
      return 7 * 24 * 60 * 60 * 1000; // 7 days
    case "1D":
      return 30 * 24 * 60 * 60 * 1000; // 30 days
    case "1W":
      return 365 * 24 * 60 * 60 * 1000; // 1 year (effectively "all")
  }
}

interface FetchResult {
  all: OHLCCandle[];
  filtered: OHLCCandle[];
}

async function fetchChartData(
  chartUrl: string,
  marketAddress: string,
  resolution: PredictionChartResolution
): Promise<FetchResult> {
  // For 1W, use daily candles and show all data (weekly bins may not exist for young markets)
  const effectiveResolution = resolution === "1W" ? "1D" : resolution;
  const binParams = getBinSizeAndUnit(effectiveResolution);
  if (!binParams) return { all: [], filtered: [] };

  const response = await axios.get(chartUrl, {
    params: {
      market: marketAddress,
      binSize: binParams.binSize,
      binUnit: binParams.binUnit,
      limit: 2000,
    },
  });

  const all: OHLCCandle[] = Array.isArray(response.data)
    ? response.data
    : [];

  // 1W shows all available data, others filter to their time window
  if (resolution === "1W") return { all, filtered: all };

  const cutoff = Date.now() - getTimeWindowMs(resolution);
  const filtered = all.filter(
    (c) => new Date(c._id.time).getTime() >= cutoff
  );
  return { all, filtered };
}

interface PredictionChartResult {
  points: PredictionChartPoint[];
  dataSpanDays: number;
}

export function usePredictionGroupChart(
  group: PredictionMarketGroup | undefined,
  resolution: PredictionChartResolution = "60"
) {
  const { chainId } = useMultichainContext();
  const chartBaseUrl = getMarketChartUrl(Number(chainId));

  const query = useQuery<PredictionChartResult>({
    queryKey: ["predictionGroupChart", group?.groupId, chainId, resolution],
    queryFn: async () => {
      if (!group) return { points: [], dataSpanDays: 0 };

      const addressMapping = await fetchMarketAddressMapping(
        typeof chainId === "number" ? chainId : undefined
      );

      const addresses = group.marketIds.map((id) => {
        const decoded = decodeURIComponent(id);
        return addressMapping[decoded] || addressMapping[id] || "";
      });

      const results = await Promise.all(
        addresses.map((addr) =>
          addr
            ? fetchChartData(chartBaseUrl, addr, resolution)
            : { all: [] as OHLCCandle[], filtered: [] as OHLCCandle[] }
        )
      );

      // Compute total data span from ALL unfiltered candles
      let minTime = Infinity;
      let maxTime = -Infinity;
      results.forEach(({ all }) => {
        all.forEach((candle) => {
          const t = new Date(candle._id.time).getTime();
          if (t < minTime) minTime = t;
          if (t > maxTime) maxTime = t;
        });
      });
      const dataSpanDays =
        minTime < Infinity
          ? (maxTime - minTime) / (24 * 60 * 60 * 1000)
          : 0;

      // Collect all unique timestamps from filtered candles
      const allTimestamps = new Set<string>();
      results.forEach(({ filtered }) => {
        filtered.forEach((candle) => allTimestamps.add(candle._id.time));
      });

      const labels = group.marketIds.map(
        (id) => group.outcomeLabels[id] || decodeURIComponent(id)
      );

      // Build a map of timestamp -> point, with explicit null for missing outcomes
      const timeMap = new Map<string, PredictionChartPoint>();
      for (const ts of allTimestamps) {
        const point: PredictionChartPoint = { time: ts };
        for (const label of labels) {
          point[label] = null;
        }
        timeMap.set(ts, point);
      }

      results.forEach(({ filtered }, i) => {
        const label = labels[i];
        filtered.forEach((candle) => {
          const point = timeMap.get(candle._id.time)!;
          point[label] = Number((candle.close * 100).toFixed(2));
        });
      });

      // Sort by time
      const points = Array.from(timeMap.values()).sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );

      return { points, dataSpanDays };
    },
    enabled: !!group,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  return {
    ...query,
    chartData: query.data?.points,
    dataSpanDays: query.data?.dataSpanDays ?? 0,
  };
}
