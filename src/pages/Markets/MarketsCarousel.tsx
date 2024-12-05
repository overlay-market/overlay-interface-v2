import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MarketCards from "../../components/MarketCards";
import { TransformedMarketData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
import { Box, Skeleton, Text } from "@radix-ui/themes";
import theme from "../../theme";

interface CarouselProps {
  marketsData: TransformedMarketData[];
}

const Carousel: React.FC<CarouselProps> = ({ marketsData }) => {
  return (
    <Box ml={{ xs: "16px" }} mt={"32px"}>
      <Text style={{ color: theme.color.grey3 }}>FEATURED</Text>
      <Skeleton height="257px" loading={marketsData.length < 1} />
      {marketsData.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          style={{
            height: "auto",
            marginTop: "4px",
          }}
          spaceBetween={12}
          slidesPerView="auto"
          loop={false}
          centeredSlides={false}
          enabled={marketsData.length > 0}
        >
          {marketsData
            .filter((_, index) => index !== 0 && index !== 5)
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
              .filter((_, index) => index !== 0 && index !== 5)
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
