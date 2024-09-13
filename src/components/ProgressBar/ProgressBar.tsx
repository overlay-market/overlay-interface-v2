import { Box, Flex } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme";

const Bar = styled(Box)<{ width?: number; color: string }>`
  position: relative;
  height: 4px;
  transition: 1s ease-out;
  transition-property: width, background-color;
  width: ${({ width }) => `${width}%`};
  background-color: ${({ color }) => color};
  animation: progressAnimation 1s;
`;

type ProgressBarProps = {
  value: number | undefined | null;
  max: number | undefined | null;
  width?: string;
};

export const ProgressBar = ({
  value,
  max,
  width = "60px",
}: ProgressBarProps) => {
  const [shortPercentage, setShortPercentage] = useState(100);
  const [longPercentage, setLongPercentage] = useState(0);
  const currentShortPercentage =
    max && value !== undefined && value !== null ? (value / max) * 100 : 100;

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
