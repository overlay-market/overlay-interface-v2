import styled from "styled-components";
import theme from "../../../theme";

export const ScrollContentWrapper = styled.div`
  max-height: 30vh;
  margin-top: 20px;
  overflow-y: auto;

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.color.background};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.color.grey5};
    border-left: 8px solid ${theme.color.background};
    border-bottom: 2px solid ${theme.color.background};
    border-top: 2px solid ${theme.color.background};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.color.darkBlue};
  }
`;