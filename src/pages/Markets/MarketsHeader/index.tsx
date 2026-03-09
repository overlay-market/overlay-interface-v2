import { Flex, Text } from "@radix-ui/themes";
import {
  MarketHeaderContainer,
  StyledFlex,
  StyledText,
} from "./market-header-styles";

const MarketsHeader = ({
  ovlCurrentPrice,
}: {
  ovlCurrentPrice: number | undefined;
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
          <Text>${ovlCurrentPrice}</Text>
        </StyledFlex>

        <StyledFlex width={"150px"} display={"none"}>
          <StyledText>GOV</StyledText>
        </StyledFlex>
      </Flex>
    </MarketHeaderContainer>
  );
};

export default MarketsHeader;
