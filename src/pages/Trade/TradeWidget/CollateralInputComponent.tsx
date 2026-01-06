import { Box, Flex, Text } from "@radix-ui/themes";
import * as Slider from "@radix-ui/react-slider";
import styled from "styled-components";
import theme from "../../../theme";
import { useCallback, useEffect, useState, useRef } from "react";
import NumericalInput from "../../../components/NumericalInput";
import {
  useTradeActionHandlers,
  useTradeState,
  useCollateralType,
} from "../../../state/trade/hooks";
import { useSearchParams } from "react-router-dom";
import { useMaxInputIncludingFees } from "../../../hooks/useMaxInputIncludingFees";
import LiFiModal from "../../../components/LiFiModal";

const SliderRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 20px;
  cursor: pointer;

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SliderTrack = styled(Slider.Track)`
  background-color: ${theme.color.grey5};
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 2px;
`;

const SliderRange = styled(Slider.Range)`
  position: absolute;
  background-color: ${theme.color.green2};
  border-radius: 9999px;
  height: 100%;
`;

const SliderThumb = styled(Slider.Thumb)`
  display: block;
  width: 8px;
  height: 8px;
  background-color: ${theme.color.green2};
  border-radius: 10px;
  transition: transform 0.1s ease;
  
  &:hover {
    transform: scale(1.2);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.color.green2}44;
  }
`;

const Mark = styled.div<{ active: boolean }>`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${props => props.active ? theme.color.green2 : theme.color.grey5};
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
`;

const CollateralInputComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { typedValue } = useTradeState();
  const collateralType = useCollateralType();
  const { handleAmountInput } = useTradeActionHandlers();
  const { maxInputIncludingFees, isLoading, error } = useMaxInputIncludingFees({
    marketId,
  });

  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const isUpdatingFromSlider = useRef(false);
  const sliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);
  const [showLiFiModal, setShowLiFiModal] = useState<boolean>(false);

  const handleUserInput = useCallback(
    (input: string) => {
      const inputValue = Number(input);
      if (inputValue !== maxInputIncludingFees) {
        setIsMaxSelected(false);
      }
      handleAmountInput(input);
    },
    [handleAmountInput, maxInputIncludingFees]
  );

  const handleMaxInput = useCallback(() => {
    if (maxInputIncludingFees > 0) {
      setIsMaxSelected(true);
      handleUserInput(maxInputIncludingFees.toString());
    }
  }, [maxInputIncludingFees, handleUserInput]);

  // Update amount input when max selected and leverage is changed (thus maxInputIncludingFees changes)
  useEffect(() => {
    if (isMaxSelected && maxInputIncludingFees) {
      handleUserInput(maxInputIncludingFees.toString());
    }
  }, [isMaxSelected, maxInputIncludingFees, handleUserInput]);

  // Sync slider with typed value
  useEffect(() => {
    if (isUpdatingFromSlider.current) return;

    if (maxInputIncludingFees > 0 && typedValue) {
      const val = parseFloat(typedValue);
      if (!isNaN(val)) {
        const percent = (val / maxInputIncludingFees) * 100;
        setSliderValue([Math.min(100, Math.max(0, percent))]);
      } else {
        setSliderValue([0]);
      }
    } else {
      setSliderValue([0]);
    }
  }, [typedValue, maxInputIncludingFees]);

  const onSliderValueChange = (newValues: number[]) => {
    isUpdatingFromSlider.current = true;
    const value = newValues[0];
    setSliderValue(newValues);
    if (maxInputIncludingFees > 0) {
      const amount = (value / 100) * maxInputIncludingFees;
      handleUserInput(amount.toFixed(6).replace(/\.?0+$/, ''));
    }

    if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
    sliderTimeoutRef.current = setTimeout(() => {
      isUpdatingFromSlider.current = false;
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
    };
  }, []);

  return (
    <Box
      width={"100%"}
      p={"8px"}
      style={{ borderRadius: "8px", background: theme.color.grey4 }}
    >
      <Flex direction={"column"} gap="2px">
        <Flex justify="between" align="center" gap="12px">
          <Text size="1" style={{ color: theme.color.grey3, whiteSpace: 'nowrap' }}>
            Amount
          </Text>
          <Text
            size="1"
            onClick={maxInputIncludingFees > 0 ? handleMaxInput : undefined}
            style={{
              textDecoration: "underline",
              cursor: maxInputIncludingFees > 0 ? "pointer" : "not-allowed",
              color: isMaxSelected ? theme.color.white : theme.color.grey3,
              opacity: isLoading ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            {isLoading ? "Loading..." : `Max: ${maxInputIncludingFees.toFixed(6).replace(/\.?0+$/, '')} ${collateralType}`}
          </Text>
          {error && (
            <Text size="1" style={{ color: theme.color.red1 }}>
              Error loading max amount
            </Text>
          )}
        </Flex>

        <Flex style={{ flex: 1, position: 'relative', padding: '0 4px' }}>
          <SliderRoot
            value={sliderValue}
            onValueChange={onSliderValueChange}
            max={100}
            step={1}
            disabled={maxInputIncludingFees <= 0 || isLoading}
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            {[0, 25, 50, 75, 100].map((mark) => (
              <Mark
                key={mark}
                style={{ left: `${mark}%` }}
                active={sliderValue[0] >= mark}
              />
            ))}
            <SliderThumb />
          </SliderRoot>
        </Flex>

        <Flex justify="between" align="center">
          <NumericalInput
            value={typedValue}
            handleUserInput={handleUserInput}
          />
          <Flex align="center" gap="8px">
            <Text size="3" weight={"bold"} style={{ color: theme.color.blue1 }}>
              {collateralType}
            </Text>
            {collateralType === "USDT" && (
              <Flex
                align="center"
                gap="4px"
                style={{
                  cursor: "pointer",
                  color: theme.color.blue3,
                  background: 'rgba(18, 180, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${theme.color.blue3}`
                }}
                onClick={() => setShowLiFiModal(true)}
              >
                <Text size="1" weight="bold">GET</Text>
                <img
                  src="https://zengo.com/wp-content/uploads/USDT-BEP20-1.png"
                  alt="USDT"
                  style={{ width: '16px', height: '16px' }}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
      <LiFiModal open={showLiFiModal} handleClose={() => setShowLiFiModal(false)} />
    </Box>
  );
};

export default CollateralInputComponent;
