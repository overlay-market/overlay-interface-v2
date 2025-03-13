import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../../theme";

export const TransactContainer = styled(Flex)`
  flex-direction: column;
  flex: 1;
  gap: 16px;
  width: 100%;
  height: fit-content;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    gap: 12px;
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 24px 20px;
    gap: 24px;
    background: #1D1D28;
    border-radius: 8px;
  }
`

export const StakeSelectButton = styled(Box)<{ active: string }>`
  padding: 10px 12px;
  border-radius: 8px;
  width: 100%; 
  cursor: pointer;
  color: ${theme.color.green1};
  background: ${theme.color.grey4};
  border: ${(props) => (props.active === 'true' && `1px solid ${theme.color.green1}`)};
  
  &:hover {
    box-shadow: 0px 0px 10px 0px ${theme.color.green1} !important;
  }
`

export const WithdrawSelectButton = styled(Box)<{ active: string }>`
  padding: 10px 12px;
  border-radius: 8px;
  width: 100%;  
  cursor: pointer; 
  color: ${ theme.color.red1};
  background: ${theme.color.grey4};
  border: ${(props) => (props.active === 'false' && `1px solid ${theme.color.red1}`)};
 
  &:hover {
    box-shadow: 0px 0px 10px 0px ${theme.color.red1};
  }
`