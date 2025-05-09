import { Box, Flex, Skeleton } from "@radix-ui/themes";
// import { OptionalLinkBanner } from "../../components/Banner/OptionalLinkBanner";
import { PromotedBanner } from "../../components/Banner/PromotedBanner";
import { TransformedMarketData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
interface FirstSectionProps {
  marketsData: TransformedMarketData[];
}

export const FirstSection = ({ marketsData }: FirstSectionProps) => {
  const marketForFirstBanner = marketsData.find(
    (m) => m.marketId === "Hikaru%20Nakamura"
  );

  const marketForSecondBanner = marketsData.find(
    (m) => m.marketId === "ETH%20Dominance"
  );

  return (
    <Flex
      gap="3"
      ml={{ sm: "16px", xs: "0" }}
      mt="5"
      direction={{ initial: "column", xs: "row" }}
    >
      <Skeleton
        height={{ initial: "150px", sm: "200px" }}
        width={"100%"}
        loading={!marketsData.length}
      >
        {marketForFirstBanner && (
          <Box flexGrow="7" flexShrink="1" flexBasis="0%">
            <PromotedBanner
              Name={decodeURIComponent(marketForFirstBanner?.marketId ?? "")}
              Value={formatPriceWithCurrency(
                marketForFirstBanner?.price ?? 0,
                marketForFirstBanner?.priceCurrency ?? "",
                Number(marketForFirstBanner?.price) > 10000 &&
                  Number(marketForFirstBanner?.price) < 1000000
                  ? 5
                  : 4
              )}
              Id={marketForFirstBanner?.marketId ?? ""}
            />
          </Box>
        )}
      </Skeleton>
      <Skeleton
        height={{ initial: "150px", sm: "200px" }}
        width={"100%"}
        loading={!marketsData.length}
      >
        {marketForSecondBanner && (
          <Box flexGrow="3" flexShrink="1" flexBasis="0%">
            <PromotedBanner
              Name={decodeURIComponent(marketForSecondBanner?.marketId ?? "")}
              Value={formatPriceWithCurrency(
                marketForSecondBanner?.price ?? 0,
                marketForSecondBanner?.priceCurrency ?? "",
                Number(marketForSecondBanner?.price) > 100 ? 5 : 4
              )}
              Id={marketForSecondBanner?.marketId ?? ""}
            />
          </Box>
        )}
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
