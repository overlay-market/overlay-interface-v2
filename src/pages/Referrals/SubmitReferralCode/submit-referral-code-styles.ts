import { Flex, Text } from "@radix-ui/themes"
import styled from "styled-components"
import theme from "../../../theme";

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.semantic.border};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
  
  }
`

export const GradientBorderBox = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    border: 1px solid ${theme.semantic.border}; 
    border-radius: ${theme.radius.md};
    background: ${theme.semantic.panel};
  } 
`;

export const ContentContainer = styled(Flex)`
  flex-direction: column;
  width: 343px;
  gap: 20px;
  padding: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 424px;
    padding: 32px;
  } 
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  outline: none;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  box-sizing: border-box;
  color: ${theme.color.grey2};
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

export const GradientText = styled(Text)`
  width: fit-content;
  background: ${theme.gradient.accentText};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;
