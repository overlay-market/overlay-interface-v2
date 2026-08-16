import { Box } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme";

export const StyledBox = styled(Box)`
  width: 66px;
  height: 57px;
  padding: 8px;
  border-radius: ${theme.radius.md};
  transition: background 0.16s ease, color 0.16s ease;

  &:hover {
    background: ${theme.semantic.hover};    
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: auto;
    min-width: 72px;
    height: ${theme.headerSize.height};
    border-radius: 0;
    padding: 0 14px;
  }
  @media (min-width: ${theme.breakpoints.md}) {
    min-width: 82px;
    height: ${theme.headerSize.height};
    border-radius: 0;
    padding: 0 18px;
  }
`;

export const StyledLink = styled(NavLink)`
  color: ${theme.semantic.textMuted};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;

  @media (min-width: ${theme.breakpoints.sm}) {
    display: inline-flex;
    align-items: center;
    height: ${theme.headerSize.height};
    font-size: 14px;
    font-weight: 550;
    letter-spacing: 0.012em;
    text-decoration: none;
  }
  &.active {
    color: ${theme.semantic.textPrimary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
    border-radius: ${theme.radius.md};
  }
`;

export const ActiveLabel = styled(Box)`
  font-weight: 600;
  letter-spacing: 0.014em;
  color: ${theme.semantic.accent};

  @media (min-width: ${theme.breakpoints.sm}) {
    color: ${theme.semantic.accent};
  }
`;

export const StyledLinkBurgerMode = styled(NavLink)`
  color: ${theme.color.grey2};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const StyledBoxBurgerMode = styled(Box)`
  width: 100%;
  height: 40px;
  padding: 10px 18px;

  &:hover {
    background: ${theme.semantic.hover};
  }
`;
