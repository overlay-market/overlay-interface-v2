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
  background: linear-gradient(90deg, #E5F6FF 0%, #E2CCFF 31.77%, #FFDBB0 77.08%, #FF648A 95.83%);
  position: relative;
  flex-grow: 1;
  border-radius: 8px;
  height: 5px;
`;

export const StyledThumb = styled(Thumb)`
  display: block;
  width: 18px;
  height: 18px;
  background-color: ${theme.color.red1};
  border-radius: 100px;

  &:focus {
    outline: none;
  }
`;