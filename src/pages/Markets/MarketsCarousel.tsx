import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import futuristic1 from "../../assets/images/futuristic1.webp";
import MarketCards from "../../components/MarketCards";

const cardsData = [
  { image: futuristic1, title: "AI Index", value: "$94.21" },
  { image: futuristic1, title: "EV Commodity Index", value: "$8,462.61" },
  { image: futuristic1, title: "BTC Dominance", value: "54.53%" },
  { image: futuristic1, title: "CS 2 Skins Index", value: "$9.48 M" },
  { image: futuristic1, title: "Bitcoin Frogs", value: "₿ 0.035" },
  { image: futuristic1, title: "EV Commodity Index", value: "$8,462.61" },
  { image: futuristic1, title: "BTC Dominance", value: "54.53%" },
  { image: futuristic1, title: "CS 2 Skins Index", value: "$9.48 M" },
  { image: futuristic1, title: "Bitcoin Frogs", value: "₿ 0.035" },
  { image: futuristic1, title: "BTC Dominance", value: "54.53%" },
  { image: futuristic1, title: "CS 2 Skins Index", value: "$9.48 M" },
  { image: futuristic1, title: "Bitcoin Frogs", value: "₿ 0.035" },
  { image: futuristic1, title: "EV Commodity Index", value: "$8,462.61" },
  { image: futuristic1, title: "BTC Dominance", value: "54.53%" },
  { image: futuristic1, title: "CS 2 Skins Index", value: "$9.48 M" },
  { image: futuristic1, title: "Bitcoin Frogs", value: "₿ 0.035" },
];

const Carousel: React.FC = () => (
  <Swiper
    modules={[Navigation, Pagination]}
    style={{
      height: "auto",
      margin: "50px 0",
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
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      1536: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
    }}
  >
    {cardsData.map((card, index) => (
      <SwiperSlide key={index} style={{ width: "auto" }}>
        <MarketCards image={card.image} value={card.value} title={card.title} />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default Carousel;
