import {
  Box,
  Flex,  
} from "@radix-ui/themes";
import  theme  from "../../../theme";
import styled from "styled-components";

export const MarketInfo = styled(Flex)`
  border-bottom: 1px solid ${theme.color.darkBlue};
  cursor: pointer;

  &:hover {
    background: ${theme.color.grey7};
  }
`;

export const MarketName = styled(Box)`
  max-width: calc(100% - 90px); 
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  text-align: left;
`;

export const MarketPrice = styled(Box)`
  width: 90px; 
  text-align: right;
  flex-shrink: 0;
`;