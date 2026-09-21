import type { PropertyDetailsView } from "@/types/features/properties";
import type { SinglePropDto } from "@/api_services/property/property.interface";
export type { SinglePropDto } from "@/api_services/property/property.interface";
import type { AmenityItem } from "@features/properties/mappers/amenities.mapper";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { ReactNode } from "react";
import type { IconName } from "@/types/components/elements/icon";

export type ListingSectionProps = {
  id: string;
  title: string;
  divider?: boolean;
  action?: ReactNode;
  children: ReactNode;
};

export type FactRowProps = {
  title: string;
  icon: IconName;
  summary?: ReadonlyArray<string | number | null | undefined>;
};

export type IconListItemProps = {
  label: string;
  state?: "on" | "off";
  image?: string | null;
};

export type RuleItemProps = {
  label: string;
  allowed: boolean;
  description?: string | null;
};

export type MiniInfoCardProps = {
  title: string;
  icon: IconName;
  className?: string;
  note?: string | null;
  value?: string | number | null;
};

export type ShowAllButtonProps = {
  label: string;
  onClick: () => void;
  count?: number | string;
};

export type ClampTextProps = {
  className?: string;
  children: ReactNode;
  lines?: 2 | 3 | 4 | 5 | 6;
};

export type ListingHeaderProps = {
  breadcrumbs: Array<{ link: string; title: string }>;
  property: PropertyDetailsView;
};

export type ListingActionsProps = {
  code: string;
  slug: string;
  propertyId: number;
  favoriteCount: number;
};

export type SectionTab = {
  id: string;
  label: string;
};

export type SectionTabsProps = {
  tabs: ReadonlyArray<SectionTab>;
};

export type AmenitiesModalProps = {
  show: boolean;
  onHide: () => void;
  amenities: AmenityItem[];
};

export type CancellationSummaryProps = {
  cancelingType?: SinglePropDto["canceling_type"];
};

export type LocationSectionProps = {
  place: string;
  latitude?: number;
  longitude?: number;
  approxLocation?: SinglePropDto["approx_location"];
};

export type LocationNavigateLinkProps = {
  latitude: number;
  longitude: number;
  className?: string;
};

export type HostCardProps = {
  name?: string;
  isAuthorized?: boolean;
  avatar?: PropertyDetailsView["ownerAvatar"];
  since?: PropertyDetailsView["ownerSince"];
  property: PropertyDetailsView;
};

export type PropertyDetailsContentProps = {
  devices?: DeviceInfo;
  property: SinglePropDto;
};

export type PropertySpecsProps = {
  devices?: DeviceInfo;
  property: SinglePropDto;
};

export type PropertySpecsSectionProps = {
  devices?: DeviceInfo;
  property: SinglePropDto;
};

export type SpecOptionProps = {
  title: string;
};

export type PropertyTermsBodyProps = {
  enabled?: boolean;
  className?: string;
  prologueClass?: string;
  property: SinglePropDto;
};

export type PropertyReportRowProps = {
  propertyId: number;
};

export type PropertyReportModalProps = {
  show: boolean;
  onHide: () => void;
  propertyId: number;
};

export type PropertyBookmarkButtonProps = {
  propertyId: number;
};

export type PropertyLikeButtonProps = {
  propertyId: number;
  onCountChange: (delta: number) => void;
};

export type PropertyOwnerBadgeProps = {
  name?: string;
  avatar?: PropertyDetailsView["ownerAvatar"];
};

export type PropertyPriceTagProps = {
  price: PropertyDetailsView["todayPrice"];
};

export type PropertyDetailsSkeletonProps = {
  children?: ReactNode;
};

export type TOptionGroup = {
  title: string;
  options?: string[];
};

export type PropertySummaryCardProps = {
  property: PropertyDetailsView;
};

export type PropertyDescriptionProps = {
  property: SinglePropDto;
};

export type TSimilarPropertiesProps = {
  city?: string;
  propertyId: number;
};

export type RelatedLandingLinksProps = {
  city?: string;
  seoLinks?: { villa?: string | null; pool?: string | null };
};
