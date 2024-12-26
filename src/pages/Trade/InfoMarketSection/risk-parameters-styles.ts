import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const RiskParamsTablesContainer = styled(Flex)`
  gap: 18px;  
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.sm}) { 
    width: 100%;
    flex-wrap: wrap;
  }
`

export const RiskParamsTable = styled(Box)`
  flex: 0 0 280px;
  border-radius: 4px;
  background: ${theme.color.grey4};
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) { 
    flex: 0 0 calc(50% - 9px);
  }
  @media (min-width: ${theme.breakpoints.md}) {     
    flex: 1;
  }
  &:last-child {
    @media (min-width: ${theme.breakpoints.sm}) {
      flex: 0 0 100%; 
    }
    @media (min-width: ${theme.breakpoints.md}) {     
      flex: 1;
    }
  }
`

export const RiskParamsItem = styled(Flex)`
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #2c2c2c;
`
