import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { InfoIcon } from "../../../assets/icons/svg-icons";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../hooks/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useTradeState } from "../../../state/trade/hooks";
import useAccount from "../../../hooks/useAccount";
import { useEffect, useState } from "react";
import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
  toWei,
} from "overlay-sdk";

const AdditionalTradeDetails: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, selectedLeverage, isLong, slippageValue } =
    useTradeState();

  const [fee, setFee] = useState<number>(0);
  const [estLiquidationPrice, setEstLiquidationPrice] = useState<string>("0");
  const [currencyEstLiquidationPrice, setCurrencyEstLiquidationPrice] =
    useState<string | undefined>(undefined);
  const [expectedOi, setExpectedOi] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchFee = async () => {
      if (marketId) {
        try {
          const fee = await sdk.trade.getFee(marketId);
          fee && setFee(fee);
        } catch (error) {
          console.error("Error fetching fee:", error);
        }
      }
    };
    fetchFee();
  }, [marketId, chainId]);

  useEffect(() => {
    const fetchLiquidationPriceEstimate = async () => {
      if (marketId && address) {
        try {
          const estLiqPrice = await sdk.trade.getLiquidationPriceEstimate(
            marketId,
            toWei(typedValue),
            toWei(selectedLeverage),
            isLong,
            8
          );
          estLiqPrice &&
            setEstLiquidationPrice(limitDigitsInDecimals(estLiqPrice));
        } catch (error) {
          console.error("Error fetching estLiqPrice:", error);
        }
      }
    };

    fetchLiquidationPriceEstimate();
  }, [marketId, address, typedValue, selectedLeverage, chainId, isLong]);

  useEffect(() => {
    const fetchExpectedOi = async () => {
      if (marketId && address && typedValue) {
        try {
          const expectedOi = await sdk.trade.getOiEstimate(
            marketId,
            toWei(typedValue),
            toWei(selectedLeverage),
            isLong,
            8
          );
          expectedOi &&
            setExpectedOi(
              toScientificNumber(limitDigitsInDecimals(expectedOi as string))
            );
        } catch (error) {
          console.error("Error fetching expected Oi:", error);
        }
      }
    };

    fetchExpectedOi();
  }, [marketId, address, typedValue, selectedLeverage, chainId, isLong]);

  useEffect(() => {
    estLiquidationPrice &&
      market &&
      typedValue &&
      setCurrencyEstLiquidationPrice(
        `${market.priceCurrency}${
          market.priceCurrency === "%"
            ? toPercentUnit(estLiquidationPrice)
            : toScientificNumber(estLiquidationPrice)
        }`
      );
    if (!address || !typedValue) {
      market && setCurrencyEstLiquidationPrice(`${market.priceCurrency}0`);
    }
  }, [estLiquidationPrice, market, typedValue, address]);

  useEffect(() => {
    if (!address || !typedValue) {
      setExpectedOi(undefined);
    }
  }, [address, typedValue]);

  return (
    <Flex direction={"column"} gap="8px">
      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Fee</Text>
        <Text style={{ color: theme.color.blue1 }}>{fee}%</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"8px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Slippage</Text>
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>{slippageValue}%</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Liquidation</Text>
        <Text style={{ color: theme.color.blue1 }}>
          {currencyEstLiquidationPrice}
        </Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"4px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Expected OI</Text>
          <InfoIcon />
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>
          {expectedOi && typedValue && address ? expectedOi : `-`}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AdditionalTradeDetails;
