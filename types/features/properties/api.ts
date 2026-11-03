import type { PropertyTextLocales } from "@/api_services/property/property.interface";
import type { Locale } from "@/i18n/config";
export type { SingleLandingDto } from "@/api_services/property/property.interface";
export type { PropertyListDto } from "@/api_services/property/property.interface";
export type { RelatedLandings } from "@/api_services/property/property.interface";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { PageMetaDto } from "@/api_services/property/property.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";

export type PropertyDiscoveryFilters = Record<string, any>;

export type PropertyListPage = {
  data: PropertyListDto[];
  meta: PageMetaDto;
};

export type PropertyPriceView = {
  price?: number;
  discountedPrice?: number;
  discountPercentage?: number;
};

export type PropertyDetailsView = {
  id: number;
  city: string;
  code: string;
  slug: string;
  title: string;
  region: string;
  hasPool: boolean;
  province: string;
  ownerName: string;
  ownerNameLocale?: Locale;
  images: ImageDto[];
  maxCapacity: number;
  cleaningFee: number;
  isPromoted: boolean;
  stdCapacity: number;
  hasBlueTick: boolean;
  buildingArea: number;
  extraGuestFee: number;
  isAuthorized: boolean;
  remainingDays: number;
  totalBedrooms: number;
  favoriteCount: number;
  isChatEnabled: boolean;
  advisorCommission?: number;
  minimumPrice: number | null;
  ownerAvatar?: ImageDto | null;
  todayPrice: PropertyPriceView;
  featureImage?: ImageDto | null;
  hasActiveSubscription: boolean;
  ownerSince?: string | Date | null;
  textLocales?: PropertyTextLocales;
  seoLinks?: { villa?: string | null; pool?: string | null };
};
