import styled from "styled-components";
import theme from "../../../theme";

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const StyledHeader = styled.th<{textalign: string}>`
  padding: 8px 4px 0px 4px;
  text-align: ${({textalign}) => textalign};
  font-size: 12px;
  font-weight: 400;
  color: ${theme.color.white};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 8px 12px 0px 12px;
  }
`;

export const StyledRow = styled.tr`
  height: 83px; 
  border-bottom: 1px solid ${theme.color.darkBlue};
  cursor: pointer;
`;

export const StyledCell = styled.td<{textalign: string, weight?: string}>`
  padding: 8px 4px;
  font-size: 14px;
  text-align: ${({textalign}) => textalign};
  box-sizing: border-box;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 12px 10px;
  }
`;