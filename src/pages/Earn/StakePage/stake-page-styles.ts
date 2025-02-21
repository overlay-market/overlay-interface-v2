import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const StakeContainer = styled(Flex)`
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: ${theme.app.xxlPadding};
  }
`;

export const StakeContent = styled(Flex)`
  flex-direction: column;
  gap: 16px;
  margin-bottom: 100px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding-top: 16px;
    padding-left: 16px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: 0;
  }
`;

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
  
  }
`