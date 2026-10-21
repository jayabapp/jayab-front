export type { ContentByKeyDto } from "@/api_services/home/home.interface";
export type { PropertyListDto } from "@/api_services/property/property.interface";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { ContentByKeyDto } from "@/api_services/home/home.interface";
export type { HomeLandingDto } from "@/api_services/home/home.interface";
import type { HomeLandingDto } from "@/api_services/home/home.interface";
export type { HomeBannerDto } from "@/types/components/templates/home";
import type { HomeBannerDto } from "@/types/components/templates/home";
export type { ContentDto } from "@/api_services/home/home.interface";
import type { ContentDto } from "@/api_services/home/home.interface";
import type { DeviceInfo } from "@/helpers/device.detector";
export type { DeviceInfo } from "@/helpers/device.detector";
import type { ReactNode } from "react";
export type { Content } from "@/api_services/property/property.interface";

export type HomeActiveReservationsProps = {
  /** Rendered at the top of the orange block (the phone search pill), or alone when there are no requests. */
  top?: ReactNode;
};

export type HomeBannersProps = {
  banners?: HomeBannerDto[];
  devices?: DeviceInfo;
};

export type HomeImageCarouselProps = {
  devices?: DeviceInfo;
  item?: {
    imageClasses?: string;
    parentClass?: string;
    showCount?: number;
  };
  list: HomeBannerDto[];
};

export type HomeMiddleBannersProps = {
  cols?: number;
  containerClass?: string;
  list?: HomeBannerDto[];
};

export type HomeCitiesProps = {
  title: string;
  devices?: DeviceInfo;
  data: HomeLandingDto[];
};

export type TPropertyType = {
  index?: number;
  item: HomeLandingDto;
};

export type HomeHeroBannerProps = {
  title?: string;
  devices?: DeviceInfo;
  banners?: HomeBannerDto[];
};

export type HeroSlide = {
  key: string;
  alt: string;
  focus?: string;
  mobileSrc: string;
  desktopSrc: string;
  imageClasses?: string;
  contentId?: number | string;
};

export type HeroSlideImageProps = {
  slide: HeroSlide;
  isFirst: boolean;
  onLoad: () => void;
};

export type HomeTileCardProps = {
  href: string;
  title?: string;
  index?: number;
  imageSrc?: string;
};

export type HomeQuickSearchProps = {
  title: string;
  devices?: DeviceInfo;
  data: HomeLandingDto[];
};

export type HomePropertiesGridProps = {
  devices?: DeviceInfo;
  data: PropertyListDto[];
  middleBanner?: HomeBannerDto;
};

export type THomePropertyTypesProps = {
  title: string;
  devices?: DeviceInfo;
  data: HomeLandingDto[];
};

export type THomeContentSection = {
  options?: { parentPadding?: string };
  data: ContentDto | ContentByKeyDto | null;
};
