"use client";

import type { CarouselSlideProps } from "@/types/components/elements/carousel";

const SwiperSlide = ({ children, className, ...props }: CarouselSlideProps) => {
  return (
    <div className={`  !select-none  embla__slide   ${className} `} {...props}>
      {children}
    </div>
  );
};

export default SwiperSlide;
