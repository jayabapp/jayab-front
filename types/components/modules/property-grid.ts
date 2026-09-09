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
  /**
   * Drops the seven-day availability strip. The listing page wants it — it is
   * what turns a result into a bookable date — but on the home page the card is
   * an invitation to look, not a booking surface, and the strip is the tallest
   * row on a card that has to sit above the fold.
   */
  hideWeekStatus?: boolean;
  /** Splits the card 50/50 instead of 60/40, so the photo leads. */
  largeMedia?: boolean;
};

export type PropertyShowcaseCardProps = {
  data: PropertyListDto;
  /** Position in the grid — drives the entrance stagger, nothing else. */
  index?: number;
};

/**
 * `detailed` is the listing card with its availability strip; `compact` is the
 * same card without it and with a larger photo; `showcase` is the photo-first
 * card. Threaded through the grid so callers do not have to drill individual
 * card props through three components.
 */
export type PropertyCardVariant = "detailed" | "compact" | "showcase";

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
  showDetailsIndicator?: boolean;
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
