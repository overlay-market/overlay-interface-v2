import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const HeaderMarketName = styled(Box)`
  max-width: 160px; 
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  text-align: left;
`;

export const MarketsListContainer = styled(Flex)`
  height: ${theme.headerSize.height};
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-left: 15px;
  padding-right: 27px;
  cursor: pointer;

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 260px;
    padding-left: 16px;
    padding-right: 16px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    border-right: 1px solid ${theme.color.darkBlue};
    padding-left: 10px;
    padding-right: 10px;
  }
`
