import { Box, Flex, Text } from "@radix-ui/themes";
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import {
  IntervalType,
  OverviewDataByPeriod,
} from "../../../types/accountDetailsTypes";
import theme from "../../../theme";
import {
  LegendLine,
  OverviewChartContainer,
  IntervalButton,
} from "./overview-chart-styles";

const intervals: IntervalType[] = ["1D", "1W", "1M", "6M", "1Y"];

interface TickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

type OverviewChartProps = {
  selectedInterval: string;
  handleSelectInterval: Function;
  chartData: OverviewDataByPeriod | undefined;
};

const OverviewChart: React.FC<OverviewChartProps> = ({
  selectedInterval,
  handleSelectInterval,
  chartData,
}) => {
  const customizedXAxisTick = ({
    x = 0,
    y = 0,
    payload = { value: "" },
  }: TickProps): JSX.Element => {
    let label;
    switch (selectedInterval) {
      case "1D":
        // hour
        label = moment(payload.value).format("HH:00");
        break;
      case "1W":
        // day
        label = moment(payload.value).format("D MMM YY");
        break;
      case "6M":
        // week
        label = moment(payload.value).format("MMM YY");
        break;
      case "1Y":
        // month
        label = moment(payload.value).format("MMM YY");
        break;
      default:
        // day
        label = moment(payload.value).format("D MMM");
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={25}
          dx={20}
          textAnchor="end"
          fill={theme.color.grey3}
          fontSize={12}
          fontFamily="Inter"
        >
          {label}
        </text>
      </g>
    );
  };

  const customizedYAxisTick = ({
    x = 0,
    y = 0,
    payload = { value: "98" },
  }: TickProps): JSX.Element => (
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
        {payload.value}
      </text>
    </g>
  );

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      let rangeLabel;
      const date = moment(label);

      switch (selectedInterval) {
        case "1D":
          rangeLabel = date.format("D MMM YY HH:00");
          break;
        case "1W":
          rangeLabel = date.format("D MMM YY");
          break;
        case "6M":
          rangeLabel = date.format("D MMM YY");
          break;
        case "1Y":
          rangeLabel = date.format("MMM YY");
          break;
        default:
          rangeLabel = date.format("D MMM YY");
      }

      return (
        <Box
          p={"8px"}
          style={{ background: "rgba(32, 36, 49, 0.8)", borderRadius: "8px" }}
        >
          <Text>{rangeLabel}</Text>
          <Flex align="center">
            <Text>Realized PnL: </Text>
            <Text
              style={{
                color:
                  Number.parseFloat(payload[0].value) < 0
                    ? theme.color.red1
                    : theme.color.green1,
              }}
            >
              {+payload[0].value < 1
                ? +payload[0].value.toFixed(6)
                : +payload[0].value.toFixed(2)}
            </Text>
          </Flex>
        </Box>
      );
    }

    return null;
  };

  const intervalValue = useMemo(() => {
    if (chartData) {
      return Math.ceil(chartData.length / 10);
    } else {
      return 0;
    }
  }, [chartData]);

  return (
    <OverviewChartContainer direction={"column"}>
      <Flex align="center" justify="between" mb="16px">
        <Flex>
          {intervals.map((interval, id) => (
            <IntervalButton
              key={id}
              selected={selectedInterval === interval}
              onClick={() => handleSelectInterval(interval)}
            >
              {interval}
            </IntervalButton>
          ))}
        </Flex>
        <Flex align="center">
          <LegendLine />
          <Text>Realized PnL</Text>
        </Flex>
      </Flex>
      <ResponsiveContainer width="100%" height={"100%"}>
        {!chartData || chartData.length === 0 ? (
          <Flex align="center" justify="center" style={{ height: "inherit" }}>
            <Text>No data to display</Text>
          </Flex>
        ) : (
          <LineChart
            data={chartData}
            margin={{
              bottom: 5,
              top: 5,
              left: 8,
            }}
          >
            <XAxis
              dy={4}
              dataKey="date"
              axisLine={false}
              tickLine={false}
              interval={intervalValue}
              tick={customizedXAxisTick}
            />
            <YAxis
              orientation="right"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={customizedYAxisTick}
            />
            <Tooltip content={customTooltip} />
            <Line
              type="linear"
              dataKey="realizedPnl"
              stroke={theme.color.blue2}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </OverviewChartContainer>
  );
};

export default OverviewChart;
