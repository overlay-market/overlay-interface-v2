import { Flex, Box } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import TradeWidget from "./TradeWidget";
import React, { useEffect } from "react";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import Chart from "./Chart";

const Trade: React.FC = () => {
  const { handleTradeStateReset } = useTradeActionHandlers();
  const marketId = "0x9d32d77c2213a5ff7b6e52669d32752cc092ff40";
  const longPrice = "17.1916".toString();
  const shortPrice = "17.0784".toString();

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
          px={{ initial: "20px", sm: "0" }}
        >
          <Chart
            marketId={marketId}
            longPrice={longPrice.replaceAll(",", "")}
            shortPrice={shortPrice.replaceAll(",", "")}
          />
          <TradeWidget />
        </Flex>
        <Box>Positions</Box>
      </Flex>
    </Flex>
  );
};

export default Trade;
