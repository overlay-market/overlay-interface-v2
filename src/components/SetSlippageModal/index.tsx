import { useCallback, useEffect } from "react";
import { Settings } from "react-feather";
import NumericalInput from "../NumericalInput";
import { useTradeActionHandlers, useTradeState } from "../../state/trade/hooks";
import { DefaultTxnSettings } from "../../state/trade/actions";
import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { MINIMUM_SLIPPAGE_VALUE } from "../../pages/Trade";
import Modal from "../Modal";

const SetSlippageModal: React.FC = () => {
  const account = "";
  const { slippageValue } = useTradeState();
  const { handleSlippageSet } = useTradeActionHandlers();

  const handleResetSlippage = useCallback(() => {
    handleSlippageSet(DefaultTxnSettings.DEFAULT_SLIPPAGE);
  }, [handleSlippageSet]);

  useEffect(() => {
    const fetchSlippage = async () => {
      const storedSlippage = localStorage.getItem(`slippage`);
      // When value is edited or not a valid number, set to default slippage value
      if (storedSlippage && !isNaN(Number(storedSlippage))) {
        handleSlippageSet(
          storedSlippage || DefaultTxnSettings.DEFAULT_SLIPPAGE
        );
      } else {
        localStorage.setItem(
          `slippage`,
          slippageValue ?? DefaultTxnSettings.DEFAULT_SLIPPAGE
        );
      }
    };

    fetchSlippage();
  }, [account, handleSlippageSet, slippageValue]);

  return (
    <Modal
      triggerElement={
        <Text
          size={"1"}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: theme.color.blue2,
          }}
        >
          {`${slippageValue}% slippage`}
        </Text>
      }
      title={"Slippage"}
      boxShadow={`0px 0px 12px 6px rgba(91, 96, 164, 0.25)`}
      borderColor={`${theme.color.blue2}80`}
      width="375px"
      minHeight="190px"
    >
      <Flex
        direction={"column"}
        align={"center"}
        position={"relative"}
        gap={"4px"}
      >
        <Flex justify="between" align={"center"} mt="40px" width={"100%"}>
          <Flex gap={"8px"} align={"center"}>
            <Settings size={16} color={theme.color.grey1} />
            <Text>Slippage</Text>
          </Flex>

          <Flex gap={"8px"} justify={"end"} align={"center"}>
            <Text
              onClick={handleResetSlippage}
              style={{
                color:
                  slippageValue === DefaultTxnSettings.DEFAULT_SLIPPAGE
                    ? theme.color.blue2
                    : theme.color.grey2,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Auto
            </Text>
            <Box
              width={"100px"}
              height={"40px"}
              style={{
                background: theme.color.grey7,
                borderRadius: "4px",
              }}
            >
              <Flex align={"center"} p={"8px"}>
                <NumericalInput
                  value={slippageValue}
                  handleUserInput={handleSlippageSet}
                  align={"right"}
                  isFocused={true}
                />
                <Box pl={"16px"}> % </Box>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Flex>
          {Number(slippageValue) > 5 && (
            <Text style={{ fontSize: "12px", color: theme.color.red1 }}>
              Caution: High slippage. Your position may result in an unfavorable
              trade.
            </Text>
          )}
          {Number(slippageValue) < MINIMUM_SLIPPAGE_VALUE && (
            <Text style={{ fontSize: "12px", color: theme.color.red1 }}>
              Caution: Slippage too low. Slippage should be set to protocol
              minimum of 0.05%.
            </Text>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};

export default SetSlippageModal;
