import { Flex } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import theme from "../../theme";
import { Bar } from "./progress-bar-styles";

type ProgressBarProps = {
  value: number;
  max: number;
  width?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  width = "60px",
}) => {
  const [shortPercentage, setShortPercentage] = useState(100);
  const [longPercentage, setLongPercentage] = useState(0);
  const currentShortPercentage = max && value ? (value / max) * 100 : 100;

  const currentLongPercentage = 100 - currentShortPercentage;

  useEffect(() => {
    if (shortPercentage !== currentShortPercentage) {
      setShortPercentage(currentShortPercentage);
    }

    if (longPercentage !== currentLongPercentage) {
      setLongPercentage(currentLongPercentage);
    }
  }, [
    currentShortPercentage,
    currentLongPercentage,
    shortPercentage,
    longPercentage,
  ]);

  return (
    <Flex width={width} position={"relative"} align={"center"}>
      <Flex
        position={"absolute"}
        left={"0"}
        style={{ width: `calc(${width} - 4px)` }}
      >
        <Bar width={shortPercentage} color={theme.color.red2}></Bar>
      </Flex>
      <Flex
        justify={"end"}
        position={"absolute"}
        right={"0"}
        style={{ width: `calc(${width} - 4px)` }}
      >
        <Bar width={longPercentage} color={theme.color.green2}></Bar>
      </Flex>
    </Flex>
  );
};

export default ProgressBar;
