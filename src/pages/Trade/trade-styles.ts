import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const StyledFlex = styled(Flex)`
  min-height: auto;

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: 561px;
  }

  @media (min-width: 1536px) {
    min-height: 643px;
  }
`;

export const TradeContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: 16px;
  }
`;
