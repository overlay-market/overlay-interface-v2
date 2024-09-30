import { Box } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme";

export const StyledBox = styled(Box)`
  width: 76px;
  height: 56px;
  border-radius: 16px;
  padding: 9px 12px;

  &:hover {
    background: ${theme.color.grey4};
  }
`;

export const StyledLink = styled(NavLink)`
  color: ${theme.color.grey2};
  font-size: 10px;
  font-weight: 200;
  text-decoration: none;
`;

export const ActiveLabel = styled(Box)`
  font-weight: 400;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;