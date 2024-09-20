import { Box } from "@radix-ui/themes"
import styled from "styled-components"
import { theme } from "../../../theme/theme"

export const SelectLongPositionButton = styled(Box)<{ active: boolean }>`
  padding: 12px;
  border-radius: 8px;
  width: 100%; 
  cursor: pointer;
  color: ${theme.color.green1};
  border: ${(props) => (props.active && `1px solid ${theme.color.green1}`)};
  
  &:hover {
    box-shadow: 0px 0px 10px 0px ${theme.color.green1} !important;
  }
`

export const SelectShortPositionButton = styled(Box)<{ active: boolean }>`
  padding: 12px;
  border-radius: 8px;
  width: 100%;  
  cursor: pointer; 
  color: ${ theme.color.red1};
  border: ${(props) => (props.active && `1px solid ${theme.color.red1}`)};
 
  &:hover {
    box-shadow: 0px 0px 10px 0px ${theme.color.red1};
  }
`

export const InputContainer = styled(Box)`
  background: ${theme.color.grey7};
  border-radius: 8px;
  padding: 8px;
  width: 100%;
` 