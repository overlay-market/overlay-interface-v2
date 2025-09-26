import React from 'react';
import { Box, Flex, Text, Button } from "@radix-ui/themes";
import theme from "../../theme";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { GasCheckResult } from "../../hooks/useGasCheck";
import Modal from "../Modal";

// Native BNB address for LiFi widget
const BNB_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

interface GetBNBModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasCheckResult: GasCheckResult;
  onSkip?: () => void;
}

export const GetBNBModal: React.FC<GetBNBModalProps> = ({
  isOpen,
  onClose,
  gasCheckResult,
  onSkip,
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleGoToExchange = () => {
    // Open exchange page in new tab with BNB pre-selected
    const targetAmount = gasCheckResult.gasDeficit ?
      (parseFloat(gasCheckResult.gasDeficit) * 1.1).toFixed(6) : // Add 10% buffer
      "0.01"; // Default minimum amount

    const searchParams = new URLSearchParams({
      toChain: DEFAULT_CHAINID.toString(),
      toToken: BNB_ADDRESS,
      toAmount: targetAmount
    });

    const exchangeUrl = `${window.location.origin}/exchange?${searchParams.toString()}`;
    window.open(exchangeUrl, '_blank');

    // Proceed to next stage after opening exchange
    console.log("🔋 Exchange opened, proceeding to build position");
    onSkip?.();
    onClose();
  };

  const handleSkip = () => {
    console.log("🔋 User skipped gas modal, proceeding to build position");
    onSkip?.();
    onClose();
  };


  return (
    <Modal
      triggerElement={null}
      open={isOpen}
      handleClose={onClose}
      title="Get BNB for Gas"
      fontSizeTitle="20px"
      width={isMobile ? "90vw" : "480px"}
    >
      <Text size="2" style={{ color: theme.color.grey3, marginBottom: "20px", display: "block" }}>
        You need BNB to pay for transaction fees
      </Text>

        {/* Gas Info */}
        <Box
          style={{
            backgroundColor: theme.color.grey4,
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
          }}
        >
          <Flex justify="between" mb="8px">
            <Text size="2" style={{ color: theme.color.grey3 }}>
              Current BNB Balance:
            </Text>
            <Text size="2" weight="medium" style={{ color: theme.color.grey1 }}>
              {parseFloat(gasCheckResult.currentBnbBalance).toFixed(4)} BNB
            </Text>
          </Flex>
          <Flex justify="between" mb="8px">
            <Text size="2" style={{ color: theme.color.grey3 }}>
              Required for Gas:
            </Text>
            <Text size="2" weight="medium" style={{ color: theme.color.grey1 }}>
              {parseFloat(gasCheckResult.requiredBnbAmount).toFixed(4)} BNB
            </Text>
          </Flex>
          <Flex justify="between">
            <Text size="2" style={{ color: theme.color.grey3 }}>
              Amount Needed:
            </Text>
            <Text size="2" weight="bold" style={{ color: theme.color.red1 }}>
              {parseFloat(gasCheckResult.gasDeficit).toFixed(4)} BNB
            </Text>
          </Flex>
        </Box>

        {/* Call to Action */}
        <Box
          style={{
            backgroundColor: theme.color.grey4,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <Text size="3" weight="medium" style={{ color: theme.color.grey1, marginBottom: "8px", display: "block" }}>
            🚨 Insufficient BNB for Gas
          </Text>
          <Text size="2" style={{ color: theme.color.grey3, marginBottom: "16px", display: "block" }}>
            You need more BNB to complete this transaction. Get BNB on our exchange page or handle it manually.
          </Text>
          <Button
            size="3"
            style={{
              background: "linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%)",
              color: theme.color.black,
              cursor: "pointer",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              width: "100%",
              marginBottom: "12px",
              padding: "16px 24px",
              height: "56px",
            }}
            onClick={handleGoToExchange}
          >
            Get BNB
          </Button>
        </Box>

        {/* Skip Option */}
        <Flex justify="center" mt="16px">
          <Button
            variant="ghost"
            size="2"
            onClick={handleSkip}
            style={{
              cursor: "pointer",
              color: theme.color.grey3,
            }}
          >
            Skip (I'll handle gas manually)
          </Button>
        </Flex>
    </Modal>
  );
};