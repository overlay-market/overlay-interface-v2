import { Flex, Text } from "@radix-ui/themes";
import { useCallback, useMemo, useState } from "react";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import { formatDecimalToPercentage } from "../../../utils/formatDecimal";
import theme from "../../../theme";
import UnwindAmountContainer from "./UnwindAmountContainer";
import NumericalInputContainer from "./NumericalInputContainer";
import Slider from "../../Slider";
import UnwindPositionDetails from "./UnwindPositionDetails";
import UnwindButtonComponent from "./UnwindButtonComponent";
import { OpenPositionData, UnwindStateSuccess } from "overlay-sdk";
import { formatUnits } from "viem";

type UnwindPositionProps = {
  position: OpenPositionData;
  unwindState: UnwindStateSuccess;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  unwindValue: bigint;
  setUnwindValue: (unwindValue: bigint) => void;
  handleDismiss: () => void;
};

const UnwindPosition: React.FC<UnwindPositionProps> = ({
  position,
  unwindState,
  inputValue,
  setInputValue,
  unwindValue,
  setUnwindValue,
  handleDismiss,
}) => {
  const [percentageValue, setPercentageValue] = useState<string>("");

  const { value, currentPrice, unwindBtnState } = useMemo(() => {
    const value = unwindState.value
      ? Number(unwindState.value).toString()
      : undefined;
    const currentPrice = unwindState.currentPrice
      ? formatPriceByCurrency(
          unwindState.currentPrice as string,
          position.priceCurrency
        )
      : undefined;
    const unwindBtnState = unwindState.unwindState ?? undefined;
    return {
      value,
      currentPrice,
      unwindBtnState,
    };
  }, [unwindState]);

  const maxAmountNumber: number = useMemo(() => Number(value) ?? 0, [value]);
  const maxAmount: bigint = useMemo(
    () => unwindState.rawValue ?? 0n,
    [unwindState]
  );

  const handleQuickInput = (percentage: number) => {
    if (percentage < 0 || percentage > 100) {
      setPercentageValue("0");
      setInputValue("0");
      setUnwindValue(0n);
    } else if (percentage === 100) {
      setPercentageValue("100");
      setInputValue(formatBigNumber(maxAmount).toString());
      setUnwindValue(unwindState.rawOi);
    } else {
      const percentageDecimal = percentage / 100;
      setInputValue(
        calculatePercentage(
          maxAmount,
          percentageDecimal
        ).resultParsed.toString()
      );
      setPercentageValue(percentage.toString());
      setUnwindValue(
        calculatePercentage(unwindState.rawOi, percentageDecimal).result
      );
    }
  };

  const handleUserInput = useCallback(
    (input: string) => {
      const exactAmount = Number(input);

      if (exactAmount === 0) {
        setInputValue(input);
        setPercentageValue("0");
        setUnwindValue(0n);
        return;
      } else if (exactAmount > 0 && exactAmount < maxAmountNumber) {
        const percentage = formatDecimalToPercentage(
          exactAmount / maxAmountNumber
        );
        const percentageDecimal = exactAmount / maxAmountNumber;
        setInputValue(input);
        setUnwindValue(
          calculatePercentage(unwindState.rawOi, percentageDecimal).result
        );
        if (percentage) setPercentageValue(percentage.toFixed(18));
      } else if (exactAmount === maxAmountNumber) {
        setInputValue(input);
        setPercentageValue("100");
        setUnwindValue(unwindState.rawOi);
      } else {
        setInputValue(input);
        setPercentageValue("100");
        const percentageDecimal = exactAmount / maxAmountNumber;
        setUnwindValue(
          calculatePercentage(unwindState.rawOi, percentageDecimal).result
        );
      }
    },

    [setInputValue]
  );

  function calculatePercentage(
    value: bigint,
    percentage: number
  ): {
    resultParsed: string | number;
    result: bigint;
  } {
    const percentageBigInt = BigInt(Math.round(percentage * 100)); // Convert percentage to an integer representation
    const result = (value * percentageBigInt) / 100n; // Multiply and divide by 10000 to account for the percentage conversion
    const resultParsed = formatBigNumber(result);
    return {
      result,
      resultParsed,
    };
  }

  function formatBigNumber(
    bignumber: bigint,
    decimals: number = 18,
    digits: number = 4,
    returnNumberType: boolean = false
  ) {
    const formatted = formatUnits(bignumber, decimals);
    const formatWithDigits = Number.parseFloat(formatted).toFixed(digits);
    return returnNumberType ? Number(formatWithDigits) : formatWithDigits;
  }

  const handlePercentageInput = (input: number[]) => {
    const newPercentageValue = input[0];
    if (newPercentageValue === 100) {
      setPercentageValue("100");
      setUnwindValue(unwindState.rawOi);
      setInputValue(maxAmountNumber.toString());
    } else {
      setPercentageValue(newPercentageValue.toString());
      const percentageDecimal = newPercentageValue / 100;
      setInputValue(
        calculatePercentage(
          maxAmount,
          percentageDecimal
        ).resultParsed.toString()
      );
      setUnwindValue(
        calculatePercentage(unwindState.rawOi, percentageDecimal).result
      );
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

      <UnwindAmountContainer handleQuickInput={handleQuickInput} />

      <NumericalInputContainer
        inputValue={inputValue}
        handleUserInput={handleUserInput}
      />

      <Flex width={"100%"} direction={"column"} py={"10px"} gap={"36px"}>
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

        <UnwindButtonComponent
          position={position}
          inputValue={inputValue}
          unwindValue={unwindValue}
          priceLimit={unwindState.priceLimit}
          unwindBtnState={unwindBtnState}
          handleDismiss={handleDismiss}
        />
      </Flex>

      <UnwindPositionDetails position={position} unwindState={unwindState} />
    </>
  );
};

export default UnwindPosition;
