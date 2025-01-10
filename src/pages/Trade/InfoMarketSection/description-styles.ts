import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const DescriptionContainer = styled(Box)`
  flex: 1;
  width: 100%;
  border-radius: 8px;
  background: transparent;

  @media (min-width: ${theme.breakpoints.sm}) {  
    background: ${theme.color.grey4};
  }
`

export const MarketImg = styled.img`  
  height: auto;
  border-radius: 8px; 
  
  @media (min-width: ${theme.breakpoints.sm}) { 
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
` 
export const TruncatedText = styled(Box)<{istruncated: string}>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.istruncated === 'true' ? '7' : 'unset')};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height:  ${(props) => (props.istruncated === 'true' ? 'calc(2em * 7)' : 'none')};
`