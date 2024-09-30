import { Text } from "@radix-ui/themes";
import theme from "../../theme";
import {
  ButtonTitle,
  GradientOutlineBtnWrapper,
  GradientSolidBtnWrapper,
} from "./gradient-button-styles";

type GradientButtonProps = {
  title: string;
  width?: string;
  height?: string;
  handleClick: () => void;
};

export const GradientOutlineButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height,
  handleClick,
}) => {
  return (
    <GradientOutlineBtnWrapper
      width={width}
      height={height}
      onClick={handleClick}
      style={{ fontSize: "12px" }}
    >
      <ButtonTitle>{title}</ButtonTitle>
    </GradientOutlineBtnWrapper>
  );
};

export const GradientSolidButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height,
  handleClick,
}) => {
  return (
    <GradientSolidBtnWrapper
      width={width}
      height={height}
      onClick={handleClick}
    >
      <Text style={{ color: `${theme.color.black}` }}>{title}</Text>
    </GradientSolidBtnWrapper>
  );
};
