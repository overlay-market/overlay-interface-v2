import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useEffect, useRef, useState } from "react";
import NumericalInput from "../../../components/NumericalInput";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import { useSearchParams } from "react-router-dom";
import useSDK from "../../../providers/SDKProvider/useSDK";
import useAccount from "../../../hooks/useAccount";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { toWei } from "overlay-sdk";

const CollateralInputComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { address } = useAccount();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();
  const { typedValue, selectedLeverage } = useTradeState();
  const { handleAmountInput } = useTradeActionHandlers();

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);
  const [maxInputIncludingFees, setMaxInputIncludingFees] = useState<number>(0);

  const sdkRef = useRef(sdk);
  useEffect(() => {
    sdkRef.current = sdk;
  }, [sdk]);

  useEffect(() => {
    const fetchMaxInputIncludingFees = async () => {
      if (marketId && address) {
        try {
          const maxInputIncludingFees =
            await sdkRef.current.trade.getMaxInputIncludingFees(
              marketId,
              address,
              toWei(selectedLeverage),
              6
            );
          maxInputIncludingFees &&
            setMaxInputIncludingFees(maxInputIncludingFees);
        } catch (error) {
          console.error("Error fetching maxInputIncludingFees:", error);
        }
      }
      if (!address) {
        setMaxInputIncludingFees(0);
      }
    };

    fetchMaxInputIncludingFees();
  }, [marketId, address, selectedLeverage, chainId]);

  const handleUserInput = useCallback(
    (input: string) => {
      if (Number(input) !== maxInputIncludingFees) {
        setIsMaxSelected(false);
      }
      handleAmountInput(input);
    },
    [handleAmountInput, setIsMaxSelected, maxInputIncludingFees]
  );

  const handleMaxInput = () => {
    setIsMaxSelected(true);
    return handleUserInput(Number(maxInputIncludingFees).toFixed(6));
  };

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
          <Text size="3" weight={"bold"} style={{ color: theme.color.blue1 }}>
            OVL
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CollateralInputComponent;
