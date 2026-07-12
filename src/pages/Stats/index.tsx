import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createPublicClient, formatUnits, http, type Address } from "viem";
import { bsc } from "viem/chains";
import theme from "../../theme";
import {
  ChartBody,
  ChartGrid,
  ChartHeader,
  ChartMeta,
  ChartPanel,
  ChartTitle,
  ChartTitleGroup,
  EmptyState,
  ErrorPanel,
  Eyebrow,
  HeaderPanel,
  Legend,
  StatsPageShell,
  StatusGroup,
  StatusPill,
  Subtitle,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryMeta,
  SummaryValue,
  Title,
  TitleGroup,
  TooltipLabel,
  TooltipShell,
  TooltipValue,
} from "./stats-styles";

const ANALYTICS_ENDPOINT =
  "https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/prod/gn";

const ANALYTICS_QUERY = `
  query MyQuery {
    analyticsHourDatas(
      first: 1000
      orderBy: periodStartUnix
      orderDirection: desc
    ) {
      periodStartUnix
      totalTokensLocked
      totalTransactions
      totalVolume
      totalVolumeLiquidations
      totalVolumeBuilds
      totalVolumeUnwinds
    }
  }
`;

const PANCAKESWAP_V3_POOL_ADDRESS =
  "0x927aE3c2cd88717a1525a55021AF9612C3F04583" as Address;

const POOL_OHLCV_ENDPOINT =
  `https://api.geckoterminal.com/api/v2/networks/bsc/pools/${PANCAKESWAP_V3_POOL_ADDRESS.toLowerCase()}/ohlcv/hour`;

const POOL_ABI = [
  {
    type: "function",
    name: "token0",
    inputs: [],
    outputs: [{ type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token1",
    inputs: [],
    outputs: [{ type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "slot0",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "observationIndex", type: "uint16" },
      { name: "observationCardinality", type: "uint16" },
      { name: "observationCardinalityNext", type: "uint16" },
      { name: "feeProtocol", type: "uint32" },
      { name: "unlocked", type: "bool" },
    ],
    stateMutability: "view",
  },
] as const;

const ERC20_ABI = [
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
] as const;

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(import.meta.env.VITE_BSC_MAINNET_RPC || bsc.rpcUrls.default.http[0]),
});

type AnalyticsHourData = {
  periodStartUnix: string;
  totalTokensLocked: string;
  totalTransactions: string;
  totalVolume: string;
  totalVolumeLiquidations: string;
  totalVolumeBuilds: string;
  totalVolumeUnwinds: string;
};

type AnalyticsResponse = {
  data?: {
    analyticsHourDatas?: AnalyticsHourData[];
  };
  errors?: Array<{ message: string }>;
};

type OvlPriceData = {
  priceUsd: number;
  token0Symbol: string;
  token1Symbol: string;
};

type OhlcvTuple = [
  timestamp: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
];

type OhlcvResponse = {
  data?: {
    attributes?: {
      ohlcv_list?: OhlcvTuple[];
    };
  };
  errors?: Array<{ title?: string; detail?: string; message?: string }>;
};

type PricePoint = {
  timestamp: number;
  priceUsd: number;
};

type PriceHistoryData = {
  prices: PricePoint[];
  latestPriceUsd?: number;
};

type VolumePoint = {
  timestamp: number;
  volumeUsd: number;
};

type StatsViewData = {
  accumulatedVolume: VolumePoint[];
  dailyVolume: VolumePoint[];
  totalVolumeUsd: number;
  thirtyDayAverageVolumeUsd: number;
  latestTransactions: number;
  latestTimestamp?: number;
  oldestTimestamp?: number;
};

type TooltipPayload = {
  value?: number | string;
  payload?: Partial<VolumePoint>;
};

type VolumeTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number | string;
};

const Q192 = 2n ** 192n;
const PRICE_SCALE = 10n ** 18n;
const HOUR_SECONDS = 60 * 60;
const DAY_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30;
const THIRTY_DAYS_MS = THIRTY_DAYS * DAY_MS;
const OHLCV_PAGE_LIMIT = 1000;
const MAX_OHLCV_REQUESTS = 8;

// Protocol was intentionally paused for key rotation; these UTC windows had
// no real trading and are excluded from the 30-day average so the closure
// doesn't skew it. [start, end) — end is exclusive.
const PROTOCOL_CLOSURE_PERIODS: Array<{ startUnixMs: number; endUnixMsExclusive: number }> = [
  {
    startUnixMs: Date.UTC(2026, 5, 13), // 2026-06-13T00:00:00Z
    endUnixMsExclusive: Date.UTC(2026, 6, 11), // 2026-07-11T00:00:00Z (through Jul 10 inclusive)
  },
];

const closureOverlapMs = (windowStart: number, windowEnd: number) =>
  PROTOCOL_CLOSURE_PERIODS.reduce((total, period) => {
    const overlapStart = Math.max(windowStart, period.startUnixMs);
    const overlapEnd = Math.min(windowEnd, period.endUnixMsExclusive);

    return overlapEnd > overlapStart ? total + (overlapEnd - overlapStart) : total;
  }, 0);

const isWithinClosurePeriod = (timestamp: number) =>
  PROTOCOL_CLOSURE_PERIODS.some(
    (period) => timestamp >= period.startUnixMs && timestamp < period.endUnixMsExclusive
  );

const compactUsdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const fullUsdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const decimalUsdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 6,
});

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const formatCompactUsd = (value: number) =>
  Number.isFinite(value) ? compactUsdFormatter.format(value) : "-";

const formatFullUsd = (value: number) => {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return value > 0 && value < 1
    ? decimalUsdFormatter.format(value)
    : fullUsdFormatter.format(value);
};

const formatPrice = (value?: number) => {
  if (!value || !Number.isFinite(value)) {
    return "-";
  }

  return decimalUsdFormatter.format(value);
};

const formatChartDate = (timestamp: number) => dateFormatter.format(timestamp);

const formatTooltipDate = (timestamp: number | string | undefined) => {
  const numericTimestamp = Number(timestamp);

  if (!Number.isFinite(numericTimestamp)) {
    return "-";
  }

  return `${dateTimeFormatter.format(numericTimestamp)} UTC`;
};

const rawOvlToNumber = (value: string | bigint) =>
  Number(formatUnits(typeof value === "bigint" ? value : BigInt(value), 18));

const rawOvlToUsd = (value: string | bigint, priceUsd: number) =>
  rawOvlToNumber(value) * priceUsd;

const getOvlPriceFromSqrtPrice = (
  sqrtPriceX96: bigint,
  token0Decimals: number,
  token1Decimals: number,
  isOvlToken0: boolean
) => {
  const token0InToken1X18 =
    (sqrtPriceX96 *
      sqrtPriceX96 *
      PRICE_SCALE *
      10n ** BigInt(token0Decimals)) /
    (Q192 * 10n ** BigInt(token1Decimals));
  const token0InToken1 = Number(formatUnits(token0InToken1X18, 18));

  return isOvlToken0 ? token0InToken1 : 1 / token0InToken1;
};

const readOvlPriceFromPool = async (): Promise<OvlPriceData> => {
  const [token0, token1, slot0] = await Promise.all([
    bscClient.readContract({
      address: PANCAKESWAP_V3_POOL_ADDRESS,
      abi: POOL_ABI,
      functionName: "token0",
    }),
    bscClient.readContract({
      address: PANCAKESWAP_V3_POOL_ADDRESS,
      abi: POOL_ABI,
      functionName: "token1",
    }),
    bscClient.readContract({
      address: PANCAKESWAP_V3_POOL_ADDRESS,
      abi: POOL_ABI,
      functionName: "slot0",
    }),
  ]);

  const [token0Symbol, token0Decimals, token1Symbol, token1Decimals] =
    await Promise.all([
      bscClient.readContract({
        address: token0,
        abi: ERC20_ABI,
        functionName: "symbol",
      }),
      bscClient.readContract({
        address: token0,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
      bscClient.readContract({
        address: token1,
        abi: ERC20_ABI,
        functionName: "symbol",
      }),
      bscClient.readContract({
        address: token1,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

  const isOvlToken0 = token0Symbol.toUpperCase() === "OVL";
  const isOvlToken1 = token1Symbol.toUpperCase() === "OVL";

  if (!isOvlToken0 && !isOvlToken1) {
    throw new Error("The configured PancakeSwap v3 pool does not contain OVL.");
  }

  return {
    priceUsd: getOvlPriceFromSqrtPrice(
      slot0[0],
      Number(token0Decimals),
      Number(token1Decimals),
      isOvlToken0
    ),
    token0Symbol,
    token1Symbol,
  };
};

const fetchPoolHourlyPrices = async (
  fromUnix: number,
  toUnix: number
): Promise<PriceHistoryData> => {
  const pricesByTimestamp = new Map<number, PricePoint>();
  let beforeTimestamp = toUnix + HOUR_SECONDS;

  for (let requestCount = 0; requestCount < MAX_OHLCV_REQUESTS; requestCount += 1) {
    const url = new URL(POOL_OHLCV_ENDPOINT);
    url.searchParams.set("aggregate", "1");
    url.searchParams.set("limit", String(OHLCV_PAGE_LIMIT));
    url.searchParams.set("currency", "usd");
    url.searchParams.set("token", "base");
    url.searchParams.set("before_timestamp", String(beforeTimestamp));

    const response = await fetch(url.toString(), {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OVL/USD history: ${response.statusText}`);
    }

    const payload = (await response.json()) as OhlcvResponse;
    const apiError =
      payload.errors?.[0]?.detail ||
      payload.errors?.[0]?.message ||
      payload.errors?.[0]?.title;

    if (apiError) {
      throw new Error(apiError);
    }

    const ohlcvList = payload.data?.attributes?.ohlcv_list;

    if (!ohlcvList?.length) {
      break;
    }

    let oldestTimestamp = beforeTimestamp;

    for (const [timestamp, , , , close] of ohlcvList) {
      oldestTimestamp = Math.min(oldestTimestamp, timestamp);

      if (Number.isFinite(close) && close > 0) {
        pricesByTimestamp.set(timestamp * 1000, {
          timestamp: timestamp * 1000,
          priceUsd: close,
        });
      }
    }

    if (oldestTimestamp <= fromUnix) {
      break;
    }

    beforeTimestamp = oldestTimestamp - 1;
  }

  const prices = [...pricesByTimestamp.values()].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  if (!prices.length) {
    throw new Error("No OVL/USD price history was returned for this period.");
  }

  return {
    prices,
    latestPriceUsd: prices[prices.length - 1]?.priceUsd,
  };
};

const fetchAnalyticsHourData = async (): Promise<AnalyticsHourData[]> => {
  const response = await fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query: ANALYTICS_QUERY }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
  }

  const payload = (await response.json()) as AnalyticsResponse;
  const graphQLError = payload.errors?.[0]?.message;

  if (graphQLError) {
    throw new Error(graphQLError);
  }

  const analyticsHourDatas = payload.data?.analyticsHourDatas;

  if (!analyticsHourDatas) {
    throw new Error("Analytics response did not include hourly data.");
  }

  return [...analyticsHourDatas].sort(
    (a, b) => Number(a.periodStartUnix) - Number(b.periodStartUnix)
  );
};

const buildStatsViewData = (
  analyticsHourDatas: AnalyticsHourData[],
  hourlyPrices: PricePoint[]
): StatsViewData => {
  const sortedPrices = [...hourlyPrices].sort((a, b) => a.timestamp - b.timestamp);
  const accumulatedVolume: VolumePoint[] = [];
  const dailyVolumeMap = new Map<string, VolumePoint>();
  let previousVolume: bigint | undefined;
  let accumulatedVolumeUsd = 0;
  let trailingThirtyDayVolumeUsd = 0;
  let priceIndex = 0;
  const latestPoint = analyticsHourDatas[analyticsHourDatas.length - 1];
  const latestTimestamp = latestPoint
    ? Number(latestPoint.periodStartUnix) * 1000
    : undefined;
  const trailingThirtyDayStart =
    latestTimestamp === undefined ? undefined : latestTimestamp - THIRTY_DAYS_MS;

  const getPriceAtTimestamp = (timestamp: number) => {
    while (
      priceIndex + 1 < sortedPrices.length &&
      sortedPrices[priceIndex + 1].timestamp <= timestamp
    ) {
      priceIndex += 1;
    }

    return sortedPrices[priceIndex]?.priceUsd ?? sortedPrices[0]?.priceUsd ?? 0;
  };

  for (const point of analyticsHourDatas) {
    const timestamp = Number(point.periodStartUnix) * 1000;
    const totalVolumeRaw = BigInt(point.totalVolume);
    const priceUsd = getPriceAtTimestamp(timestamp);

    const deltaRaw =
      previousVolume === undefined
        ? totalVolumeRaw
        : totalVolumeRaw > previousVolume
          ? totalVolumeRaw - previousVolume
          : 0n;
    const deltaUsd = rawOvlToUsd(deltaRaw, priceUsd);

    accumulatedVolumeUsd += deltaUsd;

    if (previousVolume !== undefined) {
      const dayStart = new Date(timestamp);
      const dayTimestamp = Date.UTC(
        dayStart.getUTCFullYear(),
        dayStart.getUTCMonth(),
        dayStart.getUTCDate()
      );
      const dayKey = String(dayTimestamp);
      const existing = dailyVolumeMap.get(dayKey);

      dailyVolumeMap.set(dayKey, {
        timestamp: dayTimestamp,
        volumeUsd: (existing?.volumeUsd ?? 0) + deltaUsd,
      });

      if (
        trailingThirtyDayStart !== undefined &&
        timestamp > trailingThirtyDayStart &&
        !isWithinClosurePeriod(timestamp)
      ) {
        trailingThirtyDayVolumeUsd += deltaUsd;
      }
    }

    accumulatedVolume.push({
      timestamp,
      volumeUsd: accumulatedVolumeUsd,
    });

    previousVolume = totalVolumeRaw;
  }

  const latestAccumulatedPoint =
    accumulatedVolume[accumulatedVolume.length - 1];

  const excludedTrailingDays =
    trailingThirtyDayStart !== undefined && latestTimestamp !== undefined
      ? closureOverlapMs(trailingThirtyDayStart, latestTimestamp) / DAY_MS
      : 0;
  const activeTrailingDays = Math.max(THIRTY_DAYS - excludedTrailingDays, 1);

  return {
    accumulatedVolume,
    dailyVolume: [...dailyVolumeMap.values()].sort(
      (a, b) => a.timestamp - b.timestamp
    ),
    totalVolumeUsd: latestAccumulatedPoint?.volumeUsd ?? 0,
    thirtyDayAverageVolumeUsd: trailingThirtyDayVolumeUsd / activeTrailingDays,
    latestTransactions: latestPoint ? Number(latestPoint.totalTransactions) : 0,
    latestTimestamp,
    oldestTimestamp: analyticsHourDatas[0]
      ? Number(analyticsHourDatas[0].periodStartUnix) * 1000
      : undefined,
  };
};

const VolumeTooltip = ({ active, payload, label }: VolumeTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const volumeUsd = Number(payload[0].value);

  return (
    <TooltipShell>
      <TooltipLabel>{formatTooltipDate(label)}</TooltipLabel>
      <TooltipValue>{formatFullUsd(volumeUsd)}</TooltipValue>
    </TooltipShell>
  );
};

const Stats = () => {
  const analyticsQuery = useQuery<AnalyticsHourData[], Error>({
    queryKey: ["stats", "analyticsHourDatas"],
    queryFn: fetchAnalyticsHourData,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const analyticsRange = useMemo(() => {
    const data = analyticsQuery.data;

    if (!data?.length) {
      return undefined;
    }

    return {
      fromUnix: Number(data[0].periodStartUnix),
      toUnix: Number(data[data.length - 1].periodStartUnix),
    };
  }, [analyticsQuery.data]);

  const priceQuery = useQuery<OvlPriceData, Error>({
    queryKey: ["stats", "ovlUsdPrice", PANCAKESWAP_V3_POOL_ADDRESS],
    queryFn: readOvlPriceFromPool,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const priceHistoryQuery = useQuery<PriceHistoryData, Error>({
    queryKey: [
      "stats",
      "ovlUsdPriceHistory",
      PANCAKESWAP_V3_POOL_ADDRESS,
      analyticsRange?.fromUnix,
      analyticsRange?.toUnix,
    ],
    queryFn: () => {
      if (!analyticsRange) {
        throw new Error("Analytics range is not available.");
      }

      return fetchPoolHourlyPrices(analyticsRange.fromUnix, analyticsRange.toUnix);
    },
    enabled: !!analyticsRange,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const statsData = useMemo(() => {
    if (!analyticsQuery.data || !priceHistoryQuery.data?.prices.length) {
      return undefined;
    }

    return buildStatsViewData(
      analyticsQuery.data,
      priceHistoryQuery.data.prices
    );
  }, [analyticsQuery.data, priceHistoryQuery.data?.prices]);

  const isLoading =
    analyticsQuery.isLoading ||
    priceQuery.isLoading ||
    priceHistoryQuery.isLoading;
  const errorMessage =
    analyticsQuery.error?.message ||
    priceHistoryQuery.error?.message ||
    priceQuery.error?.message;
  const displayedPriceUsd =
    priceQuery.data?.priceUsd ?? priceHistoryQuery.data?.latestPriceUsd;
  const sourcePair = priceQuery.data
    ? `${priceQuery.data.token0Symbol}/${priceQuery.data.token1Symbol}`
    : "OVL/USDT";

  return (
    <StatsPageShell>
      <HeaderPanel>
        <TitleGroup>
          <Eyebrow>Overlay Analytics</Eyebrow>
          <Title>Volume</Title>
          <Subtitle>
            Accumulated and daily protocol volume converted from OVL with
            hourly prices from the PancakeSwap v3 pool.
          </Subtitle>
        </TitleGroup>
        <StatusGroup>
          <StatusPill>{sourcePair} hourly prices</StatusPill>
          <StatusPill>
            {statsData?.latestTimestamp
              ? `Latest ${formatTooltipDate(statsData.latestTimestamp)}`
              : "Loading latest hour"}
          </StatusPill>
        </StatusGroup>
      </HeaderPanel>

      {errorMessage && <ErrorPanel>{errorMessage}</ErrorPanel>}

      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>Total volume</SummaryLabel>
          <SummaryValue>{formatCompactUsd(statsData?.totalVolumeUsd ?? NaN)}</SummaryValue>
          <SummaryMeta>Hourly converted USD</SummaryMeta>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Daily Average Volume (30 days span)</SummaryLabel>
          <SummaryValue>
            {formatCompactUsd(statsData?.thirtyDayAverageVolumeUsd ?? NaN)}
          </SummaryValue>
          <SummaryMeta>Average daily volume</SummaryMeta>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>OVL/USD</SummaryLabel>
          <SummaryValue>{formatPrice(displayedPriceUsd)}</SummaryValue>
          <SummaryMeta>Current pool price</SummaryMeta>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Transactions</SummaryLabel>
          <SummaryValue>
            {statsData ? integerFormatter.format(statsData.latestTransactions) : "-"}
          </SummaryValue>
          <SummaryMeta>All-time count</SummaryMeta>
        </SummaryCard>
      </SummaryGrid>

      <ChartGrid>
        <ChartPanel>
          <ChartHeader>
            <ChartTitleGroup>
              <ChartTitle>Accumulated volume</ChartTitle>
              <ChartMeta>
                {statsData?.oldestTimestamp
                  ? `Since ${formatChartDate(statsData.oldestTimestamp)} UTC`
                  : "Hourly subgraph data"}
              </ChartMeta>
            </ChartTitleGroup>
            <Legend $color={theme.semantic.accent}>USD</Legend>
          </ChartHeader>
          <ChartBody>
            {isLoading || !statsData?.accumulatedVolume.length ? (
              <EmptyState>
                {isLoading ? "Loading volume..." : "No volume data"}
              </EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={statsData.accumulatedVolume}
                  margin={{ top: 8, right: 12, bottom: 4, left: 6 }}
                >
                  <defs>
                    <linearGradient id="accumulatedVolumeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={theme.semantic.accent}
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.semantic.accent}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={theme.semantic.borderMuted}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatChartDate}
                    minTickGap={28}
                    tick={{ fill: theme.semantic.textMuted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: theme.semantic.border }}
                  />
                  <YAxis
                    tickFormatter={formatCompactUsd}
                    width={72}
                    tick={{ fill: theme.semantic.textMuted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<VolumeTooltip />}
                    cursor={{ stroke: theme.semantic.border, strokeDasharray: "3 3" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volumeUsd"
                    stroke={theme.semantic.accent}
                    fill="url(#accumulatedVolumeFill)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartBody>
        </ChartPanel>

        <ChartPanel>
          <ChartHeader>
            <ChartTitleGroup>
              <ChartTitle>Daily volume</ChartTitle>
              <ChartMeta>UTC daily buckets</ChartMeta>
            </ChartTitleGroup>
            <Legend $color={theme.semantic.positive}>USD</Legend>
          </ChartHeader>
          <ChartBody>
            {isLoading || !statsData?.dailyVolume.length ? (
              <EmptyState>
                {isLoading ? "Loading volume..." : "No daily volume data"}
              </EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statsData.dailyVolume}
                  margin={{ top: 8, right: 12, bottom: 4, left: 6 }}
                >
                  <CartesianGrid
                    stroke={theme.semantic.borderMuted}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatChartDate}
                    minTickGap={28}
                    tick={{ fill: theme.semantic.textMuted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: theme.semantic.border }}
                  />
                  <YAxis
                    tickFormatter={formatCompactUsd}
                    width={72}
                    tick={{ fill: theme.semantic.textMuted, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<VolumeTooltip />}
                    cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                  />
                  <Bar
                    dataKey="volumeUsd"
                    fill={theme.semantic.positive}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartBody>
        </ChartPanel>
      </ChartGrid>
    </StatsPageShell>
  );
};

export default Stats;
