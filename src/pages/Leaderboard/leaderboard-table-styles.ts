import styled from "styled-components";
import theme from "../../theme";

export const Table = styled.table`
  width: calc(100% - 16px);
  border-collapse: collapse;
  margin: 0 8px;
`;

export const StyledHeader = styled.th<{textalign: string}>`
  padding: 8px 4px;
  text-align: ${({textalign}) => textalign};
  font-size: 12px;
  font-weight: 400;
  color: ${theme.color.white};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 8px 12px;
  }
`;

export const StyledRow = styled.tr`
  border-bottom: 1px solid ${theme.color.darkBlue};
`;

export const StyledCell = styled.td<{textalign: string, weight?: string}>`
  padding: 8px 4px;
  font-size: 14px;
  font-weight: ${({weight}) => (weight ? weight : '500')};
  text-align: ${({textalign}) => textalign};
  box-sizing: border-box;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px 12px;
  }
`;