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
  size?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  handleClick?: () => void;
};

export const GradientOutlineButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height = "52px",
  size = "16px",
  isDisabled = false,
  handleClick,
}) => {
  return (
    <GradientOutlineBtnWrapper
      width={width}
      height={height}
      disabled={isDisabled}
      onClick={handleClick}
      style={{ fontSize: size }}
    >
      <ButtonTitle disabled={isDisabled}>{title}</ButtonTitle>
    </GradientOutlineBtnWrapper>
  );
};

export const GradientSolidButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height = "52px",
  size = "16px",
  isDisabled = false,
  isLoading = false,
  handleClick,
}) => {
  return (
    <GradientSolidBtnWrapper
      width={width}
      height={height}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      style={{ fontSize: size }}
    >
      <Text style={{ color: `${theme.color.black}` }}>{title}</Text>
    </GradientSolidBtnWrapper>
  );
};

export const GradientLoaderButton: React.FC<GradientButtonProps> = ({
  title,
  width,
  height = "52px",
  size = "14px",
}) => {
  return (
    <GradientLoaderBtnWrapper
      width={width}
      height={height}
      style={{ fontSize: size }}
    >
      <ButtonTitle disabled={true}>{title}</ButtonTitle>
    </GradientLoaderBtnWrapper>
  );
};
