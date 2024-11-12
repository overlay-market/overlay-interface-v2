import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const LinksWrapper = styled(Flex)`
  visibility: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {
    visibility: visible;
  }
`;

export const MobileNavBar = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 89px;
  padding: 15px 0;
  position: fixed;
  bottom: 0;
  background: ${theme.color.background};
  z-index: 1000;
  box-shadow: rgb(0 0 0 / 40%) 0px 0px 12px 0px;

  @media (min-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`