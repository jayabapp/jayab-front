import type {
  ContentByKeyDto,
  HomeLandingDto,
} from "@/api_services/home/home.interface";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { ImageDto } from "@/api_services/auth/auth.interface";

export type HomeBannerDto = {
  id: number;
  title?: string;
  image: ImageDto;
  link?: string | null;
  imageClasses?: string;
  brand_id?: number | null;
  image_sm?: ImageDto | null;
  product?: { slug?: string } | null;
  property?: { slug?: string } | null;
  attachments?: { attachment: ImageDto }[] | null;
  category?: { id?: number; parent?: { id?: number } } | null;
};

export type HomeBannerGroups = Partial<Record<string, HomeBannerDto[]>>;

export type HomeLandings = {
  popular_city?: HomeLandingDto[];
  quick_search?: HomeLandingDto[];
};

export type HomeTemplateProps = {
  devices: DeviceInfo;
  properties: PropertyListDto[];
  landings?: HomeLandings | null;
  propertyTypes: HomeLandingDto[];
  banners?: HomeBannerGroups | null;
  homeContent?: ContentByKeyDto | null;
};
