import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "./theme";

export const AppContainer = styled(Flex)`
  width: calc(100vw - 16px);
  padding-right: 16px;
  max-width: 1920px;
  min-height: 100vh;
  background: ${theme.color.background};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    width: calc(100vw - 20px);
    padding-right: 20px;
  }
`