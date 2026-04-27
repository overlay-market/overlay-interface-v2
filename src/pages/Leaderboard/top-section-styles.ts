import { Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const GradientText = styled(Text)`
  width: fit-content;
  background: ${theme.gradient.accentText};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

export const Link = styled.a`
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
`
