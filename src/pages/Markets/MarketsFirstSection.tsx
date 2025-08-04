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
      <Skeleton loading={!marketsData.length}>
        <Box flexGrow="7" flexShrink="1" flexBasis="0%">
          {(() => {
            const market = marketsData.find(
              (m) => m.marketId === "Counter-Strike%202%20Skins"
            );
            return (
              <PromotedBanner
                Name={decodeURIComponent(market?.marketId ?? "")}
                Value={formatPriceWithCurrency(
                  market?.price ?? 0,
                  market?.priceCurrency ?? ""
                )}
                Id={market?.marketId ?? ""}
              />
            );
          })()}
        </Box>
      </Skeleton>
      <Skeleton loading={!marketsData.length}>
        <Box flexGrow="3" flexShrink="1" flexBasis="0%">
          {(() => {
            const market = marketsData.find(
              (m) => m.marketId === "Counter-Strike%202%20Skins"
            );
            return (
              <PromotedBanner
                Name={decodeURIComponent(market?.marketId ?? "")}
                Value={formatPriceWithCurrency(
                  market?.price ?? 0,
                  market?.priceCurrency ?? ""
                )}
                Id={market?.marketId ?? ""}
              />
            );
          })()}
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
