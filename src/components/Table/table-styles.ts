import styled from "styled-components";
import theme from "../../theme";
import { Button, Flex } from "@radix-ui/themes";
import { ChevronDown } from "react-feather";

type TableVariant = "default" | "positions";

export const Table = styled.table<{ width?: string, minwidth?: string, $variant?: TableVariant }>`
  width: ${(props) => (props.width ?? '100%')};
  min-width: ${(props) => (props.minwidth ?? '100%')};
  border-collapse: separate;
  border-spacing: 0;
  table-layout: ${({ $variant }) => ($variant === "positions" ? "fixed" : "auto")};
  margin: ${({ $variant }) => ($variant === "positions" ? "8px 0 0" : "16px 0px")};
  background: ${({ $variant }) =>
    $variant === "positions" ? "#08090a" : theme.semantic.panel};
  border: ${({ $variant }) =>
    $variant === "positions" ? "0" : `1px solid ${theme.semantic.border}`};
  border-radius: ${({ $variant }) =>
    $variant === "positions" ? "0" : theme.radius.md};
  overflow: hidden;
`;

export const StyledHeader = styled.th<{ $variant?: TableVariant }>`
  padding: ${({ $variant }) =>
    $variant === "positions" ? "8px 14px 7px" : "12px 16px"};
  text-align: left;
  font-size: ${({ $variant }) => ($variant === "positions" ? "10px" : "12px")};
  font-weight: ${({ $variant }) => ($variant === "positions" ? 700 : 600)};
  color: ${theme.semantic.textMuted};
  background: ${({ $variant }) =>
    $variant === "positions" ? "#08090a" : theme.semantic.bgElevated};
  border-bottom: ${({ $variant }) =>
    $variant === "positions" ? "0" : `1px solid ${theme.semantic.border}`};
  text-decoration: ${({ $variant }) =>
    $variant === "positions" ? `underline dotted ${theme.semantic.border}` : "none"};
  text-underline-offset: 4px;
  white-space: nowrap;
`;

export const StyledRow = styled.tr`
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  &:hover {
    background-color: ${theme.semantic.hover};
    cursor: pointer;
   }

  .positions-terminal-table & {
    height: 54px;
    border-bottom: 0;

    &:hover {
      background: #0d0f12;
    }
  }
`;

export const StyledCell = styled.td`
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  color: ${theme.semantic.textSecondary};
  font-variant-numeric: tabular-nums;

  .positions-terminal-table & {
    padding: 8px 14px;
    border-bottom: 0;
    color: ${theme.semantic.textSecondary};
    font-size: 11px;
    vertical-align: middle;
  }
`;

export const PaginationButton = styled(Button)<{ $active?: string, $navbutton: string }>`
  background-color: ${({ $navbutton }) => ($navbutton === 'true' ? theme.semantic.field : theme.semantic.panel)};
  border: 1px solid ${({ $active }) => ($active === 'true' ? theme.semantic.accent : theme.semantic.border)};
  border-radius: ${theme.radius.sm};
  color: ${({ $active }) => ($active === 'true' ? theme.semantic.accent : theme.semantic.textSecondary)};
  width: 28px;
  padding: 4px 8px;
  margin: 0 4px;
  cursor: pointer;

  &:hover {
   box-shadow: 0 0 0 1px ${theme.semantic.border};
  }

  &[disabled] {
    color: ${theme.semantic.textMuted};
    cursor: not-allowed;
    &:hover {
      box-shadow: none;
     }
  }
`;

export const PaginationFlex = styled(Flex)`
  margin-top: 16px;
  align-items: center;
`;

export const Dropdown = styled.div`
  position: relative;
  padding: 6.5px 10px;
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.sm};
  margin-left: 8px;
  box-sizing: border-box;
  max-width: 104px;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .dropdown-menu {
      display: block;
    }

    .chevron {
      transform: rotate(180deg);
    }
  }
`

export const DropdownMenu = styled.div`
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.border};
  border-radius: 0 0 ${theme.radius.sm} ${theme.radius.sm};
  display: none;

  > button {
    width: 104px;
    border: 0;
    border-radius: ${theme.radius.sm};
    padding: 6.5px 10px;
    box-sizing: border-box;
    white-space: nowrap;
    background: transparent;
    color: ${theme.semantic.textSecondary};
    text-align: left;
    cursor: pointer;

    &:hover {
      background: ${theme.semantic.hover};
    }

    &:focus-visible {
      outline: 1px solid ${theme.semantic.focus};
      outline-offset: -2px;
    }
  }
`

export const RotatingChevron = styled(ChevronDown)`
  margin-left: 8px;
  transition: transform ease-out 0.25s;
`
