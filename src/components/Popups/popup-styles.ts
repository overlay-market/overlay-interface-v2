import styled from "styled-components";
import theme from "../../theme";
import { animated } from "react-spring";

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  right: 16px;
  bottom: 40px;
  padding: 16px;
  z-index: 69420;
  margin-top: 4px;
  border-radius: 8px;
  background: ${theme.color.grey4};
  overflow: hidden;
`;

const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: ${theme.color.blue3};
`;

export const AnimatedFader = animated(Fader);