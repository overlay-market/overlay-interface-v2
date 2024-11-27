import { Box, Flex, Skeleton } from "@radix-ui/themes";
// import { OptionalLinkBanner } from "../../components/Banner/OptionalLinkBanner";
import { PromotedBanner } from "../../components/Banner/PromotedBanner";
import { TransformedMarketData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";

interface FirstSectionProps {
  marketsData: TransformedMarketData[];
}

export const FirstSection = ({ marketsData }: FirstSectionProps) => {
  return (
    <Flex
      gap="3"
      ml={{ sm: "16px", xs: "0" }}
      mt="5"
      direction={{
        initial: "column",
        xs: "row",
      }}
    >
      <Skeleton loading={marketsData.length < 0 + 1}>
        <Box flexGrow="7" flexShrink="1" flexBasis="0%">
          <PromotedBanner
            Title={"CGMI"}
            Name={decodeURIComponent(marketsData[0]?.marketId ?? "")}
            Value={formatPriceWithCurrency(
              marketsData[0]?.price ?? 0,
              marketsData[0]?.priceCurrency,
              3
            )}
            Id={marketsData[0]?.marketId ?? ""}
          />
        </Box>
      </Skeleton>
      <Skeleton loading={marketsData.length < 5 + 1}>
        <Box flexGrow="3" flexShrink="1" flexBasis="0%">
          <PromotedBanner
            Title={"CGMI"}
            Name={decodeURIComponent(marketsData[5]?.marketId ?? "")}
            Value={formatPriceWithCurrency(
              marketsData[5]?.price ?? 0,
              marketsData[5]?.priceCurrency,
              3
            )}
            Id={marketsData[5]?.marketId ?? ""}
          />
        </Box>
      </Skeleton>
      {/* <Box flexGrow="3" flexShrink="1" flexBasis="0%">
      <OptionalLinkBanner
      Title={"Governance"}
      Name={decodeURIComponent(marketsData[1].marketId ?? "")}
      Link={"Vote Now"}
      />
      </Box> */}
    </Flex>
  );
};
