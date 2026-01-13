import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import ProgramCard from "./ProgramCard";
import { PROGRAM_TIERS } from "../../constants/funded-trader";
import {
  CarouselSection,
  CarouselWrapper,
  CarouselContainer,
  SectionTitle,
} from "./funded-trader-styles";

const ProgramCarousel: React.FC = () => {
  return (
    <CarouselSection>
      <CarouselContainer>
        <SectionTitle>CHOOSE YOUR TEST</SectionTitle>
        <CarouselWrapper>
          <Swiper
            modules={[Navigation, Mousewheel, FreeMode]}
            style={{
              height: "auto",
              marginTop: "8px",
              paddingLeft: "16px",
              paddingRight: "16px",
              maxWidth: "100%",
            }}
            spaceBetween={12}
            slidesPerView="auto"
            loop={false}
            centeredSlides={false}
            freeMode={true}
            mousewheel={true}
          >
            {PROGRAM_TIERS.map((tier) => (
              <SwiperSlide key={tier.id} style={{ width: "auto" }}>
                <ProgramCard tier={tier} />
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselWrapper>
      </CarouselContainer>
    </CarouselSection>
  );
};

export default ProgramCarousel;
