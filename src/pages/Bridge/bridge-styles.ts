import styled from "styled-components";
import theme from "../../theme";
import { Flex } from "@radix-ui/themes";

export const BridgeContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  direction: column;
  padding-top: 32px;
  justify-content: center;
  align-items: start;

  @media (min-width: ${theme.breakpoints.sm}) {  
    height: calc(100vh - 140px);  
    padding-top: 0;
    align-items: center;
  }  
`;

export const GradientBorderBox = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {    
    border: 1px solid ${theme.semantic.border}; 
    border-radius: ${theme.radius.md};
    background: ${theme.semantic.panel};
    box-shadow: none;
  }  
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  outline: none;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  box-sizing: border-box;
  color: ${theme.color.white};
  background-color: ${theme.semantic.field};
  font-size: 14px;
  font-weight: 600;
  font-family: Inter;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::placeholder {
    color: ${theme.semantic.textMuted};
  }
`;
