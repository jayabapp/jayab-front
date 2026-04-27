"use client";
import { ReactNode } from "react";

type SwiperSlideType = {
  className?: string;
  children?: ReactNode;
  props?: any;
};

const SwiperSlide = ({ children, className, ...props }: SwiperSlideType) => {
  return (
    <div className={`  !select-none  embla__slide   ${className} `} {...props}>
      {children}
    </div>
  );
};

export default SwiperSlide;
