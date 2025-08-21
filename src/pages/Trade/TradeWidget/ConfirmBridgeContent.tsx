import { Flex, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import {
  useChainAndTokenState,
  useTradeState,
} from "../../../state/trade/hooks";
import theme from "../../../theme";
import DetailRow from "../../../components/Modal/DetailRow";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import {
  BridgeQuoteInfo,
  BridgeStage,
} from "../../../hooks/lifi/useLiFiBridge";
import { useSelectedChain } from "../../../hooks/lifi/useSelectedChain";

type ConfirmBridgeContentProps = {
  bridgeQuote?: BridgeQuoteInfo | null;
  bridgeStage: BridgeStage;
  handleBridge: () => void;
};

const ConfirmBridgeContent: React.FC<ConfirmBridgeContentProps> = ({
  bridgeQuote,
  bridgeStage,
  handleBridge,
}) => {
  const { typedValue } = useTradeState();
  const { selectedToken } = useChainAndTokenState();
  const { selectedChain } = useSelectedChain();

  const attemptingBridge =
    bridgeStage.stage === "bridging" ||
    bridgeStage.stage === "quote" ||
    bridgeStage.stage === "approval";

  const userInputFormatted = useMemo(() => {
    if (bridgeQuote?.requiredInputAmount && selectedToken) {
      const inputAmount =
        Number(bridgeQuote.requiredInputAmount) /
        Math.pow(10, selectedToken.decimals);
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
    <>
      <Flex mt={"24px"} direction={"column"} width={"100%"}>
        <DetailRow
          detail={"From"}
          value={`${selectedChain?.name} (${selectedToken?.symbol || ""})`}
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
          {`You will receive approximately ${expectedOvlFormatted} OVL on BSC. The transaction will bridge from ${selectedChain?.name} and automatically switch you to BSC network.`}
        </Text>
      </Flex>

      {attemptingBridge ? (
        <>
          <GradientLoaderButton height={"46px"} title={bridgeStage.stage} />
          <Flex my={"24px"}>
            <Text
              style={{
                color: theme.color.grey2,
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {bridgeStage.message ||
                "Please wait for the transaction to be processed."}
            </Text>
          </Flex>
        </>
      ) : (
        <GradientSolidButton
          title={"Confirm Bridge"}
          width={"100%"}
          height={"46px"}
          handleClick={handleBridge}
        />
      )}
    </>
  );
};

export default ConfirmBridgeContent;
