import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useEffect, useState } from "react";
import NumericalInput from "../../../components/NumericalInput";
import {
  useTradeActionHandlers,
  useTradeState,
  useCollateralType,
} from "../../../state/trade/hooks";
import { useSearchParams } from "react-router-dom";
import { useMaxInputIncludingFees } from "../../../hooks/useMaxInputIncludingFees";
import LiFiModal from "../../../components/LiFiModal";

const CollateralInputComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { typedValue } = useTradeState();
  const collateralType = useCollateralType();
  const { handleAmountInput } = useTradeActionHandlers();
  const { maxInputIncludingFees, isLoading, error } = useMaxInputIncludingFees({
    marketId,
  });

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
            {isLoading ? "Loading..." : `Max: ${maxInputIncludingFees.toFixed(6).replace(/\.?0+$/, '')} ${collateralType}`}
          </Text>
          {error && (
            <Text size="1" style={{ color: theme.color.red1 }}>
              Error loading max amount
            </Text>
          )}
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
