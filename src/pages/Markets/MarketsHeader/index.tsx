import { Flex, Text } from "@radix-ui/themes";
import { MarketHeaderContainer, StyledFlex } from "./market-header-styles";

const MarketsHeader = ({ ovSupplyChange }: { ovSupplyChange: string | undefined }) => {
  return (
    <MarketHeaderContainer>
      <Flex direction="row" align={"center"} width={"100%"} height={"100%"}>
        <StyledFlex width={"150px"} justify={"center"} direction="column" ml={"5"}>
          <Text>OV PRICE</Text>
          <Text>$~~</Text>
        </StyledFlex>

        <StyledFlex
          width={"114px"}
          height={"100%"}
          justify={"center"}
          direction="column"
          p={"12px"}
        >
          <Text>OV SUPPLY</Text>
          <div>
            <Text>{ovSupplyChange}</Text>
            <Text> 24h</Text>
          </div>
        </StyledFlex>

        <StyledFlex width={"150px"} display={"none"}>
          <Text>GOV</Text>
        </StyledFlex>
      </Flex>
    </MarketHeaderContainer>
  );
};

export default MarketsHeader;
