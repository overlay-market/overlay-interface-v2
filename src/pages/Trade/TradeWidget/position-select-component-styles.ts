import { Box } from "@radix-ui/themes"
import styled from "styled-components"
import  theme  from "../../../theme"

export const LongPositionSelectButton = styled(Box)<{ active: string }>`
  padding: 4px 12px;
  border-radius: 8px;
  width: 100%; 
  cursor: pointer;
  color: ${theme.color.green1};
  border: ${(props) => (props.active === 'true' && `1px solid ${theme.color.green1}`)};
  
  &:hover {
    box-shadow: 0px 0px 10px 0px ${theme.color.green1} !important;
  }
`

export const ShortPositionSelectButton = styled(Box)<{ active: string }>`
  padding: 4px 12px;
  border-radius: 8px;
  width: 100%;  
  cursor: pointer; 
  color: ${ theme.color.red1};
  border: ${(props) => (props.active === 'false' && `1px solid ${theme.color.red1}`)};
 
  &:hover {
    box-shadow: 0px 0px 10px 0px ${theme.color.red1};
  }
`

export const Triangle = styled.div<{ $direction: "up" | "down" }>`
  width: 0;
  height: 0;
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  ${({ $direction }) =>
    $direction === "up"
      ? "border-bottom: 36px solid #3bd783;"
      : "border-top: 36px solid #f16060;"}
`
