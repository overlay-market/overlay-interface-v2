import styled from "styled-components";
import theme from "../../../theme";

export const CurrentUserRankingRow = styled.tr`
  position: relative;
  z-index: 10;  
  height: 48px;
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 52px;
  } 
`;

export const BgRow = styled.tr`
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: -48px;
    left: -8px; 
    height: 48px;    
    width: calc(100% + 16px);
    background: ${theme.color.grey9}; 
    z-index: 0; 
    border-radius: 32px;

    @media (min-width: ${theme.breakpoints.sm}) {
      height: 52px;
      top: -52px;
    } 
  }
`

export const StyledCell = styled.td<{textalign: string, weight?: string}>`
  padding: 6px 4px;
  font-size: 14px;
  font-weight: ${({weight}) => (weight ? weight : '500')};
  text-align: ${({textalign}) => textalign};
  box-sizing: border-box;
  vertical-align: middle;
  // display: flex;
  // align-items: center;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 4px 12px;
  }
`;