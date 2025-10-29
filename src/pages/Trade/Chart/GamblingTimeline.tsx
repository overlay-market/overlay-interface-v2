import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import moment from "moment";
import { Flex, Text } from "@radix-ui/themes";

import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { getMarketChartUrl } from "./helpers";
import Loader from "../../../components/Loader";
import theme from "../../../theme";
import {
  CandleApiResponse,
  TimelinePoint,
  buildTimelineFromCandles,
  normalizeCandles,
} from "./gamblingTimelineHelpers";

const CANDLE_INTERVAL_MINUTES = 1;
const DEFAULT_CANDLE_COUNT = 180; // roughly three hours of history

const GamblingTimeline: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const { chainId } = useMultichainContext();

  const [data, setData] = useState<TimelinePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const marketAddress = useMemo(() => {
    return currentMarket?.id ? currentMarket.id.toLowerCase() : undefined;
  }, [currentMarket?.id]);

  useEffect(() => {
    if (!marketAddress || !chainId) {
      return;
    }

    let isActive = true;
    const intervalMs = CANDLE_INTERVAL_MINUTES * 60 * 1000;
    const candleCount = DEFAULT_CANDLE_COUNT;

    const fetchCandles = async () => {
      try {
        if (!hasFetchedRef.current) {
          setIsLoading(true);
        }

        const now = Date.now();
        const from = now - candleCount * intervalMs;

        const baseUrl = getMarketChartUrl(chainId);
        const url = new URL(baseUrl);
        url.searchParams.set("market", marketAddress);
        url.searchParams.set("binSize", CANDLE_INTERVAL_MINUTES.toString());
        url.searchParams.set("binUnit", "minute");
        url.searchParams.set("from", from.toString());
        url.searchParams.set("limit", (candleCount + 10).toString());

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`Failed to load candles: ${response.statusText}`);
        }

        const candles: CandleApiResponse[] = await response.json();

        const normalized = normalizeCandles(candles);
        const timelinePoints = buildTimelineFromCandles(normalized);

        if (isActive) {
          setData(timelinePoints.slice(-candleCount));
          setError(null);
          hasFetchedRef.current = true;
        }
      } catch (err) {
        console.error("Error fetching gambling timeline:", err);
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Unknown error loading timeline"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchCandles();
    const intervalId = window.setInterval(fetchCandles, intervalMs);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, marketAddress]);

  const latestPoint = data[data.length - 1];
  const latestChange = latestPoint?.changePercent ?? 0;

  return (
    <TimelineContainer>
      <Header direction="column" gap="8px">
        <Text size="2" color="gray" style={{ letterSpacing: "0.12em" }}>
          Gambling Timeline
        </Text>
        {latestPoint ? (
          <Flex direction="column" gap="4px">
            <ChangeValue size="6" weight="bold" $trend={latestChange}>
              {formatPercent(latestChange)}
            </ChangeValue>
            <MutedText>Change vs previous 1m candle</MutedText>
          </Flex>
        ) : (
          <MutedText>No data yet</MutedText>
        )}
      </Header>

      <ChartArea>
        {isLoading ? (
          <Centered>
            <Loader size="32px" />
          </Centered>
        ) : error ? (
          <Centered>
            <MutedText>{error}</MutedText>
          </Centered>
        ) : data.length === 0 ? (
          <Centered>
            <MutedText>No candle data available</MutedText>
          </Centered>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="time"
                tickFormatter={(timestamp) => moment(timestamp).format("HH:mm")}
                stroke="rgba(255, 255, 255, 0.4)"
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  typeof value === "number" ? formatPercentAxis(value) : value
                }
                width={72}
              />
              <Tooltip content={<TimelineTooltip />} />
              <Line
                type="monotone"
                dataKey="changePercent"
                stroke="#4DA1FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartArea>
    </TimelineContainer>
  );
};

export default GamblingTimeline;

const TimelineTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload as TimelinePoint | undefined;
  if (!point) {
    return null;
  }

  return (
    <TooltipBox>
      <TooltipRow>{moment(point.time).format("MMM D, HH:mm")}</TooltipRow>
      <TooltipRow>Change: {formatPercent(point.changePercent)}</TooltipRow>
    </TooltipBox>
  );
};

const formatPercentAxis = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  if (Math.abs(value) >= 100) {
    return `${value.toFixed(0)}%`;
  }
  if (Math.abs(value) >= 10) {
    return `${value.toFixed(1)}%`;
  }
  return `${value.toFixed(2)}%`;
};

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0.00%";
  }

  const formatted = value.toFixed(2);
  return `${value >= 0 ? "+" : ""}${formatted}%`;
};

const TimelineContainer = styled.div`
  width: 100%;
  height: 258px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(9, 13, 24, 0.6);
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.3);

  @media (min-width: ${theme.breakpoints.sm}) {
    height: 561px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 643px;
  }
`;

const Header = styled(Flex)`
  margin-bottom: 12px;
`;

const ChartArea = styled.div`
  flex: 1;
  min-height: 0;
`;

const Centered = styled(Flex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const MutedText = styled(Text)`
  color: rgba(255, 255, 255, 0.5);
`;

const ChangeValue = styled(Text)<{ $trend: number }>`
  color: ${({ $trend }) =>
    $trend > 0 ? "#089981" : $trend < 0 ? "#f23645" : "rgba(255, 255, 255, 0.7)"};
  font-weight: 600;
`;

const TooltipBox = styled.div`
  background: rgba(10, 14, 24, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const TooltipRow = styled.div`
  white-space: nowrap;
`;
