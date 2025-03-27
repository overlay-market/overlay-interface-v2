import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { InfoIcon } from "../../../assets/icons/svg-icons";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useTradeState } from "../../../state/trade/hooks";
import useAccount from "../../../hooks/useAccount";
import { useEffect, useMemo, useState } from "react";
import { limitDigitsInDecimals, TradeStateData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";

type AdditionalTradeDetailsProps = {
  tradeState?: TradeStateData;
};

const AdditionalTradeDetails: React.FC<AdditionalTradeDetailsProps> = ({
  tradeState,
}) => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, slippageValue } = useTradeState();

  const [fee, setFee] = useState<number>(0);
  const [currencyEstLiquidationPrice, setCurrencyEstLiquidationPrice] =
    useState<string | undefined>(undefined);

  const estLiquidationPrice: number | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return Number(tradeState.liquidationPriceEstimate);
  }, [tradeState]);

  const expectedOi: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return limitDigitsInDecimals(tradeState.expectedOi);
  }, [tradeState]);

  useEffect(() => {
    const fetchFee = async () => {
      if (marketId) {
        try {
          const fee = await sdk.trade.getFee(marketId);
          fee && setFee(fee);
        } catch (error) {
          console.error("Error fetching fee:", error);
        }
      }
    };
    fetchFee();
  }, [marketId, chainId]);

  useEffect(() => {
    estLiquidationPrice &&
      market &&
      typedValue &&
      setCurrencyEstLiquidationPrice(
        formatPriceWithCurrency(
          estLiquidationPrice,
          market.priceCurrency,
          market.marketId
        )
      );
    if (!address || !typedValue) {
      market &&
        setCurrencyEstLiquidationPrice(
          formatPriceWithCurrency(0, market.priceCurrency, market.marketId)
        );
    }
  }, [estLiquidationPrice, market, typedValue, address]);

  return (
    <Flex direction={"column"} gap="8px">
      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Fee</Text>
        <Text style={{ color: theme.color.blue1 }}>{fee}%</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"8px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Slippage</Text>
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>{slippageValue}%</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Liquidation</Text>
        <Text style={{ color: theme.color.blue1 }}>
          {currencyEstLiquidationPrice}
        </Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"4px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Expected OI</Text>
          <InfoIcon />
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>
          {expectedOi && typedValue && address ? expectedOi : `-`}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AdditionalTradeDetails;
