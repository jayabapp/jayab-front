export type { PropertyListDto, ReserveDaysDto } from "@/api_services/property/property.interface";

import type { PropertyListDto, ReserveDaysDto } from "@/api_services/property/property.interface";
import type { HomeBannerDto } from "@/types/components/templates/home";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { ReactNode } from "react";

export type WeekDayEntry = { id: number; title: string } | undefined;

/** The active search's stay params, forwarded from the card link to the
 * single-listing page (FL-02) so it never asks the visitor to pick dates and
 * guests again. */
export type PropertyCardSearchParams = {
  checkin?: string;
  checkout?: string;
  total_guests?: string;
};

export type PropertyCardProps = {
  data: PropertyListDto;
  isOwner?: boolean;
  searchParams?: PropertyCardSearchParams;
  onPhotoUpgradeClick?: (property: PropertyListDto) => void;
};

export type PublicPropertyCardProps = {
  data: PropertyListDto;
  goToLink: string;
};

export type PropertyGridItemsProps = {
  banners?: HomeBannerDto[];
  data: PropertyListDto[];
  devices?: DeviceInfo;
  searchParams?: PropertyCardSearchParams;
};

export type PropertyGridProps = PropertyGridItemsProps & {
  className?: string;
};

export type PropertyGridSkeletonProps = {
  className?: string;
  count?: number;
};

export type PropertyCardLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  title?: string;
};

export type PropertyCardLikesProps = {
  favoriteCount?: number;
  propertyId: number;
  forceFilled?: boolean;
};

export type PropertyCardFeaturesProps = {
  data: PropertyListDto;
};

export type PropertyCardOwnerActionsProps = {
  data: PropertyListDto;
  goToLink: string;
};

export type PropertyAuthorizationStatusProps = {
  data?: { id?: number | string };
  isAuthorized?: boolean;
};

export type PropertyPriceProps = {
  containerClass?: string;
  emphasis?: boolean;
  data: { discount_percentage?: number; discounted_price?: number; price?: number };
  ribbon?: {
    ribbon_bg_color?: string;
    ribbon_title?: string;
    ribbon_title_color?: string;
  };
};

export type DaysOfTheWeekStatusProps = {
  data: ReserveDaysDto[];
  isCard?: boolean;
  week: WeekDayEntry[];
};
