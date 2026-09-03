export type {
  ContentByKeyDto,
  ContentDto,
  HomeLandingDto,
} from "@/api_services/home/home.interface";
export type {
  Content,
  PropertyListDto,
} from "@/api_services/property/property.interface";
export type { DeviceInfo } from "@/helpers/device.detector";
export type { HomeBannerDto } from "@/types/components/templates/home";

import type { HomeLandingDto } from "@/api_services/home/home.interface";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { HomeBannerDto } from "@/types/components/templates/home";
import type { ReactNode } from "react";

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

export type CityMarqueeRowProps = {
  children: ReactNode;
  /** Items in this row — the drift duration scales with it to keep speed even. */
  count: number;
  reverse?: boolean;
};

export type HomeCitiesProps = {
  data: HomeLandingDto[];
  title: string;
};

export type HomeHeroBannerProps = {
  banner?: HomeBannerDto;
  devices?: DeviceInfo;
  title?: string;
};

export type HomeTileCardProps = {
  href: string;
  imageSrc?: string;
  /** Position in the row — drives the entrance stagger, nothing else. */
  index?: number;
  title?: string;
};

export type HomeQuickSearchProps = {
  data: HomeLandingDto[];
  devices?: DeviceInfo;
  title: string;
};

export type HomePropertiesGridProps = {
  data: PropertyListDto[];
  devices?: DeviceInfo;
  middleBanner?: HomeBannerDto;
};

export type THomePropertyTypesProps = {
  title: string;
  devices?: DeviceInfo;
  data: HomeLandingDto[];
};
