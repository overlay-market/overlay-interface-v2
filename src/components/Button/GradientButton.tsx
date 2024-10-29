import { Text } from "@radix-ui/themes";
import theme from "../../theme";
import {
  ButtonTitle,
  GradientLoaderBtnWrapper,
  GradientOutlineBtnWrapper,
  GradientSolidBtnWrapper,
} from "./gradient-button-styles";

type GradientButtonProps = {
  title: string;
  width?: string;
  height?: string;
  isDisabled?: boolean;
  handleClick?: () => void;
};

export const GradientOutlineButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height,
  isDisabled = false,
  handleClick,
}) => {
  return (
    <GradientOutlineBtnWrapper
      width={width}
      height={height}
      disabled={isDisabled}
      onClick={handleClick}
      style={{ fontSize: "12px" }}
    >
      <ButtonTitle disabled={isDisabled}>{title}</ButtonTitle>
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

export const GradientLoaderButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height,
}) => {
  return (
    <GradientLoaderBtnWrapper
      width={width}
      height={height}
      style={{ fontSize: "12px" }}
    >
      <ButtonTitle disabled={true}>{title}</ButtonTitle>
    </GradientLoaderBtnWrapper>
  );
};
