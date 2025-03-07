import React, { useCallback, useEffect } from "react";
import { Settings } from "react-feather";
import NumericalInput from "../NumericalInput";
import {
  MINIMUM_SLIPPAGE_VALUE,
  useTradeActionHandlers,
  useTradeState,
} from "../../state/trade/hooks";
import { DefaultTxnSettings } from "../../state/trade/actions";
import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import Modal from "../Modal";

const SetSlippageModal: React.FC = () => {
  const { slippageValue } = useTradeState();
  const { handleSlippageSet } = useTradeActionHandlers();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSlippageReset = useCallback(() => {
    handleSlippageSet(DefaultTxnSettings.DEFAULT_SLIPPAGE);
    localStorage.setItem("slippage", DefaultTxnSettings.DEFAULT_SLIPPAGE);
    setIsOpen(false);
  }, [handleSlippageSet]);

  useEffect(() => {
    const storedSlippage = localStorage.getItem(`slippage`);
    if (storedSlippage && !isNaN(Number(storedSlippage))) {
      handleSlippageSet(storedSlippage);
    } else {
      handleSlippageSet(DefaultTxnSettings.DEFAULT_SLIPPAGE);
    }
  }, [handleSlippageSet]);

  const handleSlippageModalClose = () => {
    const numValue = Number(slippageValue);
    if (!isNaN(numValue) && numValue >= MINIMUM_SLIPPAGE_VALUE) {
      localStorage.setItem("slippage", slippageValue);
      setIsOpen(false);
    } else if (slippageValue === ".") {
      handleSlippageSet(DefaultTxnSettings.DEFAULT_SLIPPAGE);
      localStorage.setItem("slippage", DefaultTxnSettings.DEFAULT_SLIPPAGE);
      setIsOpen(false);
    }
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

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
          onClick={handleModalOpen}
        >
          {`${slippageValue}% slippage`}
        </Text>
      }
      title={"Slippage"}
      width="375px"
      minHeight="190px"
      handleClose={handleSlippageModalClose}
      open={isOpen}
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
              onClick={handleSlippageReset}
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
