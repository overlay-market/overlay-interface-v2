import { DropdownMenu, Text } from "@radix-ui/themes";
import styled, { css } from "styled-components";
import theme from "../../../theme";

export const TextValue = styled(Text)`
  color: ${theme.color.grey3};
`

export const TextLabel = styled(Text)`
  color: ${theme.color.blue1};
  display: inline-block;
  max-width: 120px; 
  white-space: normal; 
  word-break: break-word; 
  line-height: 1.3;
  text-align: right; 
`

export const DropdownButton = styled.button`
  background: none;
  border: none;
  outline: none;
  padding: 0;
  font-size: 12px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  color: ${theme.color.grey8};
  cursor: pointer;
  text-align: right;
  white-space: nowrap;
`;

export const DropdownContent = styled(DropdownMenu.Content)`
  background: ${theme.color.background};
  margin-top: 8px;
  padding: 10px;
  box-shadow: rgb(0 0 0) 0px 0px 12px 2px;
  border: 1px solid ${theme.color.grey9};
`;

export const DropdownItem = styled(DropdownMenu.Item)<{ overflowHidden?: boolean }>`
  background: transparent;
  ${({ overflowHidden }) =>
    overflowHidden &&
    css`
      overflow: hidden;
    `}
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 20px;
`;