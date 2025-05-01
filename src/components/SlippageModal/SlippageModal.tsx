import { useCallback, useEffect, useState } from "react";
import Modal from "../Modal";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Settings } from "react-feather";
import theme from "../../theme";
import NumericalInput from "../NumericalInput";

type SlippageModalProps = {
  slippageValue: string;
  handleSlippageSet: (value: string) => void;
  defaultSlippage: string;
  localStorageKey: string;
  minSlippageValue: number;
  warningHighSlippage?: string;
  warningLowSlippage?: string;
  colorTheme: string;
};

const SlippageModal: React.FC<SlippageModalProps> = ({
  slippageValue,
  handleSlippageSet,
  defaultSlippage,
  localStorageKey,
  minSlippageValue,
  warningHighSlippage = "Caution: High slippage.",
  warningLowSlippage = "Caution: Slippage too low. Minimum is 0.05%.",
  colorTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSlippageReset = useCallback(() => {
    handleSlippageSet(defaultSlippage);
    localStorage.setItem(localStorageKey, defaultSlippage);
    setIsOpen(false);
  }, [defaultSlippage, handleSlippageSet, localStorageKey]);

  useEffect(() => {
    const storedSlippage = localStorage.getItem(localStorageKey);
    if (storedSlippage && !isNaN(Number(storedSlippage))) {
      handleSlippageSet(storedSlippage);
    } else {
      handleSlippageSet(defaultSlippage);
    }
  }, [defaultSlippage, handleSlippageSet, localStorageKey]);

  const handleSlippageModalClose = () => {
    const numValue = Number(slippageValue);
    if (!isNaN(numValue) && numValue >= minSlippageValue) {
      localStorage.setItem(localStorageKey, slippageValue);
      setIsOpen(false);
    } else if (slippageValue === ".") {
      handleSlippageSet(defaultSlippage);
      localStorage.setItem(localStorageKey, defaultSlippage);
      setIsOpen(false);
    }
  };

  return (
    <Modal
      triggerElement={
        <Text
          size="1"
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: colorTheme,
          }}
          onClick={() => setIsOpen(true)}
        >
          {`${slippageValue}% slippage`}
        </Text>
      }
      title="Slippage"
      width="375px"
      minHeight="190px"
      handleClose={handleSlippageModalClose}
      open={isOpen}
    >
      <Flex direction="column" align="center" gap="4px">
        <Flex justify="between" align="center" mt="40px" width="100%">
          <Flex gap="8px" align="center">
            <Settings size={16} color={theme.color.grey1} />
            <Text>Slippage</Text>
          </Flex>
          <Flex gap="8px" align="center">
            <Text
              onClick={handleSlippageReset}
              style={{
                color:
                  slippageValue === defaultSlippage
                    ? colorTheme
                    : theme.color.grey2,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Auto
            </Text>
            <Box
              width="100px"
              height="40px"
              style={{
                background: theme.color.grey7,
                borderRadius: "4px",
              }}
            >
              <Flex align="center" p="8px">
                <NumericalInput
                  value={slippageValue}
                  handleUserInput={handleSlippageSet}
                  align="right"
                  isFocused={true}
                />
                <Box pl="16px"> % </Box>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Flex>
          {Number(slippageValue) > 5 && (
            <Text style={{ fontSize: "12px", color: theme.color.red1 }}>
              {warningHighSlippage}
            </Text>
          )}
          {Number(slippageValue) < minSlippageValue && (
            <Text style={{ fontSize: "12px", color: theme.color.red1 }}>
              {warningLowSlippage}
            </Text>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};

export default SlippageModal;
