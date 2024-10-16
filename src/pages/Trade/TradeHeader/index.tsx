import { Flex, Text, Box } from "@radix-ui/themes";
import theme from "../../../theme";
import ProgressBar from "../../../components/ProgressBar";
import MarketsList from "./MarketsList";
import { StyledSeparator } from "./trade-header-styles";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useSDK from "../../../hooks/useSDK";
import { useTradeState } from "../../../state/trade/hooks";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
  toWei,
} from "overlay-sdk";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import { TRADE_POLLING_INTERVAL } from "../../../constants/applications";

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
        `${market.priceCurrency}${
          market.priceCurrency === "%"
            ? toPercentUnit(price)
            : toScientificNumber(price)
        }`
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
    <Box
      width={"100%"}
      height={`${theme.headerSize.height}`}
      position={"relative"}
      style={{
        borderBottom: `1px solid ${theme.color.darkBlue}`,
      }}
    >
      <Flex
        align={"center"}
        width={"100%"}
        height={"100%"}
        style={{ textAlign: "end" }}
      >
        <MarketsList />

        <StyledSeparator orientation="vertical" size="4" />

        <Flex
          width={"97px"}
          direction="column"
          py={"12px"}
          pr={"12px"}
          pl={"2px"}
        >
          <Text weight="light" style={{ fontSize: "10px" }}>
            Price
          </Text>
          <Text>{currencyPrice}</Text>
        </Flex>

        <StyledSeparator orientation="vertical" size="4" />

        <Flex width={"97px"} direction={"column"} p={"12px"}>
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
        </Flex>

        <StyledSeparator orientation="vertical" size="4" />

        <Flex width={"195px"} direction={"column"} p={"12px"} align={"end"}>
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

        <StyledSeparator orientation="vertical" size="4" />
      </Flex>
    </Box>
  );
};

export default TradeHeader;
