import { Box, Flex, Skeleton, Text } from "@radix-ui/themes";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/mousewheel";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import TradeMarketCard from "../../../components/MarketCards/TradeMarketCard";
import { useMarketsState } from "../../../state/markets/hooks";
import {
  CategoryName,
  MARKET_CATEGORIES,
  MARKETSORDER,
} from "../../../constants/markets";
import { formatPriceWithCurrency } from "../../../utils/formatPriceWithCurrency";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { MarketDataParsed } from "../../../types/marketTypes";

const SuggestedCards: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { markets } = useMarketsState();
  const { currentMarket } = useCurrentMarketState();

  const marketsData = markets && [...markets];
  const orderedMarketsData =
    marketsData &&
    marketsData.sort((a, b) => {
      return (
        MARKETSORDER.indexOf(a.marketId) - MARKETSORDER.indexOf(b.marketId)
      );
    });

  const findCategoryNameByMarketId = (
    marketId: string
  ): CategoryName | null => {
    for (const [category, marketIds] of Object.entries(MARKET_CATEGORIES)) {
      if (marketIds.includes(marketId)) {
        return category as CategoryName;
      }
    }
    return CategoryName.Other;
  };

  const filterMarketsByCategory = (
    marketsData: MarketDataParsed[],
    categoryName: CategoryName
  ): MarketDataParsed[] => {
    const marketIds = MARKET_CATEGORIES[categoryName];
    return marketsData.filter((market) => marketIds.includes(market.marketId));
  };

  const currentCategoryName = useMemo(() => {
    if (currentMarket) {
      return findCategoryNameByMarketId(currentMarket.marketId);
    } else return null;
  }, [currentMarket]);

  const similarMarkets = useMemo(() => {
    if (currentCategoryName && marketsData && currentMarket) {
      const filteredMarkets = filterMarketsByCategory(
        marketsData,
        currentCategoryName
      ).filter((market) => market.marketId !== currentMarket.marketId);
      return filteredMarkets;
    } else {
      return undefined;
    }
  }, [currentCategoryName, marketsData, currentMarket]);

  const extractFirstAbstract = (description: string | undefined): string => {
    if (!description) return "";
    const prefixes = [
      "TL;DR –",
      "TL:DR –",
      "TL:DR --",
      "TL;DR --",
      "TL;DR:",
      "TL:DR:",
      "TL;DR -",
      "TL:DR -",
    ];
    const abstracts = description.split("\\n");
    const firstAbstract = abstracts[0].trim();

    const matchingPrefix = prefixes.find((prefix) =>
      firstAbstract.startsWith(prefix)
    );

    const result = matchingPrefix
      ? firstAbstract.slice(matchingPrefix.length).trim()
      : firstAbstract;

    return result;
  };

  return (
    <Flex
      direction="column"
      p={{ initial: "0px 4px 66px", sm: "0px 8px 66px" }}
    >
      <Text style={{ color: "#8D8F94" }}>SUGGESTED</Text>
      <Flex direction={{ initial: "column", sm: "row" }} gap={"20px"}>
        <Skeleton height="257px" loading={!similarMarkets} />
        {similarMarkets && similarMarkets.length > 0 && (
          <Flex direction={"column"} width={"600px"} overflowX={"hidden"}>
            <Text weight={"bold"} size={"5"}>
              Similar To This Market
            </Text>
            <Box>
              <Swiper
                modules={[Navigation, Pagination, Mousewheel]}
                style={{
                  height: "280px",
                  paddingTop: "4px",
                }}
                spaceBetween={isMobile ? 12 : 20}
                slidesPerView={"auto"}
                loop={false}
                centeredSlides={false}
                enabled={similarMarkets.length > 0}
                mousewheel={true}
              >
                {similarMarkets.map((market, index) => (
                  <SwiperSlide key={index} style={{ width: "172px" }}>
                    <TradeMarketCard
                      id={market.marketId}
                      priceWithCurrency={formatPriceWithCurrency(
                        market.parsedMid ?? 0,
                        market.priceCurrency,
                        3
                      )}
                      title={market.marketName}
                      description={extractFirstAbstract(market.descriptionText)}
                      h24={"23.55%"}
                      funding={market.parsedDailyFundingRate}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Flex>
        )}
        <Skeleton height="257px" loading={!orderedMarketsData} />
        {orderedMarketsData && orderedMarketsData.length > 0 && (
          <Flex direction={"column"} width={"500px"} overflowX={"hidden"}>
            <Text weight={"bold"} size={"5"}>
              Top Markets
            </Text>
            <Box>
              <Swiper
                modules={[Navigation, Pagination, Mousewheel]}
                style={{
                  height: "280px",
                  paddingTop: "4px",
                }}
                spaceBetween={isMobile ? 12 : 20}
                slidesPerView={"auto"}
                loop={false}
                centeredSlides={false}
                enabled={orderedMarketsData.length > 0}
                mousewheel={true}
              >
                {orderedMarketsData.map((market, index) => (
                  <SwiperSlide key={index} style={{ width: "172px" }}>
                    <TradeMarketCard
                      id={market.marketId}
                      priceWithCurrency={formatPriceWithCurrency(
                        market.parsedMid ?? 0,
                        market.priceCurrency,
                        3
                      )}
                      title={market.marketName}
                      description={extractFirstAbstract(market.descriptionText)}
                      h24={"23.55%"}
                      funding={market.parsedDailyFundingRate}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default SuggestedCards;
