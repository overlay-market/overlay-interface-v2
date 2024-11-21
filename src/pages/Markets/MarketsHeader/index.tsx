import { Flex, Text, Box } from "@radix-ui/themes";
import { MarketHeaderContainer, StyledFlex } from "./market-header-styles";

const MarketsHeader = ({ ovSupply }: { ovSupply: number | undefined }) => {
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
          <Text>{ovSupply?.toString()}</Text>
        </StyledFlex>

        <StyledFlex width={"150px"} display={"none"}>
          <Text>GOV</Text>
        </StyledFlex>
      </Flex>
    </MarketHeaderContainer>
  );
};

export default MarketsHeader;
