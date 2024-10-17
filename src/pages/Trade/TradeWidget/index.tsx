import { Flex } from "@radix-ui/themes";
import MainTradeDetails from "./MainTradeDetails";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import AdditionalTradeDetails from "./AdditionalTradeDetails";
import TradeButtonComponent from "./TradeButtonComponent";
import LeverageSlider from "../../../components/LeverageSlider";
import PositionSelectComponent from "./PositionSelectComponent";
import CollateralInputComponent from "./CollateralInputComponent";
import useSDK from "../../../hooks/useSDK";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { formatWeiToParsedNumber } from "overlay-sdk";

const TradeWidget: React.FC = () => {
  const sdk = useSDK();
  const { currentMarket: market } = useCurrentMarketState();
  const { selectedLeverage } = useTradeState();
  const { handleLeverageSelect } = useTradeActionHandlers();

  const [capLeverage, setCapleverage] = useState<number>(5);

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

      <LeverageSlider
        min={1}
        max={capLeverage ?? 1}
        step={0.1}
        value={Number(selectedLeverage)}
        handleChange={(newValue: number[]) => handleLeverageInput(newValue)}
      />

      <CollateralInputComponent />
      <MainTradeDetails />
      <TradeButtonComponent />
      <AdditionalTradeDetails />
    </Flex>
  );
};

export default TradeWidget;
