import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const SuggestedCardsContainer = styled(Flex)`
  width: 100%;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100vw - ${theme.headerSize.tabletWidth} - 20px - 16px);
  }
  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100vw - ${theme.headerSize.width} - 20px - 16px);
  }
`;