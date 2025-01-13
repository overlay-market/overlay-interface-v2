import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoContainer = styled(Flex)`
  gap: 8px;
  padding-top: 20px;
  padding-bottom: 32px;

  @media (min-width: ${theme.breakpoints.md}) {
    gap: 16px;
  }
`

export const GradientText = styled(Text)`
  width: fit-content;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;