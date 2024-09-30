import { Range } from "@radix-ui/react-slider";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import React from "react";
import { StyledRoot, StyledThumb, StyledTrack } from "./leverage-slider-styles";

type LeverageSliderProps = {
  value: number;
  handleChange: (newValue: number[]) => void;
  min: number;
  max: number;
  step: number;
  margin?: string;
};

const LeverageSlider: React.FC<LeverageSliderProps> = ({
  value,
  handleChange,
  min,
  max,
  step,
}) => {
  return (
    <Flex direction={"column"} gap={"4px"}>
      <Flex justify={"between"} height={"19px"}>
        <Text size={"3"} style={{ color: theme.color.blue1 }}>
          Leverage
        </Text>
        <Text size={"3"} style={{ color: theme.color.blue1 }}>
          {value}x
        </Text>
      </Flex>
      <StyledRoot
        value={[value]}
        onValueChange={handleChange}
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

export default LeverageSlider;
