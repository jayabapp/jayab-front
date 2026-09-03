export type { PropertyListDto, ReserveDaysDto } from "@/api_services/property/property.interface";

import type { PropertyListDto, ReserveDaysDto } from "@/api_services/property/property.interface";
import type { HomeBannerDto } from "@/types/components/templates/home";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { ReactNode } from "react";

export type WeekDayEntry = { id: number; title: string } | undefined;

export type PropertyCardProps = {
  data: PropertyListDto;
  isOwner?: boolean;
  onPhotoUpgradeClick?: (property: PropertyListDto) => void;
  week?: WeekDayEntry[];
};

export type PropertyShowcaseCardProps = {
  data: PropertyListDto;
  /** Position in the grid — drives the entrance stagger, nothing else. */
  index?: number;
};

export type PropertyCardVariant = "detailed" | "showcase";

export type PropertyGridItemsProps = {
  banners?: HomeBannerDto[];
  data: PropertyListDto[];
  devices?: DeviceInfo;
  variant?: PropertyCardVariant;
  week?: WeekDayEntry[];
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
