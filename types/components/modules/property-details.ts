export type { SinglePropDto } from "@/api_services/property/property.interface";

import type { PropertyDetailsView } from "@/types/features/properties";
import type { SinglePropDto } from "@/api_services/property/property.interface";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { ReactNode } from "react";

export type PropertyDetailsContentProps = {
  devices?: DeviceInfo;
  property: SinglePropDto;
};

export type PropertyDetailsModalProps = {
  slug: string;
};

export type PropertyIntroductionProps = {
  property: PropertyDetailsView;
};

export type PropertySpecsProps = {
  devices?: DeviceInfo;
  property: SinglePropDto;
};

export type PropertySpecsSectionProps = {
  devices?: DeviceInfo;
  property: SinglePropDto;
};

export type SpecRowProps = {
  dots?: boolean;
  options?: { title_class?: string; value_class?: string };
  title: string;
  unit?: number | string;
  value?: number | string | null;
};

export type SpecOptionProps = {
  title: string;
};

export type PropertyTermsBodyProps = {
  className?: string;
  enabled?: boolean;
  prologueClass?: string;
  property: SinglePropDto;
};

export type PropertyLocationRowProps = {
  latitude?: number;
  longitude?: number;
};

export type PropertyMapModalProps = {
  latitude?: number;
  longitude?: number;
  onHide: () => void | null;
  show: boolean;
};

export type PropertyReportRowProps = {
  propertyId: number;
};

export type PropertyReportModalProps = {
  onHide: () => void;
  propertyId: number;
  show: boolean;
};

export type PropertyBookmarkButtonProps = {
  propertyId: number;
};

export type PropertyLikeButtonProps = {
  onCountChange: (delta: number) => void;
  propertyId: number;
};

export type PropertyOwnerBadgeProps = {
  avatar?: PropertyDetailsView["ownerAvatar"];
  name?: string;
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
