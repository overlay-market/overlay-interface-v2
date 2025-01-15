import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoContainer = styled(Flex)`
  justify-content: space-between;
  padding: 16px;
  border: solid 1px ${theme.color.darkBlue}; 
  border-radius: 16px;
  margin-bottom: 100px;
  margin-left: 0;
  pl={{ initial: "0px", sm: "20px" }}

  @media (min-width: ${theme.breakpoints.sm}) {
    margin-bottom: 20px;
    margin-left: 20px;
  }
`

export const GradientLink = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  color: transparent;
  --grad: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background: var(--grad), var(--grad) bottom 0px left 0/100% 1px no-repeat;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;
`;