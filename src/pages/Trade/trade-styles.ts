import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const StyledFlex = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 643px;
  }
`;

export const TradeContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    margin-left: 60px;
    margin-right: 28px;
  }
`

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 0;
    margin-left: -60px;
    margin-right: -28px;
    border-bottom: 1px solid ${theme.color.darkBlue};
  }
`