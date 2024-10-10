import { Flex, Text, Box } from "@radix-ui/themes";
import theme from "../../theme";
import ProgressBar from "../../components/ProgressBar";
import MarketsDropdownList from "./MarketsDropdownList";
import { StyledSeparator } from "./trade-header-styles";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useSDK from "../../hooks/useSDK";
import { toWei } from "overlay-sdk/dist/common/utils/formatWei";
import { useTradeState } from "../../state/trade/hooks";
import { MarketData } from "../../types/marketTypes";
import {
  toPercentUnit,
  toScientificNumber,
} from "overlay-sdk/dist/common/utils";

export const limitDigitsInDecimals = (
  input: string | number | null | undefined,
  sigFig: number = 4
) => {
  if (Number(input) < 1) {
    return Number(input).toLocaleString("en-US", {
      maximumSignificantDigits: sigFig,
      minimumSignificantDigits: sigFig,
    });
  } else {
    return Number(input).toLocaleString("en-US", {
      maximumFractionDigits: sigFig,
      minimumFractionDigits: sigFig,
    });
  }
};

type TradeHeaderProps = {
  market: MarketData | undefined;
};

const TradeHeader: React.FC<TradeHeaderProps> = ({ market }) => {
  const { marketId } = useParams();
  const sdk = useSDK();
  const { typedValue, selectedLeverage, isLong } = useTradeState();
  const [price, setPrice] = useState<string>("");
  const [currencyPrice, setCurrencyPrice] = useState<string>("-");
  const [funding, setFunding] = useState<string>("-");
  const [long, setLong] = useState<number>(0);
  const [short, setShort] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchPrice = async () => {
      if (marketId) {
        try {
          const price = await sdk.trade.getPrice(
            marketId,
            toWei(typedValue),
            toWei(selectedLeverage),
            isLong,
            5
          );
          price && setPrice(limitDigitsInDecimals(price as string));
        } catch (error) {
          console.error("Error fetching price:", error);
        }
      }
    };

    fetchPrice();
  }, [marketId, typedValue, selectedLeverage, isLong]);

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
    market && setFunding(`${market.parsedDailyFundingRate}%`);
  }, [market]);

  const isFundingRatePositive = useMemo(() => {
    return Math.sign(Number(market?.parsedDailyFundingRate)) > 0;
  }, [market]);

  useEffect(() => {
    if (market?.parsedOiLong !== undefined)
      setLong(Number(market.parsedOiLong));
    if (market?.parsedOiShort !== undefined)
      setShort(Number(market.parsedOiShort));
  }, [market]);

  useEffect(() => setTotal(long + short), [long, short]);

  const defaultZero = "00.00";

  const shortPercentageOfTotalOi =
    Number.isFinite(short) && Number.isFinite(total) && total > 0
      ? ((short / total) * 100).toFixed(2)
      : defaultZero;

  const longPercentageOfTotalOi =
    Number.isFinite(long) && Number.isFinite(total) && total > 0
      ? ((long / total) * 100).toFixed(2)
      : defaultZero;

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
        <MarketsDropdownList />

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
            {funding}
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
