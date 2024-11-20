import { Flex, Text, Box } from "@radix-ui/themes";
import theme from "../../theme";
import { MarketInfoContainer } from "../Trade/TradeHeader/trade-header-styles";

const MarketsHeader = ({ ovSupply }: { ovSupply: number | undefined }) => {
  return (
    <MarketInfoContainer>
      <Flex direction="row" align={"center"} width={"100%"} height={"100%"}>
        <Box width={"150px"}>
          <Text>OV PRICE</Text>
        </Box>

        <Flex
          width={"114px"}
          height={"100%"}
          justify={"center"}
          direction="column"
          p={"12px"}
          flexShrink={"0"}
          style={{
            borderRight: `1px solid ${theme.color.darkBlue}`,
          }}
        >
          <Text>OV SUPPLY</Text>
          <Text>{ovSupply?.toString()}</Text>
        </Flex>

        <Box width={"150px"}>
          <Text>GOV</Text>
        </Box>
      </Flex>
    </MarketInfoContainer>
  );
};

export default MarketsHeader;
