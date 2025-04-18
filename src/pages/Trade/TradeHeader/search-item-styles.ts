import styled from "styled-components";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export const SearchContainer = styled(Flex)`
  position: relative;
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
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 28px;  
  border-radius: 6px;
  border: 1px solid ${theme.color.grey4};  
  background: ${theme.color.grey4}; 
  opacity: 0.7;
  color: #ddd; 
  font-size: 14px;
  outline: none;
    
  &:focus {
    opacity: 1;
  }

  &::placeholder {
    color: #777;
  }
`;

export const ClearButton = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: ${theme.color.grey3};
  font-size: 20px;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${theme.color.blue1};
  }
`