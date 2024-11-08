import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const DescriptionContainer = styled(Box)`
  width: 375px;
  border-radius: 8px;
  background: ${theme.color.grey4};
`

export const MarketImg = styled.img`
  
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
` 
export const TruncatedText = styled(Box)<{isTruncated: boolean}>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.isTruncated ? '7' : 'unset')};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height:  ${(props) => (props.isTruncated ? 'calc(2em * 7)' : 'none')};
`