import { Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useMemo } from "react";
import {
  useTradeActionHandlers,
  useTradeState,
} from "../../../state/trade/hooks";
import {
  LongPositionSelectButton,
  ShortPositionSelectButton,
  Triangle,
} from "./position-select-component-styles";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const PositionSelectComponent: React.FC = () => {
  const { currentMarket: market } = useCurrentMarketState();
  const { isLong } = useTradeState();
  const { handlePositionSideSelect } = useTradeActionHandlers();

  const handleSelectPositionSide = useCallback(
    (isLong: boolean) => {
      handlePositionSideSelect(isLong);
    },
    [handlePositionSideSelect]
  );

  const { longLabel, shortLabel } = useMemo(() => {
    return {
      longLabel: market?.buttons?.long ?? "Buy",
      shortLabel: market?.buttons?.short ?? "Sell",
    };
  }, [market]);

  return (
    <Flex height={"52px"} gap={"8px"}>
      <LongPositionSelectButton
        active={isLong.toString()}
        onClick={() => handleSelectPositionSide(true)}
        style={{ background: theme.color.grey4 }}
        aria-label={longLabel}
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Triangle $direction="up" />
        </Flex>
      </LongPositionSelectButton>
      <ShortPositionSelectButton
        active={isLong.toString()}
        onClick={() => handleSelectPositionSide(false)}
        style={{ background: theme.color.grey4 }}
        aria-label={shortLabel}
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Triangle $direction="down" />
        </Flex>
      </ShortPositionSelectButton>
    </Flex>
  );
};

export default PositionSelectComponent;
