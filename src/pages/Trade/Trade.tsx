import { Flex, Box } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";
import { theme } from "../../theme/theme";

const Trade = () => {
  return (
    <Flex direction="column" width={"100%"}>
      <TradeHeader />
      <Flex direction="column" gap="20px">
        <Flex height={"561px"} width={"100%"}>
          <Box flexGrow={"1"} style={{ background: `${theme.darkBlue}` }}>
            Chart
          </Box>
          <Box width={"321px"} style={{ background: `${theme.grey3}` }}>
            trade widget
          </Box>
        </Flex>
        <Box>Positions</Box>
      </Flex>
    </Flex>
  );
};

export default Trade;
