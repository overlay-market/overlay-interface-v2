import { Flex, Text, Box } from "@radix-ui/themes";
import { MarketInfoContainer } from "../Trade/TradeHeader/trade-header-styles";

const MarketsHeader = ({ ovSupply }: { ovSupply: number | undefined }) => {
  return (
    <MarketInfoContainer>
      <Flex direction="row" align={"center"} width={"100%"} height={"100%"}>
        <Flex width={"150px"} justify={"center"} direction="column" ml={"5"}>
          <Text>OV PRICE</Text>
          <Text>$~~</Text>
        </Flex>

        <Flex
          width={"114px"}
          height={"100%"}
          justify={"center"}
          direction="column"
          p={"12px"}
        >
          <Text>OV SUPPLY</Text>
          <Text>{ovSupply?.toString()}</Text>
        </Flex>

        <Box width={"150px"} display={"none"}>
          <Text>GOV</Text>
        </Box>
      </Flex>
    </MarketInfoContainer>
  );
};

export default MarketsHeader;
