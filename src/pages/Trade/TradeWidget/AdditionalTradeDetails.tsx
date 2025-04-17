import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { InfoIcon } from "../../../assets/icons/svg-icons";
import { useSearchParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useTradeState } from "../../../state/trade/hooks";
import useAccount from "../../../hooks/useAccount";
import { useEffect, useMemo, useState } from "react";
import { limitDigitsInDecimals, TradeStateData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

type AdditionalTradeDetailsProps = {
  tradeState?: TradeStateData;
};

const AdditionalTradeDetails: React.FC<AdditionalTradeDetailsProps> = ({
  tradeState,
}) => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { typedValue, slippageValue } = useTradeState();

  const [fee, setFee] = useState<number>(0);
  const [currencyEstLiquidationPrice, setCurrencyEstLiquidationPrice] =
    useState<string | undefined>(undefined);

  const estLiquidationPrice: number | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return Number(tradeState.liquidationPriceEstimate);
  }, [tradeState]);

  const expectedOi: string | undefined = useMemo(() => {
    if (!tradeState) return undefined;
    return limitDigitsInDecimals(tradeState.expectedOi);
  }, [tradeState]);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
  }, [marketId, chainId, sdk.trade]);

  useEffect(() => {
    estLiquidationPrice &&
      market &&
      typedValue &&
      setCurrencyEstLiquidationPrice(
        formatPriceWithCurrency(estLiquidationPrice, market.priceCurrency)
      );
    if (!address || !typedValue) {
      market &&
        setCurrencyEstLiquidationPrice(
          formatPriceWithCurrency(0, market.priceCurrency)
        );
    }
  }, [estLiquidationPrice, market, typedValue, address]);

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
          <Tooltip.Provider>
            <Tooltip.Root
              open={tooltipOpen}
              onOpenChange={setTooltipOpen}
              delayDuration={isMobile ? 0 : 200}
            >
              <Tooltip.Trigger asChild>
                <span
                  style={{ display: "inline-flex", cursor: "pointer" }}
                  onClick={() => isMobile && setTooltipOpen(!tooltipOpen)}
                >
                  <InfoIcon />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  style={{
                    backgroundColor: theme.color.grey4,
                    color: theme.color.grey1,
                    borderRadius: "6px",
                    padding: "10px 15px",
                    fontSize: "14px",
                    maxWidth: "250px",
                    lineHeight: "20px",
                    marginLeft: isMobile ? "15px" : undefined,
                  }}
                  sideOffset={5}
                  onPointerDownOutside={() => isMobile && setTooltipOpen(false)}
                >
                  This is the estimated Open Interest (OI) value that will be
                  assigned to your position once it is opened.
                  <Tooltip.Arrow style={{ fill: theme.color.grey4 }} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>
          {expectedOi && typedValue && address ? expectedOi : `-`}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AdditionalTradeDetails;
