import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import ProgressBar from "../../../components/ProgressBar";
import MarketsList from "./MarketsList";
import {
  BalanceFlex,
  MarketInfoContainer,
  StyledFlex,
  TradeHeaderContainer,
} from "./trade-header-styles";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useTradeState } from "../../../state/trade/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { limitDigitsInDecimals, toWei } from "overlay-sdk";
import { TRADE_POLLING_INTERVAL } from "../../../constants/applications";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";

const TradeHeader: React.FC = () => {
  const { marketId } = useParams();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, selectedLeverage, isLong } = useTradeState();

  const [price, setPrice] = useState<string>("");
  const [currencyPrice, setCurrencyPrice] = useState<string>("-");
  const [funding, setFunding] = useState<string | undefined>(undefined);
  const [shortPercentageOfTotalOi, setShortPercentageOfTotalOi] =
    useState<string>("0");
  const [longPercentageOfTotalOi, setLongPercentageOfTotalOi] =
    useState<string>("0");

  useEffect(() => {
    const fetchPrice = async () => {
      if (marketId) {
        try {
          const price = await sdk.trade.getPrice(
            marketId,
            typedValue ? toWei(typedValue) : undefined,
            toWei(selectedLeverage),
            isLong,
            8
          );
          price && setPrice(limitDigitsInDecimals(price as string));
        } catch (error) {
          console.error("Error fetching price:", error);
        }
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, TRADE_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [marketId, typedValue, selectedLeverage, isLong, sdk]);

  useEffect(() => {
    market &&
      price &&
      setCurrencyPrice(formatPriceWithCurrency(price, market.priceCurrency));
  }, [price, market]);

  useEffect(() => {
    const fetchFunding = async () => {
      if (marketId) {
        try {
          const funding = await sdk.trade.getFunding(marketId);
          funding && setFunding(funding);
        } catch (error) {
          console.error("Error fetching funding:", error);
        }
      }
    };

    fetchFunding();
    const intervalId = setInterval(fetchFunding, TRADE_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [marketId, sdk]);

  useEffect(() => {
    const fetchOiBalance = async () => {
      if (marketId) {
        try {
          const oiBalance = await sdk.trade.getOIBalance(marketId);
          oiBalance &&
            setShortPercentageOfTotalOi(oiBalance.shortPercentageOfTotalOi);
          oiBalance &&
            setLongPercentageOfTotalOi(oiBalance.longPercentageOfTotalOi);
        } catch (error) {
          console.error("Error fetching oi balance:", error);
        }
      }
    };

    fetchOiBalance();
    const intervalId = setInterval(fetchOiBalance, TRADE_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [marketId, sdk]);

  const isFundingRatePositive = useMemo(() => {
    return Math.sign(Number(funding)) > 0;
  }, [funding]);

  return (
    <TradeHeaderContainer>
      <MarketsList />

      <MarketInfoContainer>
        <StyledFlex width={{ initial: "109px", sm: "167px", lg: "119px" }}>
          <Text weight="light" style={{ fontSize: "10px" }}>
            Price
          </Text>
          <Text>{currencyPrice}</Text>
        </StyledFlex>

        <StyledFlex width={{ initial: "72px", sm: "167px", lg: "97px" }}>
          <Text weight="light" style={{ fontSize: "10px" }}>
            Funding
          </Text>
          <Text
            style={{
              color: isFundingRatePositive
                ? theme.color.green2
                : theme.color.red2,
            }}
          >
            {isFundingRatePositive ? `+` : ``}
            {funding ? `${funding}%` : `-`}
          </Text>
        </StyledFlex>

        <BalanceFlex
          direction={"column"}
          width={{ initial: "184px", sm: "336px", lg: "195px" }}
          height={"100%"}
          justify={"center"}
          align={"end"}
          pr={{ initial: "12px", sm: "20px", lg: "12px" }}
          pl={"10px"}
          ml={{ sm: "auto", lg: "0" }}
        >
          <Text weight="light" style={{ fontSize: "10px" }}>
            OI balance
          </Text>
          <Flex gap={"4px"} align={"center"}>
            <Text style={{ color: theme.color.red2 }}>
              {shortPercentageOfTotalOi}%
            </Text>
            <ProgressBar max={100} value={Number(shortPercentageOfTotalOi)} />
            <Text style={{ color: theme.color.green2 }}>
              {longPercentageOfTotalOi}%
            </Text>
          </Flex>
        </BalanceFlex>
      </MarketInfoContainer>
    </TradeHeaderContainer>
  );
};

export default TradeHeader;
