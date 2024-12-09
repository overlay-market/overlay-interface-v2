import { Flex, Text } from "@radix-ui/themes";
import {
  MarketHeaderContainer,
  StyledFlex,
  StyledText,
} from "./market-header-styles";

const MarketsHeader = ({
  ovSupplyChange,
}: {
  ovSupplyChange: string | undefined;
}) => {
  return (
    <MarketHeaderContainer>
      <Flex direction="row" align={"center"} width={"100%"} height={"100%"}>
        <StyledFlex
          width={"150px"}
          justify={"center"}
          direction="column"
          ml={"5"}
        >
          <StyledText>OV PRICE</StyledText>
          <Text>$~~</Text>
        </StyledFlex>

        <StyledFlex
          width={"114px"}
          height={"100%"}
          justify={"center"}
          direction="column"
          p={"12px"}
        >
          <StyledText>OV SUPPLY</StyledText>
          <div>
            <Text>{ovSupplyChange}</Text>
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
