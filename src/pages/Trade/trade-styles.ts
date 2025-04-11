import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const StyledFlex = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 643px;
  }
`;

export const TradeContainer = styled(Flex)`
  width: 100%;

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: ${theme.app.xxlPadding};
    width: calc(100% - ${theme.app.xxlPadding});
  }
`;
