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

const TradeWidget: React.FC = () => {
  const { selectedLeverage } = useTradeState();
  const { handleLeverageSelect } = useTradeActionHandlers();

  const capLeverage = 5;

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
