import { Flex, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { limitDigitsInDecimals, TradeStateData } from "overlay-sdk";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useTradeState } from "../../../state/trade/hooks";
import Modal from "../../../components/Modal";
import theme from "../../../theme";
import DetailRow from "../../../components/Modal/DetailRow";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import { formatNumberForDisplay } from "../../../utils/formatNumberForDisplay";
import { TradeStage } from "../../../hooks/lifi/useLiFiTrade";

type ConfirnTxnModalProps = {
  open: boolean;
  tradeState: TradeStateData;
  tradeStage?: TradeStage;
  attemptingTransaction: boolean;
  handleDismiss: () => void;
  handleTrade: () => void;
};

const ConfirmTxnModal: React.FC<ConfirnTxnModalProps> = ({
  open,
  tradeState,
  tradeStage,
  attemptingTransaction,
  handleDismiss,
  handleTrade,
}) => {
  const { currentMarket: market } = useCurrentMarketState();
  const { slippageValue, isLong, selectedLeverage } = useTradeState();

  const tradeWithLiFi = tradeStage !== undefined;

  const price: string = useMemo(() => {
    if (!market) return "-";

    const transformedPrice = formatPriceByCurrency(
      tradeState.priceInfo.price as string,
      market.priceCurrency
    );

    return transformedPrice;
  }, [tradeState, market]);

  const minPrice: string = useMemo(() => {
    if (!market) return "-";

    const transformedMinPrice = formatPriceByCurrency(
      tradeState.priceInfo.minPrice as string,
      market.priceCurrency
    );
    return transformedMinPrice;
  }, [tradeState, market]);

  const liquidationPriceEstimate: string = useMemo(() => {
    if (!market) return "-";

    const transformedPrice = formatPriceByCurrency(
      tradeState.liquidationPriceEstimate,
      market.priceCurrency
    );

    return transformedPrice;
  }, [tradeState, market]);

  const expectedOi: string = useMemo(() => {
    return limitDigitsInDecimals(tradeState.expectedOi);
  }, [tradeState]);

  const renderConfirmTradeDefault = () => (
    <>
      {attemptingTransaction ? (
        <GradientLoaderButton
          height={"46px"}
          title={"Pending confirmation..."}
        />
      ) : (
        <GradientSolidButton
          title={"Confirm Trade"}
          width={"100%"}
          height={"46px"}
          handleClick={handleTrade}
        />
      )}
    </>
  );

  const renderConfirmTradeWithLiFi = () => (
    <>
      {tradeStage && tradeStage.stage === "idle" && (
        <GradientSolidButton
          title={"Confirm Trade with LiFi"}
          width={"100%"}
          height={"46px"}
          handleClick={handleTrade}
        />
      )}

      {tradeStage && tradeStage.stage !== "idle" && (
        <>
          <GradientLoaderButton height={"46px"} title={tradeStage.stage} />
          <Flex my={"24px"}>
            <Text
              style={{
                color: theme.color.grey2,
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {tradeStage.message ||
                "Please wait for the transaction to be processed."}
            </Text>
          </Flex>
        </>
      )}
    </>
  );

  return (
    <Modal
      triggerElement={null}
      open={open}
      handleClose={handleDismiss}
      title={"Confirm Transaction"}
      fontSizeTitle={"16px"}
      width="352px"
      minHeight="565px"
    >
      <Flex mt={"24px"} direction={"column"} width={"100%"} align={"center"}>
        <Text style={{ color: theme.color.grey3 }}>Market</Text>
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "600",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          {market?.marketName}
        </Text>
      </Flex>

      <Flex mt={"16px"} direction={"column"} width={"100%"}>
        <DetailRow detail={"Price"} value={price} />
        <DetailRow
          detail={"Side"}
          valueColor={isLong ? theme.color.green1 : theme.color.red1}
          value={isLong ? "Long" : "Short"}
        />
        <DetailRow detail={"Leverage"} value={`${selectedLeverage}x`} />
      </Flex>

      <Flex mt={"48px"} direction={"column"} width={"100%"}>
        <DetailRow detail={"Fee"} value={`${tradeState.tradingFeeRate}%`} />
        <DetailRow detail={"Slippage"} value={`${slippageValue}%`} />
        <DetailRow
          detail={"Est. Liquidation"}
          value={liquidationPriceEstimate}
        />
      </Flex>

      <Flex mt={"48px"} direction={"column"} width={"100%"}>
        <DetailRow
          detail={"Estimated Collateral"}
          value={`${formatNumberForDisplay(
            tradeState.estimatedCollateral
          )} OVL`}
        />
        <DetailRow detail={"Estimated OI"} value={expectedOi} />
      </Flex>

      <Flex my={"24px"}>
        <Text style={{ color: theme.color.grey3, fontSize: "12px" }}>
          {`The received price will be at ${
            isLong ? "most" : "least"
          } ${minPrice} or the transaction will revert.`}
        </Text>
      </Flex>

      {!tradeWithLiFi && renderConfirmTradeDefault()}
      {tradeWithLiFi && renderConfirmTradeWithLiFi()}
    </Modal>
  );
};

export default ConfirmTxnModal;
