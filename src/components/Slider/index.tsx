import { Range } from "@radix-ui/react-slider";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import React from "react";
import { StyledRoot, StyledThumb, StyledTrack } from "./slider-styles";

type SliderProps = {
  title?: string;
  value: number;
  valueUnit: string;
  prefixSign?: string;
  handleChange: (newValue: number[]) => void;
  min: number;
  max: number;
  step: number;
  margin?: string;
};

const Slider: React.FC<SliderProps> = ({
  title,
  value,
  valueUnit,
  prefixSign,
  handleChange,
  min,
  max,
  step,
}) => {
  return (
    <Flex direction={"column"} gap={"4px"}>
      <Flex justify={"between"} height={"19px"}>
        {title && (
          <Text size={"3"} style={{ color: theme.color.blue1 }}>
            {title}
          </Text>
        )}

        <Text size={"3"} style={{ color: theme.color.blue1 }}>
          {prefixSign ?? null}
          {value}
          {valueUnit}
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

export default Slider;
