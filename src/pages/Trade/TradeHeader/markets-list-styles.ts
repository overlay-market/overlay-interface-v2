import {
  Box,
} from "@radix-ui/themes";
import styled from "styled-components";

export const HeaderMarketName = styled(Box)`
  max-width: 160px; 
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  text-align: left;
`;
