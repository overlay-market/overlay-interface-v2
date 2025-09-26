import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useEffect, useState } from "react";
import NumericalInput from "../../../components/NumericalInput";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import { useSearchParams } from "react-router-dom";
import { useMaxInputIncludingFees } from "../../../hooks/useMaxInputIncludingFees";

const CollateralInputComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { typedValue } = useTradeState();
  const { handleAmountInput } = useTradeActionHandlers();
  const { maxInputIncludingFees, isLoading, error } = useMaxInputIncludingFees({
    marketId,
  });

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);

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
      handleUserInput(maxInputIncludingFees.toFixed(6));
    }
  }, [maxInputIncludingFees, handleUserInput]);

  // Update amount input when max selected and leverage is changed (thus maxInputIncludingFees changes)
  useEffect(() => {
    if (isMaxSelected && maxInputIncludingFees) {
      handleUserInput(maxInputIncludingFees.toString());
    }
  }, [isMaxSelected, maxInputIncludingFees, handleUserInput]);

  return (
    <Box
      width={"100%"}
      p={"8px"}
      style={{ borderRadius: "8px", background: theme.color.grey4 }}
    >
      <Flex direction={"column"} gap="22px">
        <Flex justify="between">
          <Text size="1" style={{ color: theme.color.grey3 }}>
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
            }}
          >
            {isLoading ? "Loading..." : `Max: ${maxInputIncludingFees} OVL`}
          </Text>
          {error && (
            <Text size="1" style={{ color: theme.color.red1 }}>
              Error loading max amount
            </Text>
          )}
        </Flex>

        <Flex justify="between">
          <NumericalInput
            value={typedValue}
            handleUserInput={handleUserInput}
          />
          <Text size="3" weight={"bold"} style={{ color: theme.color.blue1 }}>
            OVL
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CollateralInputComponent;
