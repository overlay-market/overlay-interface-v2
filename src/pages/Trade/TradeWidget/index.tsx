import { Flex } from "@radix-ui/themes";
import MainTradeDetails from "./MainTradeDetails";
import {
  useIsNewTxnHash,
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import AdditionalTradeDetails from "./AdditionalTradeDetails";
import TradeButtonComponent from "./TradeButtonComponent";
import PositionSelectComponent from "./PositionSelectComponent";
import CollateralInputComponent from "./CollateralInputComponent";
import useSDK from "../../../hooks/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { formatWeiToParsedNumber, toWei, TradeStateData } from "overlay-sdk";
import { useParams } from "react-router-dom";
import useMultichainContext from "../../../providers/MultichainContextProvider/useMultichainContext";
import useAccount from "../../../hooks/useAccount";
import Slider from "../../../components/Slider";

const TradeWidget: React.FC = () => {
  const { marketId } = useParams();
  const { chainId } = useMultichainContext();
  const { address } = useAccount();
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const isNewTxnHash = useIsNewTxnHash();
  const { typedValue, selectedLeverage, isLong, slippageValue } =
    useTradeState();
  const { handleLeverageSelect } = useTradeActionHandlers();
  const [loading, setLoading] = useState<boolean>(false);
  const [capLeverage, setCapleverage] = useState<number>(5);
  const [tradeState, setTradeState] = useState<TradeStateData | undefined>(
    undefined
  );

  useEffect(() => {
    let isCancelled = false; // Flag to track if the effect should be cancelled
    setLoading(false);

    const fetchTradeState = async () => {
      if (!typedValue || typedValue === "") {
        setTradeState(undefined);
        return;
      }

      if (marketId && address && typedValue !== "") {
        setLoading(true);

        try {
          const tradeState = await sdk.trade.getTradeState(
            marketId,
            toWei(typedValue),
            toWei(selectedLeverage),
            Number(slippageValue),
            isLong,
            address
          );
          if (!isCancelled && tradeState) {
            setTradeState(tradeState);
          }
        } catch (error) {
          console.error("Error fetching trade state:", error);
        } finally {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      }
    };

    fetchTradeState();

    // Cleanup function to cancel the fetch if conditions change
    return () => {
      isCancelled = true;
    };
  }, [
    marketId,
    address,
    typedValue,
    selectedLeverage,
    chainId,
    isLong,
    slippageValue,
    isNewTxnHash,
  ]);

  useEffect(() => {
    const fetchCapLeverage = async () => {
      if (market) {
        try {
          const capLeverage = await sdk.market.getCapLeverage(
            market.id as Address
          );
          const parsedCapLeverage = formatWeiToParsedNumber(capLeverage, 2);
          parsedCapLeverage && setCapleverage(parsedCapLeverage);
        } catch (error) {
          console.error("Error fetching capLeverage:", error);
        }
      }
    };

    fetchCapLeverage();
  }, [market]);

  const handleLeverageInput = (newValue: number[]) => {
    handleLeverageSelect(newValue[0].toString());
  };

  return (
    <Flex
      direction={"column"}
      gap={"24px"}
      width={"321px"}
      px={"8px"}
      pt={"8px"}
      pb={"20px"}
      flexShrink={"0"}
    >
      <PositionSelectComponent />

      <Slider
        title={"Leverage"}
        min={1}
        max={capLeverage ?? 1}
        step={0.1}
        value={Number(selectedLeverage)}
        valueUnit={"x"}
        handleChange={(newValue: number[]) => handleLeverageInput(newValue)}
      />

      <CollateralInputComponent />
      <MainTradeDetails tradeState={tradeState} />
      <TradeButtonComponent loading={loading} tradeState={tradeState} />
      <AdditionalTradeDetails tradeState={tradeState} />
    </Flex>
  );
};

export default TradeWidget;
