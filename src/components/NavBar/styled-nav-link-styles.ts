import { Box } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme";

export const StyledBox = styled(Box)`
  width: 66px;
  height: 57px;
  padding: 8px;
  border-radius: 12px;

  &:hover {
    background: ${theme.color.grey4};    
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 66px;
    height: 56px;
    border-radius: 12px;
    padding: 9px 8px;
  }
  @media (min-width: ${theme.breakpoints.md}) {
    width: 76px;
    height: 56px;
    border-radius: 16px;
    padding: 9px 12px;
  }
`;

export const StyledLink = styled(NavLink)`
  color: ${theme.color.grey2};
  font-size: 12px;
  font-weight: 400;
  text-decoration: none;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
    font-weight: 200;
    text-decoration: none;
  }
`;

export const ActiveLabel = styled(Box)`
  font-weight: 400;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

export const StyledLinkBurgerMode = styled(NavLink)`
  color: ${theme.color.grey2};
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
`;

export const StyledBoxBurgerMode = styled(Box)`
  width: 100%;
  height: 40px;
  padding: 10px 18px;

  &:hover {
    background: ${theme.color.background};
  }
`;