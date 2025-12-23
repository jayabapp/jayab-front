"use client";
import { DeviceInfo } from "@/helpers/device.detector";
import ImageCarousel from "../../shared/ImageCarousel";

type ImageCarouselTypes = {
  banners?: any[];
  devices?: DeviceInfo;
};

const BannersContainer = ({ banners, devices }: ImageCarouselTypes) => {
  return (
    <div
      className={`
  
    
       w-full h-full  md:gap-3 lg:grid-cols-3  px-0  `}
    >
      <ImageCarousel devices={devices} item={{ showCount: 1.5 }} list={banners || []} />
    </div>
  );
};

export default BannersContainer;
