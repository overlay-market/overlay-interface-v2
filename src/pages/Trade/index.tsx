import { Flex, Box } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import theme from "../../theme";
import TradeWidget from "./TradeWidget";
import React, { useEffect } from "react";
import { useTradeActionHandlers } from "../../state/trade/hooks";

const Trade: React.FC = () => {
  const { handleTradeStateReset } = useTradeActionHandlers();
  const marketId = "";

  useEffect(() => {
    handleTradeStateReset();
  }, [marketId, handleTradeStateReset]);

  return (
    <Flex direction="column" width={"100%"}>
      <TradeHeader />
      <Flex direction="column" gap="20px">
        <Flex
          height={{ initial: "auto", sm: "561px" }}
          width={"100%"}
          direction={{ initial: "column-reverse", sm: "row" }}
          align={{ initial: "center", sm: "start" }}
        >
          <Box flexGrow={"1"} style={{ background: `${theme.color.darkBlue}` }}>
            Chart
          </Box>
          <TradeWidget />
        </Flex>
        <Box>Positions</Box>
      </Flex>
    </Flex>
  );
};

export default Trade;
