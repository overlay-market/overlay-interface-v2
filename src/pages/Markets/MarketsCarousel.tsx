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
}

const Carousel: React.FC<CarouselProps> = ({ marketsData }) => {
  const orderedMarketsData = marketsData.sort((a, b) => {
    return MARKETSORDER.indexOf(a.marketId) - MARKETSORDER.indexOf(b.marketId);
  });
  return (
    <Box ml={{ xs: "16px" }} mt={"32px"}>
      <Text style={{ color: theme.color.grey3 }}>FEATURED</Text>
      <Skeleton height="257px" loading={marketsData.length < 1} />
      {marketsData.length > 0 && (
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
          enabled={marketsData.length > 0}
          mousewheel={true}
        >
          {orderedMarketsData
            .filter((market) => !EXCLUDEDMARKETS.includes(market.marketId))
            .map((market, index) => (
              <SwiperSlide key={index} style={{ width: "auto" }}>
                <MarketCards
                  id={market.marketId}
                  priceWithCurrency={formatPriceWithCurrency(
                    market.price ?? 0,
                    market.priceCurrency,
                    3
                  )}
                  title={decodeURIComponent(market.marketId)}
                />
              </SwiperSlide>
            ))}
          {marketsData.length < 11 &&
            marketsData
              .filter((market) => !EXCLUDEDMARKETS.includes(market.marketId))
              .map((market, index) => (
                <SwiperSlide key={index} style={{ width: "auto" }}>
                  <MarketCards
                    id={market.marketId}
                    priceWithCurrency={formatPriceWithCurrency(
                      market.price ?? 0,
                      market.priceCurrency,
                      3
                    )}
                    title={decodeURIComponent(market.marketId)}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      )}
    </Box>
  );
};

export default Carousel;
