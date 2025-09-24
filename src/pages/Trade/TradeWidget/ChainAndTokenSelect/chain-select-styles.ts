import styled from "styled-components";
import theme from "../../../../theme";
import { Box } from "@radix-ui/themes";

export const ChainSelectContainer = styled(Box)`
  width: 100%;
  padding: 8px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border-radius: 0 0 8px 8px;
  background: ${theme.color.grey4};
  border-top: 1px solid ${theme.color.darkBlue};
  z-index: 10;
`;

export const StyledScrollArea = styled(Box)`
  height: 250px;
  overflow-y: auto;
  position: relative;
  padding-right: 8px;
  margin-right: -8px;
 
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.color.grey6};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.color.darkBlue};
  }  
`;