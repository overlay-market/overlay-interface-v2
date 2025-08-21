import { Box, DropdownMenu } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const ColumnSelectButton = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: end;  
  gap: 12px;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  color: ${theme.color.grey2};
  font-size: 12px;
  cursor: pointer;
`

export const StyledDropdownContent = styled(DropdownMenu.Content)`
  background: #191A26;
  padding: 0px;
  position: relative;
  margin-right: -12px;
  margin-top: 8px;
  outline: none;
  border-radius: 0px;
  box-shadow: ${theme.color.grey7} 0px 4px 6px 0px;
  border: 1px solid ${theme.color.grey9};
`;

export const StyledDropdownItem = styled(DropdownMenu.Item)`
  display: flex;
  justify-content: flex-end; 
  padding: 22px 12px;
  color: ${theme.color.grey3};
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid ${theme.color.grey7};
  
  &:hover {
    background-color: ${theme.color.grey7};
  }
`;