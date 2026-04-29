import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import {
  LongPositionSelectButton,
  ShortPositionSelectButton,
  Triangle,
} from "./position-select-component-styles";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useSearchParams } from "react-router-dom";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import useBidAndAsk from "../../../hooks/useBidAndAsk";
import { isGamblingMarket } from "../../../utils/marketGuards";

interface PositionSelectComponentProps {
  prices?: { bid: bigint; ask: bigint; mid: bigint };
}

const PositionSelectComponent: React.FC<PositionSelectComponentProps> = ({ prices: pricesFromPositions }) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");

  // Use prices from positions if available (eliminates duplicate polling)
  // Skip useBidAndAsk when we have prices from positions
  const skipBidAndAskHook = Boolean(pricesFromPositions);
  const { bid: bidFromHook, ask: askFromHook } = useBidAndAsk(marketId, skipBidAndAskHook);

  // Convert bigint prices to numbers, or use hook values
  const bid = useMemo(() => {
    if (pricesFromPositions?.bid) {
      return Number(pricesFromPositions.bid) / 1e18;
    }
    return bidFromHook;
  }, [pricesFromPositions, bidFromHook]);

  const ask = useMemo(() => {
    if (pricesFromPositions?.ask) {
      return Number(pricesFromPositions.ask) / 1e18;
    }
    return askFromHook;
  }, [pricesFromPositions, askFromHook]);

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

  const { longLabel, shortLabel } = useMemo(() => {
    return {
      longLabel: market?.buttons?.long ?? "Long",
      shortLabel: market?.buttons?.short ?? "Short",
    };
  }, [market]);

  const isDoubleOrNothing = useMemo(
    () => isGamblingMarket(market?.marketName),
    [market?.marketName]
  );

  useEffect(() => {
    if (isDoubleOrNothing && !isLong) {
      handlePositionSideSelect(true);
    }
  }, [isDoubleOrNothing, isLong, handlePositionSideSelect]);

  return (
    <Flex height={"52px"} gap={"8px"}>
      <LongPositionSelectButton
        type="button"
        $active={isLong}
        onClick={() => handleSelectPositionSide(true)}
        aria-label={longLabel}
        title={longLabel}
      >
        {isDoubleOrNothing ? (
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Triangle $direction="up" />
          </Flex>
        ) : (
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Text size={"3"} weight={"bold"}>
              {longLabel}
            </Text>
            <Text size={"1"} style={{ color: theme.color.blue1 }}>
              {currencyAsk}
            </Text>
          </Flex>
        )}
      </LongPositionSelectButton>
      {!isDoubleOrNothing && (
        <ShortPositionSelectButton
          type="button"
          $active={isLong}
          onClick={() => handleSelectPositionSide(false)}
          aria-label={shortLabel}
          title={shortLabel}
        >
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Text size={"3"} weight={"bold"}>
              {shortLabel}
            </Text>
            <Text size={"1"} style={{ color: theme.color.blue1 }}>
              {currencyBid}
            </Text>
          </Flex>
        </ShortPositionSelectButton>
      )}
    </Flex>
  );
};

export default PositionSelectComponent;
