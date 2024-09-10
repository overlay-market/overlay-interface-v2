import { Button, Text } from "@radix-ui/themes";
import { theme } from "../../theme/theme";
import styled from "styled-components";

const GradientOutlineBtnWrapper = styled(Button)<{
  width?: string;
  height?: string;
}>`
  padding: 7px 16px;
  width: ${({ width }) => (width ? width : "auto")};
  height: ${({ height }) => (height ? height : "auto")};
  border: 1px solid transparent;
  background: linear-gradient(#2c2c2c, #2c2c2c) padding-box,
    linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;

  &:hover {
    box-shadow: 0px 0px 12px 3px #ffffff73;
    font-weight: 800;
  }
`;

const ButtonTitle = styled.div<{ color?: string }>`
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

const GradientSolidBtnWrapper = styled(Button)<{
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
    font-weight: 800;
  }
`;

type GradientButtonProps = {
  title: string;
  width?: string;
  height?: string;
  onClick: () => void;
};

export const GradientOutlineButton = ({
  title,
  width,
  height,
  onClick,
}: GradientButtonProps) => {
  return (
    <GradientOutlineBtnWrapper
      width={width}
      height={height}
      onClick={onClick}
      style={{ fontSize: "12px" }}
    >
      <ButtonTitle>{title}</ButtonTitle>
    </GradientOutlineBtnWrapper>
  );
};

export const GradientSolidButton = ({
  title,
  width,
  height,
  onClick,
}: GradientButtonProps) => {
  return (
    <GradientSolidBtnWrapper width={width} height={height} onClick={onClick}>
      <Text style={{ color: `${theme.black}` }}>{title}</Text>
    </GradientSolidBtnWrapper>
  );
};
