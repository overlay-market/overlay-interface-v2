import styled from "styled-components"
import  theme  from "../../../theme"

export const LongPositionSelectButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: ${theme.radius.sm};
  width: 100%; 
  cursor: pointer;
  color: ${theme.semantic.positive};
  border: 1px solid ${(props) => (props.$active ? theme.semantic.positive : theme.semantic.borderMuted)};
  background: ${(props) => (props.$active ? "#083d2f" : theme.semantic.panelRaised)};
  transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
  
  &:hover {
    border-color: ${theme.semantic.positive};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`

export const ShortPositionSelectButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: ${theme.radius.sm};
  width: 100%;  
  cursor: pointer; 
  color: ${ theme.semantic.negative};
  border: 1px solid ${(props) => (!props.$active ? theme.semantic.negative : theme.semantic.borderMuted)};
  background: ${(props) => (!props.$active ? theme.semantic.negativeSoft : theme.semantic.panelRaised)};
  transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
 
  &:hover {
    border-color: ${theme.semantic.negative};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
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
