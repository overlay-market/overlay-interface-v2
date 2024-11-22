import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import ProgressBar from "../../../components/ProgressBar";
import MarketsList from "./MarketsList";
import {
  MarketInfoContainer,
  ResponsiveEmptyPlaceholder,
  StyledFlex,
  TradeHeaderContainer,
} from "./trade-header-styles";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useTradeState } from "../../../state/trade/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { limitDigitsInDecimals, toWei } from "overlay-sdk";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { TRADE_POLLING_INTERVAL } from "../../../constants/applications";
import { formatPriceByCurrency } from "../../../utils/formatPriceByCurrency";

const TradeHeader: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
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
    let interval: NodeJS.Timeout;

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
    interval = setInterval(fetchPrice, TRADE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [marketId, typedValue, selectedLeverage, isLong, chainId, sdk]);

  useEffect(() => {
    market &&
      price &&
      setCurrencyPrice(
        `${market.priceCurrency}${formatPriceByCurrency(
          price,
          market.priceCurrency
        )}`
      );
  }, [price, market]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

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
    interval = setInterval(fetchFunding, TRADE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [marketId, chainId, sdk]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

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
    interval = setInterval(fetchOiBalance, TRADE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [marketId, chainId, sdk]);

  const isFundingRatePositive = useMemo(() => {
    return Math.sign(Number(funding)) > 0;
  }, [funding]);

  return (
    <>
      <ResponsiveEmptyPlaceholder></ResponsiveEmptyPlaceholder>
      <TradeHeaderContainer>
        <MarketsList />

        <MarketInfoContainer>
          <StyledFlex
            width={{ initial: "109px", sm: "167px", lg: "119px" }}
            p={{ initial: "8px 0px 8px 4px", sm: "12px 15px", md: "12px" }}
          >
            <Text weight="light" style={{ fontSize: "10px" }}>
              Price
            </Text>
            <Text>{currencyPrice}</Text>
          </StyledFlex>

          <StyledFlex
            width={{ initial: "92px", sm: "167px", lg: "97px" }}
            p={{ initial: "8px 0px", sm: "12px" }}
            align={{ initial: "start", sm: "end" }}
          >
            <Text weight="light" style={{ fontSize: "10px" }}>
              Funding
            </Text>
            <Text
              style={{
                color: isFundingRatePositive
                  ? theme.color.red2
                  : theme.color.green2,
              }}
            >
              {isFundingRatePositive ? `+` : ``}
              {funding ? `${funding}%` : `-`}
            </Text>
          </StyledFlex>

          <Flex
            direction={"column"}
            width={{ initial: "157px", sm: "336px", lg: "195px" }}
            height={"100%"}
            justify={"center"}
            align={"end"}
            p={{ initial: "8px 4px 8px 0px", sm: "12px" }}
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
          </Flex>
        </MarketInfoContainer>
      </TradeHeaderContainer>
    </>
  );
};

export default TradeHeader;
