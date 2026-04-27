import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const PositionsTableContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 0 0 18px;
  background: #08090a;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 0 0 18px;
  }
`;

export const LineSeparator = styled(Flex)`
  height: 0;
  margin: 0 4px;
  padding-top: 8px;
  border-bottom: 1px solid ${theme.semantic.border};

  @media (min-width: ${theme.breakpoints.sm}) {
    margin: 0;
    margin-right: -20px;
    width: calc(100% + 20px);
  }
  
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-top: 24px;
    margin: 0;
    width: 100%;
  }
`
