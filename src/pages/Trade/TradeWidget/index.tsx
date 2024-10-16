import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import {
  InputContainer,
  SelectLongPositionButton,
  SelectShortPositionButton,
} from "./trade-widget-styles";
import { useCallback, useEffect, useState } from "react";
import NumericalInput from "../../../components/NumericalInput";
import MainTradeDetails from "./MainTradeDetails";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import AdditionalTradeDetails from "./AdditionalTradeDetails";
import TradeButtonComponent from "./TradeButtonComponent";
import LeverageSlider from "../../../components/LeverageSlider";

const TradeWidget: React.FC = () => {
  const { selectedLeverage, isLong, typedValue } = useTradeState();
  const { handleAmountInput, handleLeverageSelect, handlePositionSideSelect } =
    useTradeActionHandlers();

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);
  const maxInputIncludingFees = "0";
  const capLeverage = 5;

  const handleSelectPositionSide = useCallback(
    (isLong: boolean) => {
      handlePositionSideSelect(isLong);
    },
    [handlePositionSideSelect]
  );

  const handleUserInput = useCallback(
    (input: string) => {
      if (input !== maxInputIncludingFees) {
        setIsMaxSelected(false);
      }
      handleAmountInput(input);
    },
    [handleAmountInput, setIsMaxSelected, maxInputIncludingFees]
  );

  // Update amount input when max selected and leverage is changed (thus maxInputIncludingFees changes)
  useEffect(() => {
    if (isMaxSelected && maxInputIncludingFees) {
      handleUserInput(maxInputIncludingFees);
    }
  }, [isMaxSelected, maxInputIncludingFees, handleUserInput]);

  const handleLeverageInput = (newValue: number[]) => {
    handleLeverageSelect(newValue[0].toString());
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
          active={isLong}
          onClick={() => handleSelectPositionSide(true)}
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
          active={!isLong}
          onClick={() => handleSelectPositionSide(false)}
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
        handleChange={(newValue: number[]) => handleLeverageInput(newValue)}
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
              value={typedValue}
              handleUserInput={handleUserInput}
            />
            <Text weight={"bold"} style={{ color: theme.color.blue1 }}>
              OVL
            </Text>
          </Flex>
        </Flex>
      </InputContainer>

      <MainTradeDetails />
      <TradeButtonComponent />
      <AdditionalTradeDetails />
    </Flex>
  );
};

export default TradeWidget;
