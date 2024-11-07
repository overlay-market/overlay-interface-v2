import { Flex, Text } from "@radix-ui/themes";
import { useCallback, useMemo, useState } from "react";
import { SuccessUnwindStateData } from "../../../types/tradeStateTypes";
import { OpenPositionData } from "../../../types/positionTypes";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import { formatDecimalToPercentage } from "../../../utils/formatDecimal";
import theme from "../../../theme";
import UnwindAmountContainer from "./UnwindAmountContainer";
import NumericalInputContainer from "./NumericalInputContainer";
import Slider from "../../Slider";
import UnwindPositionDetails from "./UnwindPositionDetails";

type UnwindPositionProps = {
  position: OpenPositionData;
  unwindState: SuccessUnwindStateData;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
};

const UnwindPosition: React.FC<UnwindPositionProps> = ({
  position,
  unwindState,
  inputValue,
  setInputValue,
}) => {
  const [percentageValue, setPercentageValue] = useState<string>("");

  const { value, currentPrice } = useMemo(() => {
    const value = unwindState.value
      ? Number(unwindState.value).toString()
      : undefined;
    const currentPrice = unwindState.currentPrice
      ? formatPriceByCurrency(
          unwindState.currentPrice as string,
          position.priceCurrency
        )
      : undefined;

    return {
      value,
      currentPrice,
    };
  }, [unwindState]);

  const maxAmount: number = useMemo(() => Number(value) ?? 0, [value]);

  const handleQuickInput = (percentage: number) => {
    if (percentage < 0 || percentage > 100) {
      setPercentageValue("0");
      setInputValue("0");
    }
    setInputValue(((percentage / 100) * Number(maxAmount)).toString());
    setPercentageValue(percentage.toString());
  };

  const handleUserInput = useCallback(
    (input: string) => {
      const exactAmount = Number(input);

      if (exactAmount === 0) {
        setInputValue(input);
        setPercentageValue("0");
        return;
      }

      if (exactAmount > 0 && exactAmount < maxAmount) {
        const result = formatDecimalToPercentage(
          exactAmount / Number(maxAmount)
        );
        setInputValue(input);
        if (result) setPercentageValue(result.toFixed(18));
      } else {
        setInputValue(input);
        if (!isNaN(Number(input))) setPercentageValue("100");
      }
    },

    [setInputValue]
  );

  const handlePercentageInput = (input: number[]) => {
    const newPercentageValue = input[0];
    setPercentageValue(newPercentageValue.toString());
    setInputValue(((newPercentageValue / 100) * maxAmount).toString());
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

      <Flex width={"100%"} direction={"column"} pt={"20px"}>
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
      </Flex>

      <UnwindPositionDetails position={position} unwindState={unwindState} />
    </>
  );
};

export default UnwindPosition;