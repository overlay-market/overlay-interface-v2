import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const MyStatsContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  gap: 12px;
  background: ${theme.color.grey4};
  border-radius: 8px;

  @media (min-width: ${theme.breakpoints.lg}) {
    flex-direction: row;
  }
`

export const StatCard = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  gap: 8px;
  width: 100%;
  background: ${theme.color.background};
  border-radius: 8px;
`

export const StatValue = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
`

export const ClaimRewardsButton = styled(Text)`
  font-size: 12px;
  color: ${theme.color.blue3};
  text-decoration: underline;
  cursor: pointer;
`