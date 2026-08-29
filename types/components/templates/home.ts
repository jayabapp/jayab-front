import type { ContentByKeyDto, HomeLandingDto } from "@/api_services/home/home.interface";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { DeviceInfo } from "@/helpers/device.detector";

export type HomeBannerDto = {
  id: number;
  image: ImageDto;
  image_sm?: ImageDto | null;
  imageClasses?: string;
  title?: string;
};

export type HomeBannerGroups = Partial<Record<string, HomeBannerDto[]>>;

export type HomeLandings = {
  popular_city?: HomeLandingDto[];
  quick_search?: HomeLandingDto[];
};

export type HomeTemplateProps = {
  banners?: HomeBannerGroups | null;
  devices: DeviceInfo;
  homeContent?: ContentByKeyDto | null;
  landings?: HomeLandings | null;
  properties: PropertyListDto[];
  propertyTypes: HomeLandingDto[];
};
