"use client";
import type { HomeBannersProps } from "@/types/components/modules/home";

import ImageCarousel from "@/components/shared/ImageCarousel";

const BannersContainer = ({ banners, devices }: HomeBannersProps) => {
  return (
    <div
      className={`
  
    
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      <ImageCarousel devices={devices} list={banners || []} />
    </div>
  );
};

export default BannersContainer;
