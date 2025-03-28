import { Box, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 58px;
  padding: 16px;
  border-radius: 8px;
  background: ${theme.color.grey4};

  @media (min-width: ${theme.breakpoints.sm}) {      
    flex-direction: column;
    align-items: start;
    height: 97px;
  }
  @media (min-width: ${theme.breakpoints.md}) {     
    flex-direction: row;
    align-items: center;
    height: 70px;
  }
`

export const TextLabel = styled(Text)`
  font-size: 14px;
  font-weight: 700;

  @media (min-width: ${theme.breakpoints.sm}) {      
    font-size: 16px;
  }
`

export const TextValue = styled(Text)`
  font-size: 22px;
  font-weight: 700;
  color: ${theme.color.grey3};

  @media (min-width: ${theme.breakpoints.sm}) {      
    font-size: 32px;
  }
`