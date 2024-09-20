import { Flex, Text } from "@radix-ui/themes";
import { theme } from "../../../theme/theme";
import {
  InputContainer,
  SelectLongPositionButton,
  SelectShortPositionButton,
} from "./TradeWidget_";
import { LeverageSlider } from "../../../components/LeverageSlider/LeverageSlider";
import { useCallback, useEffect, useState } from "react";
import { NumericalInput } from "../../../components/NumericalInput/NumericalInput";
import { MainTradeDetails } from "./MainTradeDetails";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";

const TradeWidget = () => {
  const { selectedLeverage, isLong, typedValue, slippageValue } =
    useTradeState();
  const {
    onAmountInput,
    onSelectLeverage,
    onSelectPositionSide,
    onResetTradeState,
  } = useTradeActionHandlers();

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);
  const maxInputIncludingFees = "0";
  const capLeverage = 5;

  const handleUserInput = useCallback(
    (input: string) => {
      if (input !== maxInputIncludingFees) {
        setIsMaxSelected(false);
      }
      onAmountInput(input);
    },
    [onAmountInput, setIsMaxSelected, maxInputIncludingFees]
  );

  // Update amount input when max selected and leverage is changed (thus maxInputIncludingFees changes)
  useEffect(() => {
    if (isMaxSelected && maxInputIncludingFees) {
      handleUserInput(maxInputIncludingFees);
    }
  }, [isMaxSelected, maxInputIncludingFees, handleUserInput]);

  const handleLeverageInput = (newValue: number[]) => {
    onSelectLeverage(newValue[0].toString());
  };

  const handleMaxInput = () => {
    setIsMaxSelected(true);
    return handleUserInput(Number(maxInputIncludingFees).toFixed(6));
  };

  return (
    <Flex
      direction={"column"}
      gap={"24px"}
      width={"321px"}
      px={"8px"}
      pt={"8px"}
      pb={"20px"}
    >
      <Flex height={"64px"} gap={"8px"}>
        <SelectLongPositionButton
          active={"1" === "1"}
          onClick={() => console.log("Long")}
          style={{ background: theme.color.grey4 }}
        >
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Text size={"3"} weight={"bold"}>
              Buy
            </Text>
            <Text size={"1"} style={{ color: theme.color.blue1 }}>
              1.77673 B
            </Text>
          </Flex>
        </SelectLongPositionButton>
        <SelectShortPositionButton
          active={1 !== 1}
          onClick={() => console.log("Short")}
          style={{ background: theme.color.grey4 }}
        >
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Text size={"3"} weight={"bold"}>
              Sell
            </Text>
            <Text size={"1"} style={{ color: theme.color.blue1 }}>
              1.77673 B
            </Text>
          </Flex>
        </SelectShortPositionButton>
      </Flex>

      <LeverageSlider
        min={1}
        max={capLeverage ?? 1}
        step={0.1}
        value={Number(selectedLeverage)}
        onChange={(newValue: number[]) => handleLeverageInput(newValue)}
      />

      <InputContainer>
        <Flex direction={"column"} gap="22px">
          <Flex justify="between">
            <Text style={{ color: theme.color.grey3 }}>Amount</Text>
            <Text
              onClick={handleMaxInput}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: isMaxSelected ? theme.color.white : theme.color.grey3,
              }}
            >
              Max: {maxInputIncludingFees} OVL
            </Text>
          </Flex>
          <Flex justify="between">
            <NumericalInput
              value={typedValue?.toString()}
              onUserInput={handleUserInput}
            />
            <Text weight={"bold"} style={{ color: theme.color.blue1 }}>
              OVL
            </Text>
          </Flex>
        </Flex>
      </InputContainer>

      <MainTradeDetails />
    </Flex>
  );
};

export default TradeWidget;
