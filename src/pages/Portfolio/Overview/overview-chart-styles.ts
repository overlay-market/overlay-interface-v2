import styled from "styled-components";
import theme from "../../../theme";
import { Box, Flex } from "@radix-ui/themes";

export const OverviewChartContainer = styled(Flex)`
  width: 100%;
  height: 275px;
  minHeight: 275px;
  border-radius: 8px;
  background: ${theme.color.grey4};
  padding: 24px 16px;
`

export const LegendLine = styled.div`
  background: ${theme.color.blue2};
  width: 15px;
  height: 2px;
  margin-right: 8px;
`

export const IntervalButton = styled(Box)<{selected: boolean}>`
  font-size: 12px;
  padding: 0 10px;
  cursor: pointer;
  color: ${({selected}) => (selected ? theme.color.blue2 : theme.color.grey3)};
`