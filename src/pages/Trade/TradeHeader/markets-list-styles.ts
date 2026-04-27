import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const HeaderMarketName = styled(Box)`
  max-width: 190px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  text-align: left;
`;

export const MarketsListContainer = styled.button`
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-left: 18px;
  padding-right: 16px;
  cursor: pointer;
  border: 0;
  border-right: 1px solid ${theme.semantic.borderMuted};
  background: transparent;
  color: ${theme.semantic.textPrimary};
  text-align: left;

  &:hover {
    background: ${theme.semantic.hover};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 300px;
    padding-left: 18px;
    padding-right: 16px;
    border-right: 1px solid ${theme.semantic.borderMuted};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 300px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 320px;
  }
`

export const CurrentMarketLogo = styled.img`
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.semantic.border};
  box-shadow: none;
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
  top: 64px;
  left: 0;
  z-index: 10;
  background-color: #08090a;
  border: 1px solid ${theme.semantic.border};
  border-left: 0;
  box-shadow: ${theme.shadow.popover};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 300px;
    height: 614px;
    padding: 0;
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    width: 300px;
    height: 562px;
  }
  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 320px;
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
    background-color: ${theme.semantic.border};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.semantic.textMuted};
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
  color: ${theme.semantic.textMuted};
  padding-left: 16px;
`
