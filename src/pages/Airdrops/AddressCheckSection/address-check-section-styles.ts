import styled from "styled-components";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";

export const GradientBorderBox = styled(Flex)`
  flex-direction: column;
  width: 100%;
  gap: 8px;
  margin-top: 48px;
  margin-bottom: 28px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 32px;
    border: solid 1px transparent; 
    border-radius: 16px;
    background: linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
        linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;
  }
  
  @media (min-width: 995px) {
    width: 847px;
  }
`;

export const InputAddressesBoxContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
`

export const InputAddressesBox = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  height: 102px;
  resize: none;
  border: none;
  border-radius: 8px;
  padding: 16px;
  color: ${theme.color.white};
  background-color: ${theme.color.grey4};
  font-size: 14px;
  line-height: 20px;
  font-family: Inter;
  &::placeholder {
    font-size: 14px;
    font-weight: 600;
    color: #6C7180;
    line-height: 20px;
    font-family: Inter;
  }
  &:focus-visible {
    outline: none;
  }

  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`

export const ClearAllBtnWrapper = styled(Flex)`
  justify-content: space-between;
  padding-top: 4px;
  position: relative;
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding-bottom: 0px;
    margin-left: 0;
  }
`

export const ClearAllButton = styled(Flex)`
  position: absolute;
  right: 0;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  height: 33px;
  box-sizing: border-box;
  padding: 0px 0 4px 0;
  width: fit-content;
  margin-left: auto;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    position: relative;
    bottom: 40px;
    right: 16px;
    margin-bottom: -33px;
    margin-left: auto;
  }
`

export const CloseIcon = styled.span`
  position: relative;
  bottom: 2px;
  font-size: 26px;
  font-weight: 100;
  color: ${theme.color.blue2};
`