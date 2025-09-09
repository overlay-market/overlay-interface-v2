import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoMarketContainer = styled(Flex)`
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 345px;  

  @media (min-width: ${theme.breakpoints.sm}) {  
    flex-direction: row;
    width: 100%;
  }
  @media (min-width: ${theme.breakpoints.md}) {  
    flex-direction: column;
    width: 376px;  
    min-width: 376px;
  }
  @media (min-width: ${theme.breakpoints.xxl}) {  
    width: 551px;  
    min-width: 551px;
  }
`