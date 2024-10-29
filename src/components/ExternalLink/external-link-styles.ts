import styled from "styled-components";
import theme from "../../theme";

export const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${theme.color.white};
  font-weight: 500;
  :focus {
    outline: none;
  }
`;
