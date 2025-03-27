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
import { limitDigitsInDecimals } from "overlay-sdk";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { TRADE_POLLING_INTERVAL } from "../../../constants/applications";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";

const PositionSelectComponent: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const sdk = useSDK();

  const { currentMarket: market } = useCurrentMarketState();
  const { isLong } = useTradeState();
  const { handlePositionSideSelect } = useTradeActionHandlers();

  const [ask, setAsk] = useState<string>("");
  const [bid, setBid] = useState<string>("");
  const [currencyAsk, setCurrencyAsk] = useState<string>("-");
  const [currencyBid, setCurrencyBid] = useState<string>("-");

  useEffect(() => {
    const fetchBidAndAsk = async () => {
      if (marketId) {
        try {
          const bidAndAsk = await sdk.trade.getBidAndAsk(marketId, 8);

          bidAndAsk && setAsk(limitDigitsInDecimals(bidAndAsk.ask as number));
          bidAndAsk && setBid(limitDigitsInDecimals(bidAndAsk.bid as number));
        } catch (error) {
          console.error("Error fetching bid and ask:", error);
        }
      }
    };

    fetchBidAndAsk();
    const intervalId = setInterval(fetchBidAndAsk, TRADE_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [marketId, chainId, sdk]);

  useEffect(() => {
    ask &&
      market &&
      setCurrencyAsk(
        formatPriceWithCurrency(ask, market.priceCurrency, market.marketId)
      );
  }, [ask, market]);

  useEffect(() => {
    bid &&
      market &&
      setCurrencyBid(
        formatPriceWithCurrency(bid, market.priceCurrency, market.marketId)
      );
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
            Buy
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
            Sell
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
