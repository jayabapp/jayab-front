export type {
  PropertyListDto,
  RelatedLandings,
  SingleLandingDto,
} from "@/api_services/property/property.interface";

import type { PageMetaDto, PropertyListDto } from "@/api_services/property/property.interface";

export type PropertyDiscoveryFilters = Record<string, any>;

export type PropertyListPage = {
  data: PropertyListDto[];
  meta: PageMetaDto;
};

import type { ImageDto } from "@/api_services/auth/auth.interface";

export type PropertyPriceView = {
  discountPercentage?: number;
  discountedPrice?: number;
  price?: number;
};

/**
 * The trimmed, serializable slice of a listing that the interactive detail
 * islands need. The full DTO stays on the server, where the spec accordions read
 * it directly, so the nested option/description/pricing trees never cross the
 * client boundary.
 */
export type PropertyDetailsView = {
  advisorCommission?: number;
  buildingArea: number;
  city: string;
  code: string;
  favoriteCount: number;
  featureImage?: ImageDto | null;
  hasBlueTick: boolean;
  id: number;
  images: ImageDto[];
  isAuthorized: boolean;
  isChatEnabled: boolean;
  isPromoted: boolean;
  maxCapacity: number;
  ownerAvatar?: ImageDto | null;
  ownerName: string;
  province: string;
  region: string;
  remainingDays: number;
  slug: string;
  title: string;
  todayPrice: PropertyPriceView;
  totalBedrooms: number;
};
