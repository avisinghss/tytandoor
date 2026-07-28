import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import heroSlides from "../../data/heroSlides";
import HeroContent from "./HeroContent";
import ScrollIndicator from "./ScrollIndicator";

export default function HeroSlider() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={true}
        speed={1500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="h-full min-h-[100dvh]"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[100dvh] w-full flex flex-col justify-center py-16 md:py-0 overflow-hidden">

              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover scale-100 animate-[zoomHero_8s_linear_forwards]"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/55"></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>

              {/* Hero Text */}
              <HeroContent slide={slide} />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hide ScrollIndicator on mobile screens to prevent UI overlap */}
      <div className="hidden md:block">
        <ScrollIndicator />
      </div>
    </section>
  );
}