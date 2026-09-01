import type { ContentByKeyDto, HomeLandingDto } from "@/api_services/home/home.interface";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { DeviceInfo } from "@/helpers/device.detector";

export type HomeBannerDto = {
  brand_id?: number | null;
  category?: { id?: number; parent?: { id?: number } } | null;
  id: number;
  image: ImageDto;
  image_sm?: ImageDto | null;
  imageClasses?: string;
  link?: string | null;
  product?: { slug?: string } | null;
  property?: { slug?: string } | null;
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
