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

interface CarouselProps {
  marketsData: TransformedMarketData[];
}

const Carousel: React.FC<CarouselProps> = ({ marketsData }) => {
  if (!marketsData || marketsData.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      style={{
        height: "auto",
        margin: "50px 0px 0px 0px",
        padding: "0 50px",
      }}
      spaceBetween={10}
      slidesPerView="auto"
      loop={false}
      centeredSlides={false}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 0,
        },
        1440: {
          slidesPerView: 6,
          spaceBetween: 0,
        },
        1700: {
          slidesPerView: 7,
          spaceBetween: 0,
        },
        1900: {
          slidesPerView: 8,
          spaceBetween: 0,
        },
      }}
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
                      : Math.floor(Number(market.price)).toLocaleString("en-US")
                  )
            }
            title={decodeURIComponent(market.marketId)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
