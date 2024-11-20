import { Box, Flex } from "@radix-ui/themes";
// import { OptionalLinkBanner } from "../../components/Banner/OptionalLinkBanner";
import { PromotedBanner } from "../../components/Banner/PromotedBanner";
import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
  TransformedMarketData,
} from "overlay-sdk";

interface FirstSectionProps {
  marketsData: TransformedMarketData[];
}

export const FirstSection = ({ marketsData }: FirstSectionProps) => {
  if (!marketsData || marketsData.length === 0) {
    return null;
  }

  const value =
    marketsData[0].priceCurrency === "%"
      ? toPercentUnit(marketsData[0].price)
      : toScientificNumber(
          Number(marketsData[0].price) < 100000
            ? limitDigitsInDecimals(marketsData[0].price)
            : Math.floor(Number(marketsData[0].price)).toLocaleString("en-US")
        );

  return (
    <Flex gap="3" ml="50px" mt="5">
      <Box flexGrow="7" flexShrink="1" flexBasis="0%">
        <PromotedBanner
          Title={"CGMI"}
          Name={decodeURIComponent(marketsData[0].marketId)}
          Value={value}
          Id={marketsData[0].marketId}
        />
      </Box>
      <Box flexGrow="3" flexShrink="1" flexBasis="0%">
        <PromotedBanner
          Title={"CGMI"}
          Name={decodeURIComponent(marketsData[5].marketId)}
          Value={value}
          Id={marketsData[5].marketId}
        />
      </Box>
      {/* <Box flexGrow="3" flexShrink="1" flexBasis="0%">
        <OptionalLinkBanner
          Title={"Governance"}
          Name={decodeURIComponent(marketsData[1].marketId)}
          Link={"Vote Now"}
        />
      </Box> */}
    </Flex>
  );
};
