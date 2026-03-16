import React, { useMemo, useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import theme from "../../../theme";
import { PredictionMarketGroup } from "../../../constants/markets";
import {
  usePredictionGroupChart,
  PredictionChartResolution,
} from "../../../hooks/usePredictionGroupChart";
import {
  ChartContainer,
  IntervalButton,
  LegendDot,
} from "./prediction-group-chart-styles";

const ALL_RESOLUTIONS: { label: string; value: PredictionChartResolution; minDays: number }[] = [
  { label: "1H", value: "60", minDays: 0 },
  { label: "4H", value: "240", minDays: 3 },
  { label: "1D", value: "1D", minDays: 7 },
  { label: "1W", value: "1W", minDays: 45 },
];

const OUTCOME_COLORS: Record<string, string> = {
  Google: "#4285F4",
  OpenAI: "#10A37F",
  Anthropic: "#D4A574",
};

const DEFAULT_COLORS = ["#4285F4", "#10A37F", "#D4A574", "#FF648A", "#71CEFF"];

interface PredictionGroupChartProps {
  group: PredictionMarketGroup;
}

const PredictionGroupChart: React.FC<PredictionGroupChartProps> = ({
  group,
}) => {
  const [resolution, setResolution] =
    useState<PredictionChartResolution>("60");
  const { chartData, dataSpanDays, isLoading } = usePredictionGroupChart(
    group,
    resolution
  );

  const visibleResolutions = useMemo(
    () => ALL_RESOLUTIONS.filter((r) => dataSpanDays >= r.minDays),
    [dataSpanDays]
  );

  const outcomeLabels = useMemo(
    () =>
      group.marketIds.map(
        (id) => group.outcomeLabels[id] || decodeURIComponent(id)
      ),
    [group]
  );

  const getColor = (label: string, index: number) =>
    OUTCOME_COLORS[label] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

  const intervalValue = useMemo(() => {
    if (chartData && chartData.length > 0) {
      return Math.ceil(chartData.length / 8);
    }
    return 0;
  }, [chartData]);

  const formatXAxisTick = (value: string) => {
    switch (resolution) {
      case "60":
        return moment(value).format("HH:mm");
      case "240":
        return moment(value).format("D MMM HH:mm");
      case "1D":
        return moment(value).format("D MMM");
      case "1W":
        return moment(value).format("D MMM YY");
      default:
        return moment(value).format("D MMM");
    }
  };

  const customXAxisTick = ({
    x = 0,
    y = 0,
    payload = { value: "" },
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }): JSX.Element => (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill={theme.color.grey3}
        fontSize={12}
        fontFamily="Inter"
      >
        {formatXAxisTick(payload.value)}
      </text>
    </g>
  );

  const customYAxisTick = ({
    x = 0,
    y = 0,
    payload = { value: "" },
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }): JSX.Element => (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={5}
        dx={50}
        textAnchor="end"
        fill={theme.color.grey3}
        fontSize={12}
        fontFamily="Inter"
      >
        {payload.value}%
      </text>
    </g>
  );

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const date = moment(label);
    let dateLabel: string;
    switch (resolution) {
      case "60":
        dateLabel = date.format("D MMM YY HH:mm");
        break;
      case "240":
        dateLabel = date.format("D MMM YY HH:mm");
        break;
      default:
        dateLabel = date.format("D MMM YY");
    }

    return (
      <Box
        p={theme.tooltip.padding}
        style={{
          background: theme.tooltip.background,
          borderRadius: theme.tooltip.borderRadius,
        }}
      >
        <Text size="1" style={{ color: theme.color.grey3 }}>
          {dateLabel}
        </Text>
        {payload.map((entry: any) => (
          <Flex key={entry.dataKey} align="center" gap="6px" mt="4px">
            <LegendDot color={entry.color} />
            <Text size="1">{entry.dataKey}:</Text>
            <Text size="1" weight="bold" style={{ color: entry.color }}>
              {entry.value != null ? `${entry.value}%` : "—"}
            </Text>
          </Flex>
        ))}
      </Box>
    );
  };

  return (
    <ChartContainer>
      <Flex align="center" justify="between" mb="12px">
        <Flex>
          {visibleResolutions.map(({ label, value }) => (
            <IntervalButton
              key={value}
              selected={resolution === value}
              onClick={() => setResolution(value)}
            >
              {label}
            </IntervalButton>
          ))}
        </Flex>
        <Flex align="center" gap="12px">
          {outcomeLabels.map((label, i) => (
            <Flex key={label} align="center">
              <LegendDot color={getColor(label, i)} />
              <Text size="1" style={{ color: theme.color.grey3 }}>
                {label}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {isLoading ? (
        <Flex
          align="center"
          justify="center"
          style={{ flex: 1 }}
        >
          <Text size="2" style={{ color: theme.color.grey3 }}>
            Loading chart...
          </Text>
        </Flex>
      ) : !chartData || chartData.length === 0 ? (
        <Flex
          align="center"
          justify="center"
          style={{ flex: 1 }}
        >
          <Text size="2" style={{ color: theme.color.grey3 }}>
            No data to display
          </Text>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ bottom: 20, top: 10, left: 8, right: 8 }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              interval={intervalValue}
              tick={customXAxisTick}
            />
            <YAxis
              orientation="right"
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              tick={customYAxisTick}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={customTooltip} />
            {outcomeLabels.map((label, i) => (
              <Line
                key={label}
                type="monotone"
                dataKey={label}
                stroke={getColor(label, i)}
                dot={false}
                strokeWidth={2}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default PredictionGroupChart;
