import { Flex, Text } from "@radix-ui/themes";
import {
  MarketHeaderContainer,
  StyledFlex,
  StyledText,
  SupplyChangeText,
} from "./market-header-styles";

const MarketsHeader = ({
  ovlSupplyChange,
  ovlCurrentPrice,
}: {
  ovlSupplyChange: number | undefined;
  ovlCurrentPrice: number | undefined;
}) => {
  const tokenTicker = "OVL";

  const getSupplyChangeColor = (change: number | undefined) => {
    if (change === undefined) return "default";
    // Negative change means tokens burned (supply decreased) - show green (good)
    if (change < 0) return "green";
    // Positive change means tokens minted (supply increased) - show red (inflation)
    if (change > 0) return "red";
    return "default";
  };

  const formatSupplyChange = (change: number | undefined) => {
    if (change === undefined) return "0 OVL";
    if (change === 0) return "0 OVL";

    const absChange = Math.abs(change);
    let formatted: string;

    // Format large numbers with abbreviations
    if (absChange >= 1_000_000) {
      formatted = (absChange / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "M";
    } else if (absChange >= 1_000) {
      formatted = (absChange / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "K";
    } else {
      formatted = absChange.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }

    // Show the actual change: negative = burned (good), positive = minted (inflation)
    const prefix = change > 0 ? "+" : "-";
    return `${prefix}${formatted} OVL`;
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
          <Text>${ovlCurrentPrice}</Text>
        </StyledFlex>

        <StyledFlex
          width={"130px"}
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
