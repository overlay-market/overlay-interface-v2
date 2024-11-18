import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "./theme";

export const AppContainer = styled(Flex)`
  width: 100vw;
  max-width: 1920px;
  min-height: 100vh;
  background: ${theme.color.background};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding-right: 20px;
  }
`