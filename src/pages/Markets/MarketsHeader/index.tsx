import { Flex, Text } from "@radix-ui/themes";
import {
  MarketHeaderContainer,
  StyledFlex,
  StyledText,
  SupplyChangeText,
} from "./market-header-styles";

const MarketsHeader = ({
  ovlSupplyChange,
}: {
  ovlSupplyChange: string | undefined;
}) => {
  const tokenTicker = "OVL";

  const getSupplyChangeColor = (change: string | undefined) => {
    if (!change) return "default";
    const numericChange = parseFloat(change);
    if (numericChange > 0) return "green";
    if (numericChange < 0) return "red";
    return "default";
  };

  const formatSupplyChange = (change: string | undefined) => {
    if (!change) return "0%";
    const numericChange = parseFloat(change);
    if (numericChange === 0) return "0%";
    const prefix = numericChange > 0 ? "+" : "";
    const value = change.endsWith("%") ? change : `${change}%`;
    return `${prefix}${value}`;
  };

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
            <SupplyChangeText
              $changeColor={getSupplyChangeColor(ovlSupplyChange)}
            >
              {formatSupplyChange(ovlSupplyChange)}
            </SupplyChangeText>
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
