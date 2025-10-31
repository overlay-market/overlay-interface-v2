export type CandleApiResponse = {
  _id: { time: string };
  open: number | string;
  close: number | string;
  high: number | string;
  low: number | string;
};

export type NormalizedCandle = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
};

export type TimelinePoint = {
  time: number;
  changePercent: number;
};

const toNumber = (value: number | string | undefined): number => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  return NaN;
};

export const normalizeCandles = (
  candles: CandleApiResponse[]
): NormalizedCandle[] => {
  return candles
    .map((candle) => {
      const time = new Date(candle._id.time).getTime();
      const open = toNumber(candle.open);
      const close = toNumber(candle.close);
      const high = toNumber(candle.high);
      const low = toNumber(candle.low);

      if (![time, open, close, high, low].every(Number.isFinite)) {
        return null;
      }

      return {
        time,
        open,
        close,
        high,
        low,
      } as NormalizedCandle;
    })
    .filter((item): item is NormalizedCandle => item !== null)
    .sort((a, b) => a.time - b.time);
};

export const buildTimelineFromCandles = (
  candles: NormalizedCandle[]
): TimelinePoint[] => {
  if (candles.length <= 1) {
    return [];
  }

  const timeline: TimelinePoint[] = [];

  for (let index = 1; index < candles.length; index += 1) {
    const current = candles[index];
    const previous = candles[index - 1];
    const prevClose = previous.close;

    let changePercent = 0;

    if (current.high > prevClose) {
      changePercent = ((current.high - prevClose) / prevClose) * 100;
    } else if (current.low < prevClose) {
      changePercent = ((current.low - prevClose) / prevClose) * 100;
    }

    if (!Number.isFinite(changePercent)) {
      changePercent = 0;
    }

    timeline.push({
      time: current.time,
      changePercent,
    });
  }

  return timeline;
};
