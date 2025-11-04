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
  NormalizedCandle,
  TimelinePoint,
  buildTimelineFromCandles,
  normalizeCandles,
} from "./gamblingTimelineHelpers";

const CANDLE_INTERVAL_MINUTES = 1;
const DEFAULT_CANDLE_COUNT = 180; // roughly three hours of history
const CANDLE_BUFFER_COUNT = 10;
const SSE_RECONNECT_DELAY_MS = 5000;
const POSITIVE_THRESHOLD = 50;
const NEGATIVE_THRESHOLD = -25;
type SignalPoint = TimelinePoint & { direction: "up" | "down" };

const GamblingTimeline: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const { chainId } = useMultichainContext();

  const [data, setData] = useState<TimelinePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);
  const candlesRef = useRef<NormalizedCandle[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  const marketAddress = useMemo(() => {
    return currentMarket?.id ? currentMarket.id.toLowerCase() : undefined;
  }, [currentMarket?.id]);

  useEffect(() => {
    if (!marketAddress || !chainId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setData([]);
    candlesRef.current = [];

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (retryTimeoutRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    let isActive = true;
    const intervalMs = CANDLE_INTERVAL_MINUTES * 60 * 1000;
    const candleCount = DEFAULT_CANDLE_COUNT;
    const maxCandles = candleCount + CANDLE_BUFFER_COUNT;
    const baseUrl = getMarketChartUrl(chainId);

    const mergeCandles = (incoming: NormalizedCandle[]) => {
      if (!isActive || incoming.length === 0) {
        return;
      }

      const merged = new Map<number, NormalizedCandle>();
      candlesRef.current.forEach((candle) => {
        merged.set(candle.time, candle);
      });
      incoming.forEach((candle) => {
        merged.set(candle.time, candle);
      });

      const sorted = Array.from(merged.values()).sort(
        (a, b) => a.time - b.time
      );

      const limited = sorted.slice(-maxCandles);
      candlesRef.current = limited;

      const timelinePoints = buildTimelineFromCandles(limited);
      setData(timelinePoints.slice(-candleCount));
    };

    const fetchCandles = async () => {
      try {
        const now = Date.now();
        const from = now - maxCandles * intervalMs;

        const url = new URL(baseUrl);
        url.searchParams.set("market", marketAddress);
        url.searchParams.set("binSize", CANDLE_INTERVAL_MINUTES.toString());
        url.searchParams.set("binUnit", "minute");
        url.searchParams.set("from", from.toString());
        url.searchParams.set("limit", maxCandles.toString());

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`Failed to load candles: ${response.statusText}`);
        }

        const candles: CandleApiResponse[] = await response.json();

        const normalized = normalizeCandles(candles);
        mergeCandles(normalized);
        if (isActive) {
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching gambling timeline:", err);
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Unknown error loading timeline"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchCandles();
    const setupEventSource = () => {
      if (
        !isActive ||
        typeof window === "undefined" ||
        typeof EventSource === "undefined"
      ) {
        return;
      }

      const sseUrl = new URL(`${baseUrl}/sse`);
      sseUrl.searchParams.set("market", marketAddress);
      sseUrl.searchParams.set("binSize", CANDLE_INTERVAL_MINUTES.toString());
      sseUrl.searchParams.set("binUnit", "minute");

      const eventSource = new EventSource(sseUrl.toString());
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        if (!isActive) {
          return;
        }

        try {
          const payload = JSON.parse(event.data) as CandleApiResponse[];
          if (!Array.isArray(payload) || payload.length === 0) {
            return;
          }

          const normalized = normalizeCandles(payload);
          if (normalized.length === 0) {
            return;
          }

          mergeCandles(normalized);
        } catch (messageError) {
          console.error(
            "Error processing gambling timeline update:",
            messageError
          );
        }
      };

      eventSource.onerror = (eventError) => {
        console.error("Gambling timeline SSE error:", eventError);
        eventSource.close();
        eventSourceRef.current = null;

        if (!isActive || typeof window === "undefined") {
          return;
        }

        if (retryTimeoutRef.current !== null) {
          window.clearTimeout(retryTimeoutRef.current);
        }

        retryTimeoutRef.current = window.setTimeout(() => {
          retryTimeoutRef.current = null;
          setupEventSource();
        }, SSE_RECONNECT_DELAY_MS);
      };
    };

    setupEventSource();

    return () => {
      isActive = false;
      if (retryTimeoutRef.current !== null && typeof window !== "undefined") {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
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
        direction: point.changePercent >= POSITIVE_THRESHOLD ? "up" : "down",
      }));
  }, [data]);

  const lastSignalTime =
    signals.length > 0 ? signals[signals.length - 1].time : null;

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

  useEffect(() => {
    const track = timelineTrackRef.current;
    if (!track) {
      return;
    }

    const scrollToEnd = () => {
      track.scrollLeft = track.scrollWidth;
    };

    if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
      window.requestAnimationFrame(scrollToEnd);
    } else {
      scrollToEnd();
    }
  }, [signals.length, lastSignalTime]);

  return (
    <TimelineContainer>
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
          <TimelineTrack ref={timelineTrackRef}>
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
              </GhostSignalItem>
            ) : null}
          </TimelineTrack>
        )}
      </SignalsArea>
    </TimelineContainer>
  );
};

export default GamblingTimeline;

const TimelineContainer = styled.div`
  width: 100%;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  min-height: 258px;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(9, 13, 24, 0.6);
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: 561px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    min-height: 643px;
  }
`;

const SignalsArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
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

const TimelineTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  width: 0;
  max-width: 100%;
  flex: 1;
  height: 100%;
  overflow-x: auto;
  padding: 16px 8px 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SignalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  min-width: 0;
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
