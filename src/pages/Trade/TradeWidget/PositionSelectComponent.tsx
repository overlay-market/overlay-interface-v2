import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useEffect, useState } from "react";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import {
  LongPositionSelectButton,
  ShortPositionSelectButton,
} from "./position-select-component-styles";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useSearchParams } from "react-router-dom";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import useBidAndAsk from "../../../hooks/useBidAndAsk";

const PositionSelectComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { bid, ask } = useBidAndAsk(marketId);

  const { currentMarket: market } = useCurrentMarketState();
  const { isLong } = useTradeState();
  const { handlePositionSideSelect } = useTradeActionHandlers();

  const [currencyAsk, setCurrencyAsk] = useState<string>("-");
  const [currencyBid, setCurrencyBid] = useState<string>("-");

  useEffect(() => {
    ask &&
      market &&
      setCurrencyAsk(formatPriceWithCurrency(ask, market.priceCurrency));
  }, [ask, market]);

  useEffect(() => {
    bid &&
      market &&
      setCurrencyBid(formatPriceWithCurrency(bid, market.priceCurrency));
  }, [bid, market]);

  const handleSelectPositionSide = useCallback(
    (isLong: boolean) => {
      handlePositionSideSelect(isLong);
    },
    [handlePositionSideSelect]
  );

  return (
    <Flex height={"52px"} gap={"8px"}>
      <LongPositionSelectButton
        active={isLong.toString()}
        onClick={() => handleSelectPositionSide(true)}
        style={{ background: theme.color.grey4 }}
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Text size={"3"} weight={"bold"}>
            {market?.buttons?.long ?? "Buy"}
          </Text>
          <Text size={"1"} style={{ color: theme.color.blue1 }}>
            {currencyAsk}
          </Text>
        </Flex>
      </LongPositionSelectButton>
      <ShortPositionSelectButton
        active={isLong.toString()}
        onClick={() => handleSelectPositionSide(false)}
        style={{ background: theme.color.grey4 }}
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Text size={"3"} weight={"bold"}>
            {market?.buttons?.short ?? "Sell"}
          </Text>
          <Text size={"1"} style={{ color: theme.color.blue1 }}>
            {currencyBid}
          </Text>
        </Flex>
      </ShortPositionSelectButton>
    </Flex>
  );
};

export default PositionSelectComponent;
