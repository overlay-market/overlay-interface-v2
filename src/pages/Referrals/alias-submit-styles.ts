import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const CopyLink = styled(Box)`
  cursor: pointer;
  position: relative;

  &::after {
    content: 'Copy Link';
    position: absolute;
    top: 50%;
    left: 100%; 
    transform: translate(8px, -50%); 
    color: #888;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden; 
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  }

  &:hover::after {
    opacity: 1; 
    visibility: visible;
`;

export const Toast = styled.div<{visible: string}>`
  position: fixed;
  bottom: 110px;
  width: 160px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.color.grey7};
  color: ${theme.color.grey2};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${({ visible }) => (visible === 'true' ? 1 : 0)};
  visibility: ${({ visible }) => (visible === 'true' ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;

  @media (min-width: ${theme.breakpoints.sm}) {
    bottom: 20px;
    left: 52.5%;
  } 
`;