import { Box } from "@radix-ui/themes"
import styled from "styled-components"
import theme from "../../../theme"

export const CollateralTypeButton = styled(Box)<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  flex: 1;
  cursor: pointer;
  color: ${theme.color.grey1};
  background: ${(props) => (props.$active ? theme.color.grey3 : 'transparent')};
  border: ${(props) => (props.$active ? `1px solid ${theme.color.blue1}` : '1px solid transparent')};
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.color.grey3};
  }
`

export const ToggleContainer = styled(Box)`
  display: flex;
  gap: 8px;
  padding: 4px;
  background: ${theme.color.grey4};
  border-radius: 8px;
  margin-bottom: 8px;
`
