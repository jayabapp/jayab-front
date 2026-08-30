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

export type SpecOptionProps = {
  title: string;
};

export type PropertyTermsBodyProps = {
  enabled?: boolean;
  className?: string;
  prologueClass?: string;
  property: SinglePropDto;
};

export type PropertyLocationRowProps = {
  latitude?: number;
  longitude?: number;
};

export type PropertyMapModalProps = {
  show: boolean;
  latitude?: number;
  longitude?: number;
  onHide: () => void | null;
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
