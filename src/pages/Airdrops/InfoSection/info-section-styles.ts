import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoContainer = styled(Flex)`
  justify-content: space-between;
  padding: 16px;
  border: solid 1px ${theme.color.darkBlue}; 
  border-radius: 16px;
  margin-bottom: 100px;

  @media (min-width: ${theme.breakpoints.sm}) {
    margin-bottom: 20px;
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