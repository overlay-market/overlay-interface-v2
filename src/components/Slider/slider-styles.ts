import { Root, Thumb, Track } from "@radix-ui/react-slider";
import styled from "styled-components";
import  theme from "../../theme";

export const StyledRoot = styled(Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 18px;
`;

export const StyledTrack = styled(Track)`
  background: linear-gradient(90deg, ${theme.semantic.positive} 0%, ${theme.semantic.accent} 58%, ${theme.semantic.negative} 100%);
  position: relative;
  flex-grow: 1;
  border-radius: 8px;
  height: 4px;
`;

export const StyledThumb = styled(Thumb)`
  display: block;
  width: 18px;
  height: 18px;
  background-color: ${theme.semantic.accent};
  border: 2px solid ${theme.semantic.bg};
  border-radius: 100px;

  &:focus {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;
