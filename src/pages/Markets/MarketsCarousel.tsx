import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MarketCards from "../../components/MarketCards";
import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
  TransformedMarketData,
} from "overlay-sdk";
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
          marginTop: "50px",
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
              currency={market.priceCurrency}
              value={
                market.priceCurrency === "%"
                  ? toPercentUnit(market.price)
                  : toScientificNumber(
                      Number(market.price) < 100000
                        ? limitDigitsInDecimals(market.price)
                        : Math.floor(Number(market.price)).toLocaleString(
                            "en-US"
                          )
                    )
              }
              title={decodeURIComponent(market.marketId)}
            />
          </SwiperSlide>
        ))}
        {marketsData.length < 11 &&
          marketsData.map((market, index) => (
            <SwiperSlide key={index} style={{ width: "auto" }}>
              <MarketCards
                id={market.marketId}
                currency={market.priceCurrency}
                value={
                  market.priceCurrency === "%"
                    ? toPercentUnit(market.price)
                    : toScientificNumber(
                        Number(market.price) < 100000
                          ? limitDigitsInDecimals(market.price)
                          : Math.floor(Number(market.price)).toLocaleString(
                              "en-US"
                            )
                      )
                }
                title={decodeURIComponent(market.marketId)}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  );
};

export default Carousel;
