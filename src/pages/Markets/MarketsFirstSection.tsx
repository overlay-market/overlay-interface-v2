import { Box, Flex } from "@radix-ui/themes";
import { OptionalLinkBanner } from "../../components/Banner/OptionalLinkBanner";
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
    <Flex gap="3" ml="50px">
      <Box flexGrow="7" flexShrink="1" flexBasis="0%">
        <PromotedBanner
          Title={"CGMI"}
          Name={decodeURIComponent(marketsData[0].marketId)}
          Value={value}
          Image={marketsData[0].marketLogo}
        />
      </Box>
      <Box flexGrow="3" flexShrink="1" flexBasis="0%">
        <OptionalLinkBanner
          Title={"Governance"}
          Name={decodeURIComponent(marketsData[1].marketId)}
          Link={"Vote Now"}
        />
      </Box>
    </Flex>
  );
};
