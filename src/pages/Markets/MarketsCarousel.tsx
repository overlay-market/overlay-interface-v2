import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MarketCards from "../../components/MarketCards";
import { TransformedMarketData } from "overlay-sdk";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
import { Box } from "@radix-ui/themes";

interface CarouselProps {
  marketsData: TransformedMarketData[];
}

const Carousel: React.FC<CarouselProps> = ({ marketsData }) => {
  if (!marketsData || marketsData.length === 0) {
    return null;
  }

  return (
    <Box ml={{ xs: "16px" }}>
      <Swiper
        modules={[Navigation, Pagination]}
        style={{
          height: "auto",
          margin: "50px 0px 0px 0px",
        }}
        spaceBetween={12}
        slidesPerView="auto"
        loop={false}
        centeredSlides={false}
      >
        {marketsData.map((market, index) => (
          <SwiperSlide key={index} style={{ width: "auto" }}>
            <MarketCards
              id={market.marketId}
              priceWithCurrency={formatPriceWithCurrency(market.price ?? 0, market.priceCurrency, 3)}
              title={decodeURIComponent(market.marketId)}
            />
          </SwiperSlide>
        ))}
        {marketsData.length < 11 &&
          marketsData.map((market, index) => (
            <SwiperSlide key={index} style={{ width: "auto" }}>
              <MarketCards
                id={market.marketId}
                priceWithCurrency={formatPriceWithCurrency(market.price ?? 0, market.priceCurrency, 3)}
                title={decodeURIComponent(market.marketId)}
              />
            </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Carousel;
