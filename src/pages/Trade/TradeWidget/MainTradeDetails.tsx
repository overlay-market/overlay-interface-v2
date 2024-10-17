import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import SetSlippageModal from "../../../components/SetSlippageModal";
import { useTradeState } from "../../../state/trade/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useAccount from "../../../hooks/useAccount";
import useSDK from "../../../hooks/useSDK";
import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
  toWei,
} from "overlay-sdk";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const MainTradeDetails: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, selectedLeverage, isLong, slippageValue } =
    useTradeState();

  const [price, setPrice] = useState<string | undefined>(undefined);
  const [currencyPrice, setCurrencyPrice] = useState<string>("-");
  const [minPrice, setMinPrice] = useState<string | undefined>(undefined);
  const [currencyMinPrice, setCurrencyMinPrice] = useState<string>("-");
  const [priceImpact, setPriceImpact] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchPriceInfo = async () => {
      if (marketId && address && typedValue) {
        try {
          const priceInfo = await sdk.trade.getPriceInfo(
            marketId,
            toWei(typedValue),
            toWei(selectedLeverage),
            Number(slippageValue),
            isLong,
            8
          );

          priceInfo &&
            setPrice(limitDigitsInDecimals(priceInfo.price as number));
          priceInfo &&
            setMinPrice(limitDigitsInDecimals(priceInfo.minPrice as number));
          priceInfo && setPriceImpact(priceInfo.priceImpactPercentage);
        } catch (error) {
          console.error("Error fetching priceInfo:", error);
        }
      }
    };

    fetchPriceInfo();
  }, [marketId, address, typedValue, selectedLeverage, chainId, isLong]);

  useEffect(() => {
    price &&
      typedValue &&
      market &&
      setCurrencyPrice(
        `${market.priceCurrency}${
          market.priceCurrency === "%"
            ? toPercentUnit(price)
            : toScientificNumber(price)
        }`
      );
  }, [price, market, typedValue]);

  useEffect(() => {
    minPrice &&
      typedValue &&
      market &&
      setCurrencyMinPrice(
        `${market.priceCurrency}${
          market.priceCurrency === "%"
            ? toPercentUnit(minPrice)
            : toScientificNumber(minPrice)
        }`
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
