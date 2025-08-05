import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const PositionsTableContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 16px 4px 66px;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px 8px 66px;
  }
`;

export const LineSeparator = styled(Flex)`
  height: 0;
  margin: 0 4px;
  padding-top: 8px;
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    margin: 0;
    margin-right: calc(0px - ${theme.app.rightPadding});
    width: calc(100% + ${theme.app.rightPadding});
  }
  
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-top: 24px;
    margin: 0;
    width: 100%;
  }
`