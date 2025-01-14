import styled from "styled-components";
import theme from "../../../theme";
import { Box, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export const Table = styled.table`
  width: calc(100% - 16px);
  border-collapse: collapse;
  margin: 0 8px;
`;

export const StyledHeader = styled.th<{textalign: string}>`
  padding: 8px 4px 12px 4px;
  text-align: ${({textalign}) => textalign};
  font-size: 12px;
  font-weight: 400;
  color: ${theme.color.grey3};
  border-bottom: 1px solid ${theme.color.grey6};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 8px 12px 12px 12px;
  }
`;

export const StyledRow = styled.tr`
  border-bottom: 1px solid ${theme.color.grey6};
`;

export const StyledCell = styled.td<{textalign: string, weight?: string}>`
  padding: 18px 12px;
  font-size: 12px;
  font-weight: ${({weight}) => (weight ? weight : '400')};
  text-align: ${({textalign}) => textalign};
  box-sizing: border-box;
`;

export const CopyIconWrapper = styled(Flex)`
  position: relative;  
  color: ${theme.color.darkBlue};

  &:hover {
    color: ${theme.color.grey8};
  }
`

export const CopiedBox = styled(Box)`
  position: absolute;
  left: 24px;
  bottom: 1px;
  z-index: 100;
  color: ${theme.color.grey8};
`

export const TotalAmountCell = styled(Flex)`
  align-items: flex-start;
  gap: 8px;
  position: relative;
  color: ${theme.color.blue1};
  :hover {
    color: ${theme.color.blue2};
  }
`

export const StyledLink = styled(Link)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 4px;
`