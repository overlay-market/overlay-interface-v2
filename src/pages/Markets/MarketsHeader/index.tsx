import { Flex, Text } from "@radix-ui/themes";
import {
  MarketHeaderContainer,
  StyledFlex,
  StyledText,
} from "./market-header-styles";

const MarketsHeader = ({
  ovlSupplyChange,
}: {
  ovlSupplyChange: string | undefined;
}) => {
  const tokenTicker = "OVL";
  return (
    <MarketHeaderContainer>
      <Flex direction="row" align={"center"} width={"100%"} height={"100%"}>
        <StyledFlex
          width={"150px"}
          justify={"center"}
          direction="column"
          ml={"5"}
        >
          <StyledText>{tokenTicker} PRICE</StyledText>
          <Text>$~~</Text>
        </StyledFlex>

        <StyledFlex
          width={"114px"}
          height={"100%"}
          justify={"center"}
          direction="column"
          p={"12px"}
        >
          <StyledText>{tokenTicker} SUPPLY</StyledText>
          <div>
            <Text>{ovlSupplyChange}</Text>
            <Text> 24h</Text>
          </div>
        </StyledFlex>

        <StyledFlex width={"150px"} display={"none"}>
          <StyledText>GOV</StyledText>
        </StyledFlex>
      </Flex>
    </MarketHeaderContainer>
  );
};

export default MarketsHeader;
