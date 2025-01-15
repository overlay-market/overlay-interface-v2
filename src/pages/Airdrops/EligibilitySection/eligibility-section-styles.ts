import styled from "styled-components";
import theme from "../../../theme";
import { Box, Flex, Text } from "@radix-ui/themes";
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
  color: ${theme.color.white};
 
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 8px 12px 12px 12px;
  }
`;

export const StyledRow = styled.tr`
  border-bottom: 1px solid ${theme.color.darkBlue};
`;

export const StyledCell = styled.td<{textalign: string, weight?: string}>`
  padding: 14px 12px;
  font-size: 14px;
  font-weight: ${({weight}) => (weight ? weight : '500')};
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
  bottom: -2px;
  z-index: 100;
`

export const TotalAmountCell = styled(Flex)`
  align-items: flex-start;
  gap: 8px;
  position: relative;
`

export const StyledLink = styled(Link)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 4px;
`

export const GradientText = styled(Text)`
  width: fit-content;
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;