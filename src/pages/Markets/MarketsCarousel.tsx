import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MarketCards from "../../components/MarketCards";
import { TransformedMarketData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
import { Box, Skeleton, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { MARKETSORDER, EXCLUDEDMARKETS } from "../../constants/markets";

interface CarouselProps {
  marketsData: TransformedMarketData[];
  otherChainMarketsData?: TransformedMarketData[];
}

const Carousel: React.FC<CarouselProps> = ({
  marketsData,
  otherChainMarketsData,
}) => {
  const orderedMarketsData = marketsData.sort((a, b) => {
    return MARKETSORDER.indexOf(a.marketId) - MARKETSORDER.indexOf(b.marketId);
  });
  // Get a set of marketIds from the default chain to filter duplicates
  const defaultMarketIds = new Set(marketsData.map((m) => m.marketId));
  if (otherChainMarketsData) {
    console.log("Markets from BSC_TESTNET:", otherChainMarketsData);
  }
  return (
    <Box ml={{ xs: "16px" }} mt={"32px"}>
      <Text style={{ color: theme.color.grey3 }}>FEATURED</Text>
      <Skeleton height="257px" loading={marketsData.length < 1} />
      {(marketsData.length > 0 ||
        (otherChainMarketsData && otherChainMarketsData.length > 0)) && (
        <Swiper
          modules={[Navigation, Pagination, Mousewheel]}
          style={{
            height: "auto",
            marginTop: "4px",
          }}
          spaceBetween={12}
          slidesPerView="auto"
          loop={false}
          centeredSlides={false}
          enabled={
            marketsData.length > 0 ||
            (otherChainMarketsData && otherChainMarketsData.length > 0)
          }
          mousewheel={true}
        >
          {orderedMarketsData
            .filter((market) => !EXCLUDEDMARKETS.includes(market.marketId))
            .map((market, index) => (
              <SwiperSlide key={"default-" + index} style={{ width: "auto" }}>
                <MarketCards
                  id={market.marketId}
                  priceWithCurrency={formatPriceWithCurrency(
                    market.price ?? 0,
                    market.priceCurrency
                  )}
                  title={decodeURIComponent(market.marketId)}
                />
              </SwiperSlide>
            ))}
          {otherChainMarketsData &&
            otherChainMarketsData
              .filter((market) => !EXCLUDEDMARKETS.includes(market.marketId))
              .filter((market) => !defaultMarketIds.has(market.marketId))
              .map((market, index) => (
                <SwiperSlide key={"bsc-" + index} style={{ width: "auto" }}>
                  <MarketCards
                    id={market.marketId}
                    priceWithCurrency={formatPriceWithCurrency(
                      market.price ?? 0,
                      market.priceCurrency
                    )}
                    title={decodeURIComponent(market.marketId)}
                    isComingSoon={true}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      )}
    </Box>
  );
};

export default Carousel;
