import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const LinksWrapper = styled(Flex)`
  position: absolute;
  left: -9999px;

  @media (min-width: ${theme.breakpoints.sm}) {
    position: static;
  }
`;

export const MobileNavBarContainer = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 73px;
  padding: 8px 16px;
  position: fixed;
  bottom: 0;
  background: ${theme.color.background};
  z-index: 1000;
  box-shadow: rgb(0 0 0 / 40%) 0px 0px 12px 0px;
  left: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;
