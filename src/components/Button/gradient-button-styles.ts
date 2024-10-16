import { Button } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const GradientOutlineBtnWrapper = styled(Button)<{
  width?: string;
  height?: string;
}>`
  padding: 7px 16px;
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
  border: 1px solid transparent;
  background: linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
    linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;

  &:hover {
    box-shadow: 0px 0px 12px 3px #ffffff73;
  }
`;

export const ButtonTitle = styled.div<{ color?: string }>`
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

export const GradientSolidBtnWrapper = styled(Button)<{
  width?: string;
  height?: string;
}>`
  padding: 7px 16px;
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  font-weight: 600;
  
  &:hover {
    box-shadow: 0px 0px 12px 3px #ffffff73;
  }
`;