import { Flex, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { useChainAndTokenState, useTradeState } from "../../../state/trade/hooks";
import Modal from "../../../components/Modal";
import theme from "../../../theme";
import DetailRow from "../../../components/Modal/DetailRow";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import { BridgeQuoteInfo } from "../../../hooks/lifi/useLiFiBridge";

type BridgeConfirmModalProps = {
  open: boolean;
  bridgeQuote: BridgeQuoteInfo | null;
  attemptingBridge: boolean;
  handleDismiss: () => void;
  handleBridge: () => void;
};

const BridgeConfirmModal: React.FC<BridgeConfirmModalProps> = ({
  open,
  bridgeQuote,
  attemptingBridge,
  handleDismiss,
  handleBridge,
}) => {
  const { typedValue } = useTradeState();
  const { selectedChainId, selectedToken } = useChainAndTokenState();

  const fromChainName = useMemo(() => {
    const chainNames: { [key: number]: string } = {
      1: "Ethereum",
      42161: "Arbitrum",
      10: "Optimism",
      8453: "Base",
      56: "BSC",
    };
    return chainNames[selectedChainId] || `Chain ${selectedChainId}`;
  }, [selectedChainId]);

  const userInputFormatted = useMemo(() => {
    if (bridgeQuote?.requiredInputAmount && selectedToken) {
      const inputAmount = Number(bridgeQuote.requiredInputAmount) / Math.pow(10, selectedToken.decimals);
      return inputAmount.toFixed(6);
    }
    return parseFloat(typedValue).toFixed(6);
  }, [bridgeQuote, typedValue, selectedToken]);

  const expectedOvlFormatted = useMemo(() => {
    if (bridgeQuote?.expectedOvlAmount) {
      const ovlAmount = Number(bridgeQuote.expectedOvlAmount) / 1e18;
      return ovlAmount.toFixed(4);
    }
    return parseFloat(typedValue).toFixed(4);
  }, [bridgeQuote, typedValue]);

  const exchangeRateFormatted = useMemo(() => {
    if (bridgeQuote?.exchangeRate) {
      return bridgeQuote.exchangeRate;
    }
    return `1 ${selectedToken?.symbol || ""} = 1 OVL`;
  }, [bridgeQuote, selectedToken]);

  const bridgeFeeFormatted = useMemo(() => {
    if (bridgeQuote?.fees) {
      return bridgeQuote.fees;
    }
    return "~1% slippage";
  }, [bridgeQuote]);

  return (
    <Modal
      triggerElement={null}
      open={open}
      handleClose={handleDismiss}
      title={"Confirm Bridge"}
      fontSizeTitle={"16px"}
      width="352px"
      minHeight="465px"
    >
      <Flex mt={"24px"} direction={"column"} width={"100%"}>
        <DetailRow 
          detail={"From"} 
          value={`${fromChainName} (${selectedToken?.symbol || ""})`} 
        />
        <DetailRow detail={"To"} value={"BSC (OVL)"} />
        <DetailRow 
          detail={"You Pay"} 
          value={`${userInputFormatted} ${selectedToken?.symbol || ""}`} 
        />
        <DetailRow 
          detail={"You Receive"} 
          value={`${expectedOvlFormatted} OVL`}
          valueColor={theme.color.green1}
        />
      </Flex>

      <Flex mt={"32px"} direction={"column"} width={"100%"}>
        <DetailRow detail={"Exchange Rate"} value={exchangeRateFormatted} />
        <DetailRow detail={"Bridge Fee"} value={bridgeFeeFormatted} />
        <DetailRow detail={"Slippage Tolerance"} value={"1%"} />
      </Flex>

      <Flex my={"24px"}>
        <Text style={{ color: theme.color.grey3, fontSize: "12px" }}>
          {`You will receive approximately ${expectedOvlFormatted} OVL on BSC. The transaction will bridge from ${fromChainName} and automatically switch you to BSC network.`}
        </Text>
      </Flex>

      {attemptingBridge ? (
        <GradientLoaderButton
          height={"46px"}
          title={"Bridging..."}
        />
      ) : (
        <GradientSolidButton
          title={"Confirm Bridge"}
          width={"100%"}
          height={"46px"}
          handleClick={handleBridge}
        />
      )}
    </Modal>
  );
};

export default BridgeConfirmModal;