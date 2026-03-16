import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const ChartContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  height: 350px;
  border: 1px solid ${theme.color.darkBlue};
  border-radius: 8px;
  background: ${theme.color.grey4};
  padding: 16px;
  margin-top: 16px;

  @media (min-width: ${theme.breakpoints.sm}) {
    height: 500px;
  }
`;

export const IntervalButton = styled(Box)<{ selected: boolean }>`
  font-size: 12px;
  padding: 0 10px;
  cursor: pointer;
  color: ${({ selected }) =>
    selected ? theme.color.blue2 : theme.color.grey3};
`;

export const LegendDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-right: 6px;
`;
