"use client";

import React from "react";
import ImageCarousel from "../../shared/ImageCarousel";
import _STRINGS from "@/utils/LocalStrings";

type ImageCarouselTypes = {
  banners?: any[];
  fixed_banners?: any | null;
};
const BannersContainer = ({ banners, fixed_banners }: ImageCarouselTypes) => {
  return (
    <div
      className={`
    aspect-[2]     md:aspect-[6.5] 
    
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      <ImageCarousel item={{ showCount: 1.5 }} list={banners || []} />
    </div>
  );
};

export default BannersContainer;
