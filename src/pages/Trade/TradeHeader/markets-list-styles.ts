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
  padding-right: 15px;
  cursor: pointer;

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 334px;
    padding-left: 16px;
    padding-right: 16px;
    border-right: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 260px;
    padding-left: 10px;
    padding-right: 10px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 272px;
    padding-left: 0;
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

export const DropdownContainer = styled(Box)`
  width: 100%;
  height: 520px;
  padding: 0 8px;
  position: absolute;
  top: ${theme.headerSize.height}
  left: 0;
  z-index: 10;
  background-color: ${theme.color.background};
  border-top: 1px solid ${theme.color.darkBlue};
  border-right: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 334px;
    height: 614px;
    padding: 0;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    width: 260px;
    height: 562px;
  }
  @media (min-width: ${theme.breakpoints.xxl}) {
    width: calc(272px + 60px);
    height: 645px;
    left: 0;
  }
`;

export const StyledScrollArea = styled.div`
  height: 520px;
  overflow-y: auto;
  position: relative;
  padding-right: 8px;
  margin-right: -8px;
 
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.color.grey6};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.color.darkBlue};
  }
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 614px;
    padding-right: 0px;
    margin-right: 0px;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    height: 562px;
  }
  @media (min-width: ${theme.breakpoints.xxl}) {
    height: 645px;
  }
`;

export const SearchEmptyMessage = styled.div`
  width: 100%;
  color: #777;
  padding-left: 16px;
`
