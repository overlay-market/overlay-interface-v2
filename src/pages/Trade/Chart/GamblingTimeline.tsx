import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
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
const POSITIVE_THRESHOLD = 50;
const NEGATIVE_THRESHOLD = -25;
type SignalPoint = TimelinePoint & { direction: "up" | "down" };

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

  const signals = useMemo<SignalPoint[]>(() => {
    return data
      .filter(
        (point) =>
          point.changePercent >= POSITIVE_THRESHOLD ||
          point.changePercent <= NEGATIVE_THRESHOLD
      )
      .map((point) => ({
        ...point,
        direction:
          point.changePercent >= POSITIVE_THRESHOLD ? "up" : "down",
      }));
  }, [data]);

  const latestSignal = signals[signals.length - 1];

  const nextUpdatePrediction = useMemo(() => {
    if (signals.length < 2) {
      return null;
    }

    const lastSignal = signals[signals.length - 1];
    const previousSignal = signals[signals.length - 2];
    const intervalMs = lastSignal.time - previousSignal.time;

    if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
      return null;
    }

    return {
      predictedAt: lastSignal.time + intervalMs,
      intervalMs,
    };
  }, [signals]);

  const predictedAt = nextUpdatePrediction?.predictedAt ?? null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!predictedAt) {
      return;
    }

    setNow(Date.now());

    const tick = () => setNow(Date.now());
    const intervalId =
      typeof window !== "undefined" ? window.setInterval(tick, 1000) : null;

    return () => {
      if (intervalId !== null && typeof window !== "undefined") {
        window.clearInterval(intervalId);
      }
    };
  }, [predictedAt]);

  const remainingMs = useMemo(() => {
    if (predictedAt === null) {
      return null;
    }

    return predictedAt - now;
  }, [predictedAt, now]);

  const countdownDisplay = useMemo(() => {
    if (remainingMs === null) {
      return null;
    }

    const clamped = Math.max(remainingMs, 0);
    const totalSeconds = Math.floor(clamped / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [remainingMs]);

  const countdownLabel = useMemo(() => {
    if (remainingMs === null) {
      return null;
    }

    if (remainingMs <= 0) {
      return "Updating…";
    }

    if (!countdownDisplay) {
      return null;
    }

    return `${countdownDisplay}`;
  }, [countdownDisplay, remainingMs]);

  return (
    <TimelineContainer>
      <Header direction="column" gap="8px">
        <Text size="2" color="gray" style={{ letterSpacing: "0.12em" }}>
          Gambling Timeline
        </Text>
        {latestSignal ? (
          <Flex direction="column" gap="4px">
            <SignalSummary
              size="6"
              weight="bold"
              $direction={latestSignal.direction}
            >
              {formatPercent(latestSignal.changePercent)}
            </SignalSummary>
            <MutedText>
              {latestSignal.direction === "up" ? "Spike" : "Drop"} at{" "}
              {moment(latestSignal.time).format("HH:mm")}
            </MutedText>
          </Flex>
        ) : (
          <MutedText>No significant moves detected</MutedText>
        )}
      </Header>

      <SignalsArea>
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
        ) : signals.length === 0 ? (
          <Centered>
            <MutedText>
              No spikes ≥ {POSITIVE_THRESHOLD}% or drops ≤ {NEGATIVE_THRESHOLD}%
            </MutedText>
          </Centered>
        ) : (
          <TimelineTrack>
            {signals.map((signal) => (
              <SignalItem key={signal.time}>
                <Triangle $direction={signal.direction} />
                <TimestampLabel>
                  {moment(signal.time).format("HH:mm")}
                </TimestampLabel>
              </SignalItem>
            ))}
            {countdownLabel ? (
              <GhostSignalItem>
                <GhostBurst>
                  <Loader size="20px" />
                </GhostBurst>
                <CountdownLabel>{countdownLabel}</CountdownLabel>
                {/* {countdownDisplay &&
                remainingMs !== null &&
                remainingMs > 0 &&
                predictedAt !== null ? (
                  <CountdownTimestamp>
                    {moment(predictedAt).format("HH:mm")}
                  </CountdownTimestamp>
                ) : null} */}
              </GhostSignalItem>
            ) : null}
          </TimelineTrack>
        )}
      </SignalsArea>
    </TimelineContainer>
  );
};

export default GamblingTimeline;

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

const SignalsArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  width: 100%;
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

const SignalSummary = styled(Text)<{ $direction: "up" | "down" }>`
  color: ${({ $direction }) =>
    $direction === "up" ? "#3bd783" : "#f16060"};
`;

const TimelineTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  width: 100%;
  flex: 1;
  height: 100%;
  overflow-x: auto;
  padding: 16px 8px 24px;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }
`;

const SignalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const Triangle = styled.div<{ $direction: "up" | "down" }>`
  width: 0;
  height: 0;
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  ${({ $direction }) =>
    $direction === "up"
      ? "border-bottom: 36px solid #3bd783;"
      : "border-top: 36px solid #f16060;"}
`;

const TimestampLabel = styled(Text)`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.08em;
  display: block;
`;

const GhostSignalItem = styled(SignalItem)`
  opacity: 0.7;
  gap: 12px;
`;

const GhostBurst = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CountdownLabel = styled(Text)`
  font-size: 12px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
`;
