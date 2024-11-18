import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const TradeWidgetContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 418px;
    margin-left: 20px;
  }
`;