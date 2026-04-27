import styled from "styled-components";
import { Flex } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import theme from "../../theme";

export const SearchContainer = styled(Flex)`
  position: relative;
  width: 100%;
  height: 49px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding: 12px 8px 12px 16px;
  }
`;

export const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.color.grey3};
  z-index:5;
  width: 16px;
  height: 16px;
  pointer-events: none;

  @media (min-width: ${theme.breakpoints.xxl}) {
    left: 24px;
  }
`

export const SearchInput = styled.input<{ $bgcolor?: string }>`
  width: 100%;
  padding: 8px 28px;  
  border-radius: ${theme.radius.sm};
  border: 1px solid ${({ $bgcolor }) => $bgcolor || theme.semantic.border};  
  background: ${({ $bgcolor }) => $bgcolor || theme.semantic.field}; 
  color: ${theme.semantic.textPrimary}; 
  font-size: 14px;
  outline: none;
  transition: border-color 0.16s ease, background 0.16s ease;
    
  &:focus {
    border-color: ${theme.semantic.accent};
    box-shadow: ${theme.shadow.focus};
  }

  &::placeholder {
    color: ${theme.semantic.textMuted};
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: ${theme.color.grey3};
  font-size: 20px;
  border: none;
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: ${theme.semantic.accent};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`
