import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const MarketSelectorRoot = styled(Box)`
  position: relative;
  flex: 0 0 100%;
  min-width: 0;
  width: 100%;

  @media (min-width: ${theme.breakpoints.sm}) {
    flex-basis: 280px;
    width: 280px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    flex-basis: 300px;
  }
`;

export const HeaderMarketName = styled(Box)`
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.05;
`;

export const HeaderMarketText = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
`;

export const HeaderLeverageBadge = styled.span`
  flex: 0 0 auto;
  max-width: 100%;
  width: fit-content;
  height: 18px;
  padding: 2px 7px;
  border-radius: ${theme.radius.xs};
  background: rgba(243, 169, 27, 0.2);
  color: ${theme.semantic.accent};
  font-size: 11px;
  font-weight: 800;
  line-height: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderActions = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  color: ${theme.semantic.textMuted};
`;

export const MarketsListContainer = styled.button`
  box-sizing: border-box;
  height: 72px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-left: 16px;
  padding-right: 12px;
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
    width: 280px;
    border-right: 1px solid ${theme.semantic.borderMuted};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 280px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 300px;
  }
`

export const CurrentMarketLogo = styled.img`
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid ${theme.semantic.border};
  box-shadow: none;
  @media (min-width: ${theme.breakpoints.md}) {
    width: 32px;
    height: 32px;
  }
`;

export const DropdownContainer = styled(Box)`
  width: min(100vw, 560px);
  height: min(680px, calc(100vh - 76px));
  padding: 0;
  position: absolute;
  top: 72px;
  left: 0;
  z-index: 30;
  background-color: #0d0e10;
  border: 1px solid ${theme.semantic.border};
  border-left: 1px solid ${theme.semantic.border};
  border-radius: 0 0 ${theme.radius.md} ${theme.radius.md};
  box-shadow: ${theme.shadow.popover};
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 560px;
    height: 650px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 580px;
    height: 650px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    width: 600px;
    height: 690px;
  }
`;

export const StyledScrollArea = styled.div`
  height: 100%;
  overflow-y: auto;
  position: relative;
  padding-right: 0;
  margin-right: 0;
 
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
`;

export const SearchEmptyMessage = styled.div`
  width: 100%;
  color: ${theme.semantic.textMuted};
  padding: 18px 16px;
  font-size: 13px;
`

export const DropdownContent = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

export const DropdownTop = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #101113;

  @media (max-width: ${theme.breakpoints.xs}) {
    padding: 12px;
  }
`;

export const SearchShell = styled.div`
  & > div {
    padding: 0;
    height: 34px;
  }

  input {
    height: 34px;
    border-color: #3a3d45;
    border-radius: 10px;
    background: #1d1d22;
    font-size: 13px;
  }

  svg {
    left: 12px;
  }
`;

export const CategoryTabsShell = styled.div`
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 30px;
  align-items: center;
  min-height: 44px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #0d0e10;
`;

export const CategoryScrollButton = styled.button<{ $visible?: boolean }>`
  width: 30px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: #0d0e10;
  color: ${({ $visible }) =>
    $visible ? theme.semantic.textPrimary : theme.semantic.textMuted};
  opacity: ${({ $visible }) => ($visible ? 1 : 0.35)};
  cursor: ${({ $visible }) => ($visible ? "pointer" : "default")};
  transition:
    color 120ms ease,
    opacity 120ms ease,
    background 120ms ease;

  &:hover:not(:disabled) {
    background: ${theme.semantic.hover};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  min-height: 44px;
  padding: 0 6px;
  overflow-x: auto;
  background: #0d0e10;
  scroll-behavior: smooth;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryTab = styled.button<{ $active?: boolean }>`
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 700)};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${theme.semantic.textPrimary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const MarketsTableHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px 92px;
  gap: 10px;
  align-items: center;
  min-height: 36px;
  padding: 0 16px;
  background: #111315;
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 600;
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  @media (max-width: ${theme.breakpoints.xs}) {
    grid-template-columns: minmax(0, 1fr) 76px 72px;
    gap: 8px;
    padding: 0 12px;
  }
`;

export const HeaderRight = styled.span`
  text-align: right;
`;
