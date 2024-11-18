import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const MainOverviewCardContainer = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  width: 200px;
  border-radius: 8px;
  padding: 12px;
  border: 2px solid ${theme.color.grey4};
  
  @media (min-width: 1024px) { 
    border-radius: 8px;
    padding: 40px;
    width: 100%;
    background: radial-gradient(
      90% 100% at 100% 100%,
      rgba(113, 206, 255, 0.65),
      rgba(113, 206, 255, 0.15) 60%,
      rgba(113, 206, 255, 0.05) 80%,
      rgba(113, 206, 255, 0) 100%
    ), ${theme.color.grey4};  
  }
`