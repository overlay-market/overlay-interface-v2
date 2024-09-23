import { Range } from "@radix-ui/react-slider";
import { StyledRoot, StyledThumb, StyledTrack } from "./LeverageSlider_";
import { Flex, Text } from "@radix-ui/themes";
import { theme } from "../../theme/theme";

type LeverageSliderProps = {
  value: number;
  onChange: (newValue: number[]) => void;
  min: number;
  max: number;
  step: number;
  margin?: string;
};

export const LeverageSlider = ({
  value,
  onChange,
  min,
  max,
  step,
}: LeverageSliderProps) => {
  return (
    <Flex direction={"column"} gap={"4px"}>
      <Flex justify={"between"}>
        <Text size={"3"} style={{ color: theme.color.blue1 }}>
          Leverage
        </Text>
        <Text size={"3"} style={{ color: theme.color.blue1 }}>
          {value}x
        </Text>
      </Flex>
      <StyledRoot
        value={[value]}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
      >
        <StyledTrack>
          <Range />
        </StyledTrack>
        <StyledThumb />
      </StyledRoot>
    </Flex>
  );
};
