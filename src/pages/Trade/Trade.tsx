import { Flex, Box } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import { theme } from "../../theme/theme";
import TradeWidget from "./TradeWidget/TradeWidget";

const Trade = () => {
  return (
    <Flex direction="column" width={"100%"}>
      <TradeHeader />
      <Flex direction="column" gap="20px">
        <Flex height={"561px"} width={"100%"}>
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
