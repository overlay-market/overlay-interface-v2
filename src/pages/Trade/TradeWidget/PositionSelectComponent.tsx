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
import { toPercentUnit, toScientificNumber } from "overlay-sdk";

const PositionSelectComponent: React.FC = () => {
  const { currentMarket: market } = useCurrentMarketState();
  const { isLong } = useTradeState();
  const { handlePositionSideSelect } = useTradeActionHandlers();

  const [longPrice, setLongPrice] = useState<string>("");
  const [shortPrice, setShortPrice] = useState<string>("");

  useEffect(() => {
    market &&
      setLongPrice(
        `${market.priceCurrency}${
          market.priceCurrency === "%"
            ? toPercentUnit(market.parsedAsk)
            : toScientificNumber(market.parsedAsk)
        }`
      );
    market &&
      setShortPrice(
        `${market.priceCurrency}${
          market.priceCurrency === "%"
            ? toPercentUnit(market.parsedBid)
            : toScientificNumber(market.parsedBid)
        }`
      );
  }, [market]);

  const handleSelectPositionSide = useCallback(
    (isLong: boolean) => {
      handlePositionSideSelect(isLong);
    },
    [handlePositionSideSelect]
  );

  return (
    <Flex height={"64px"} gap={"8px"}>
      <LongPositionSelectButton
        active={isLong}
        onClick={() => handleSelectPositionSide(true)}
        style={{ background: theme.color.grey4 }}
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Text size={"3"} weight={"bold"}>
            Buy
          </Text>
          <Text size={"1"} style={{ color: theme.color.blue1 }}>
            {longPrice}
          </Text>
        </Flex>
      </LongPositionSelectButton>
      <ShortPositionSelectButton
        active={!isLong}
        onClick={() => handleSelectPositionSide(false)}
        style={{ background: theme.color.grey4 }}
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Text size={"3"} weight={"bold"}>
            Sell
          </Text>
          <Text size={"1"} style={{ color: theme.color.blue1 }}>
            {shortPrice}
          </Text>
        </Flex>
      </ShortPositionSelectButton>
    </Flex>
  );
};

export default PositionSelectComponent;
