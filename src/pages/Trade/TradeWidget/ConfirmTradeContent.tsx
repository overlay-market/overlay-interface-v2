import { Flex, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { limitDigitsInDecimals, TradeStateData } from "overlay-sdk";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useTradeState, useCollateralType } from "../../../state/trade/hooks";
import theme from "../../../theme";
import DetailRow from "../../../components/Modal/DetailRow";
import {
  GradientLoaderButton,
  GradientSolidButton,
} from "../../../components/Button";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";
import { formatNumberForDisplay } from "../../../utils/formatNumberForDisplay";

type ConfirmTradeContentProps = {
  tradeState: TradeStateData;
  attemptingTransaction: boolean;
  handleTrade: () => void;
};

const ConfirmTradeContent: React.FC<ConfirmTradeContentProps> = ({
  tradeState,
  attemptingTransaction,
  handleTrade,
}) => {
  const { currentMarket: market } = useCurrentMarketState();
  const { slippageValue, isLong, selectedLeverage, typedValue } = useTradeState();
  const collateralType = useCollateralType();

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

  return (
    <>
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
          detail={"Initial Collateral"}
          value={`${formatNumberForDisplay(tradeState.initialCollateral)} ${collateralType}`}
        />
        <DetailRow
          detail={"Build Fee"}
          value={`${formatNumberForDisplay(tradeState.buildFee)} ${collateralType}`}
        />
        <DetailRow
          detail={"Total Cost"}
          value={`${formatNumberForDisplay(tradeState.totalCost)} ${collateralType}`}
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

      {collateralType === 'USDT' && (
        <Flex
          width="100%"
          p="12px"
          mb="16px"
          style={{
            background: 'rgba(255, 193, 7, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${theme.color.yellow1}`,
          }}
        >
          <Text size="2" style={{ color: theme.color.yellow1 }}>
            Note: USDT-collateral positions do not support partial unwinds yet.
          </Text>
        </Flex>
      )}

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
};

export default ConfirmTradeContent;
