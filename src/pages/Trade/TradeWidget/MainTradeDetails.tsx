import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import SetSlippageModal from "../../../components/SetSlippageModal";
import { useTradeState } from "../../../state/trade/hooks";
import { useEffect, useMemo, useState } from "react";
import useAccount from "../../../hooks/useAccount";
import { limitDigitsInDecimals, TradeStateData } from "overlay-sdk";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";

type MainTradeDetailsProps = {
  tradeState?: TradeStateData;
};

const MainTradeDetails: React.FC<MainTradeDetailsProps> = ({ tradeState }) => {
  const { address } = useAccount();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue } = useTradeState();

  const [currencyPrice, setCurrencyPrice] = useState<string>("-");
  const [currencyMinPrice, setCurrencyMinPrice] = useState<string>("-");

  const price: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return limitDigitsInDecimals(tradeState?.priceInfo.price as string);
  }, [tradeState]);

  const minPrice: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return limitDigitsInDecimals(tradeState?.priceInfo.minPrice as string);
  }, [tradeState]);

  const priceImpact: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return tradeState.priceInfo.priceImpactPercentage;
  }, [tradeState]);

  useEffect(() => {
    price &&
      typedValue &&
      market &&
      setCurrencyPrice(formatPriceWithCurrency(price, market.priceCurrency));
  }, [price, market, typedValue]);

  useEffect(() => {
    minPrice &&
      typedValue &&
      market &&
      setCurrencyMinPrice(
        formatPriceWithCurrency(minPrice, market.priceCurrency)
      );
  }, [minPrice, market, typedValue]);

  useEffect(() => {
    if (!address || !typedValue) {
      setCurrencyPrice("-");
      setCurrencyMinPrice("-");
    }
  }, [address, typedValue]);

  return (
    <Flex direction={"column"} gap="16px">
      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Price</Text>
        <Text style={{ color: theme.color.blue1 }}>{currencyPrice}</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"8px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Worst Price</Text>
          <SetSlippageModal />
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>{currencyMinPrice}</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Price Impact</Text>
        <Text style={{ color: theme.color.blue1 }}>
          {priceImpact && typedValue && address ? `${priceImpact}%` : `-`}
        </Text>
      </Flex>
    </Flex>
  );
};

export default MainTradeDetails;
