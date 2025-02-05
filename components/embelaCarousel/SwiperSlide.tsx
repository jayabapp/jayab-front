"use client";
import React, { ReactNode } from "react";

type SwiperSlideType = {
  className?: string;
  children?: ReactNode;
  props?: any;
};

const SwiperSlide = ({ children, className, ...props }: SwiperSlideType) => {
  return (
    <div className={`    embla__slide   ${className} `} {...props}>
      {children}
    </div>
  );
};

export default SwiperSlide;
