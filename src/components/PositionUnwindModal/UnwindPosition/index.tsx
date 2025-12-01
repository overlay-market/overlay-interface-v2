import { Flex, Text } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import {
  calculatePercentage,
  formatDecimalToPercentage,
} from "../../../utils/formatDecimal";
import theme from "../../../theme";
import UnwindAmountContainer from "./UnwindAmountContainer";
import NumericalInputContainer from "./NumericalInputContainer";
import Slider from "../../Slider";
import UnwindPositionDetails from "./UnwindPositionDetails";
import UnwindButtonComponent from "./UnwindButtonComponent";
import { OpenPositionData, UnwindStateSuccess } from "overlay-sdk";
import useDebounce from "../../../hooks/useDebounce";
import usePrevious from "../../../hooks/usePrevious";

type UnwindPositionProps = {
  position: OpenPositionData;
  unwindState: UnwindStateSuccess;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  unwindPercentage: number;
  setUnwindPercentage: (unwindPercentage: number) => void;
  handleDismiss: () => void;
};

const UnwindPosition: React.FC<UnwindPositionProps> = ({
  position,
  unwindState,
  inputValue,
  setInputValue,
  unwindPercentage,
  setUnwindPercentage,
  handleDismiss,
}) => {
  const [percentageValue, setPercentageValue] = useState<string>("");
  const [selectedPercent, setSelectedPercent] = useState<number>(0);
  const debouncedSelectedPercent = useDebounce(selectedPercent, 500);

  const hasLoan = !!position.loan?.id;

  const { value, currentPrice, fractionValue, unwindBtnState } = useMemo(() => {
    const value = unwindState.value
      ? Number(unwindState.value).toString()
      : undefined;
    const currentPrice = unwindState.currentPrice
      ? formatPriceByCurrency(
          unwindState.currentPrice as string,
          position.priceCurrency
        )
      : undefined;
    const fractionValue = unwindState.fractionValue.toString();
    const unwindBtnState = unwindState.unwindState ?? undefined;
    return {
      value,
      currentPrice,
      fractionValue,
      unwindBtnState,
    };
  }, [unwindState]);

  useEffect(() => {
    setUnwindPercentage(debouncedSelectedPercent);
  }, [debouncedSelectedPercent]);

  const previousFractionValue = usePrevious(fractionValue);

  const isPendingTime = useMemo(() => {
    if (
      Number(fractionValue) === 0 &&
      Number(previousFractionValue) === 0 &&
      Number(inputValue) === 0
    )
      return false;
    return fractionValue === previousFractionValue && !hasLoan;
  }, [fractionValue, previousFractionValue]);

  const maxAmount: number = useMemo(() => Number(value) ?? 0, [value]);

  // Force 100% unwind when position has a loan
  useEffect(() => {
    if (hasLoan && maxAmount > 0) {
      setPercentageValue("100");
      setSelectedPercent(1);
      setInputValue(maxAmount.toString());
    }
  }, [hasLoan, maxAmount, setInputValue]);

  const handleQuickInput = (percentage: number) => {
    if (percentage < 0 || percentage > 100) {
      setPercentageValue("0");
      setInputValue("0");
      setSelectedPercent(0);
    } else if (percentage === 100) {
      setPercentageValue("100");
      setInputValue(maxAmount.toString());
      setSelectedPercent(1);
    } else {
      const percentageDecimal = percentage / 100;
      setInputValue(
        calculatePercentage(maxAmount, percentageDecimal).toString()
      );
      setPercentageValue(percentage.toString());
      setSelectedPercent(percentageDecimal);
    }
  };

  const handleUserInput = useCallback(
    (input: string) => {
      const exactAmount = Number(input);

      if (exactAmount === 0) {
        setInputValue(input);
        setPercentageValue("0");
        setSelectedPercent(0);
        return;
      } else if (exactAmount > 0 && exactAmount < maxAmount) {
        const percentageDecimal = exactAmount / maxAmount;
        const percentage = formatDecimalToPercentage(percentageDecimal)!;
        setInputValue(input);
        setSelectedPercent(percentageDecimal);
        setPercentageValue(percentage.toFixed(18));
      } else if (exactAmount === maxAmount) {
        setInputValue(input);
        setPercentageValue("100");
        setSelectedPercent(1);
      } else {
        setInputValue(input);
        setPercentageValue("100");
        const percentageDecimal = exactAmount / maxAmount;
        setSelectedPercent(percentageDecimal);
      }
    },

    [setInputValue]
  );

  const handlePercentageInput = (input: number[]) => {
    const newPercentageValue = input[0];

    if (newPercentageValue === 100) {
      setPercentageValue("100");
      setSelectedPercent(1);
      setInputValue(maxAmount.toString());
    } else {
      setPercentageValue(newPercentageValue.toString());
      const percentageDecimal = newPercentageValue / 100;
      setInputValue(
        calculatePercentage(maxAmount, percentageDecimal).toString()
      );
      setSelectedPercent(percentageDecimal);
    }
  };

  return (
    <>
      <Flex width={"100%"} justify={"center"}>
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "500",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          {currentPrice}
        </Text>
      </Flex>

      {hasLoan && (
        <Flex
          width="100%"
          p="8px"
          my="8px"
          style={{
            background: 'rgba(255, 193, 7, 0.1)',
            borderRadius: '4px',
            border: `1px solid ${theme.color.yellow1}`,
          }}
        >
          <Text size="1" style={{ color: theme.color.yellow1 }}>
            This position was built with USDT and must be fully unwound (100%)
          </Text>
        </Flex>
      )}

      {!hasLoan && <UnwindAmountContainer handleQuickInput={handleQuickInput} />}

      {!hasLoan && (
        <NumericalInputContainer
          inputValue={inputValue}
          handleUserInput={handleUserInput}
        />
      )}

      <Flex width={"100%"} direction={"column"} py={"10px"} gap={"36px"}>
        {!hasLoan && (
          <Slider
            title={" "}
            min={0}
            max={100}
            step={1}
            value={
              Number(percentageValue) >= 0.01
                ? Number(Number(percentageValue).toFixed(2))
                : 0
            }
            valueUnit={"%"}
            prefixSign={
              Number(percentageValue) <= 0.01 && Boolean(percentageValue)
                ? "~"
                : ""
            }
            handleChange={(input: number[]) => handlePercentageInput(input)}
          />
        )}

        <UnwindButtonComponent
          position={position}
          inputValue={inputValue}
          unwindPercentage={unwindPercentage}
          priceLimit={unwindState.priceLimit}
          unwindBtnState={unwindBtnState}
          isPendingTime={isPendingTime}
          handleDismiss={handleDismiss}
        />
      </Flex>

      <UnwindPositionDetails position={position} unwindState={unwindState} />
    </>
  );
};

export default UnwindPosition;
