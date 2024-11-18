import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const PositionsTableContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 16px 15px 66px;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px 8px 66px;
  }
`;

export const LineSeparator = styled(Flex)`
  height: 0;
  margin: 0 15px;
  padding-top: 8px;
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    margin: 0;
  }
  
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-top: 24px;
  }
`