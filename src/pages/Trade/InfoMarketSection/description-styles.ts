import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const DescriptionContainer = styled(Box)`
  flex: 1;
  width: 100%;
  border-radius: ${theme.radius.md};
  background: transparent;

  @media (min-width: ${theme.breakpoints.sm}) {  
    background: ${theme.semantic.panel};
    border: 1px solid ${theme.semantic.border};
  }
`

export const MarketImg = styled.img`  
  height: auto;
  border-radius: ${theme.radius.md}; 
  
  @media (min-width: ${theme.breakpoints.sm}) { 
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: ${theme.radius.md};
    border-top-right-radius: ${theme.radius.md};
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
