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
  padding-left: 4px;
  padding-right: 16px;
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

export const CurrentMarketLogo = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(236, 236, 236, 0.15);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  @media (min-width: ${theme.breakpoints.md}) {
    width: 34px;
    height: 34px;
  }
`;
