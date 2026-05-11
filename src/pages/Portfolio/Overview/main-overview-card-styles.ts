import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const MainOverviewCardContainer = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  width: 200px;
  border-radius: ${theme.radius.md};
  padding: 12px;
  border: 1px solid ${theme.semantic.border};
  background: ${theme.semantic.panel};
  
  @media (min-width: 1024px) { 
    border-radius: ${theme.radius.md};
    padding: 40px;
    width: 100%;
    background:
      radial-gradient(90% 100% at 100% 100%, rgba(243, 169, 27, 0.18), transparent 68%),
      ${theme.semantic.panel};  
  }
`
