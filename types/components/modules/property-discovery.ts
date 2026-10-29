import type { Dispatch, ReactNode, SetStateAction } from "react";
export type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ProvienceTypesDto } from "@/api_services/property/property.interface";
export type { SingleLandingDto } from "@/api_services/property/property.interface";
import type { SingleLandingDto } from "@/api_services/property/property.interface";
export type { RelatedLandings } from "@/api_services/property/property.interface";
import type { RelatedLandings } from "@/api_services/property/property.interface";
import type { ChildCities } from "@/api_services/city/city.interface";
export type { ChildCities } from "@/api_services/city/city.interface";
import type { DeviceInfo } from "@/helpers/device.detector";
export type { Question } from "@/api_services/property/property.interface";

export type DiscoveryExperienceProps = {
  title: string;
  content?: ReactNode;
  devices?: DeviceInfo;
  mode: "search" | "landing";
  baselineFilters?: Record<string, string>;
};

export type DiscoveryHeadingProps = {
  title: string;
  // One line for the results sheet's header on phones.
  compact?: boolean;
  query: Record<string, any>;
};

export type DiscoveryResultsProps = {
  clearLabel?: string;
  devices?: DeviceInfo;
  query: Record<string, any>;
  onClearFilters?: () => void;
};

export type DiscoveryFilterModalProps = {
  show: boolean;
  cityTitle?: string;
  onApply: () => void;
  onClose: () => void;
  hiddenFilters?: string[];
  setFilters: Dispatch<any>;
  onShowCityModal: () => void;
  queries: Record<string, any>;
  filters: Record<string, any>;
  onClearExtraFilters?: () => void;
  cityWithRegions: ChildCities | null;
  baselineFilters?: Record<string, string>;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  propertyTypes?: Record<string, ProvienceTypesDto[]>;
};

export type LandingContentProps = {
  data: SingleLandingDto;
};

export type LandingRelatedTagsProps = {
  data: RelatedLandings[];
};

export type THomeProper = {
  data: any[];
  middleBanner?: any;
  devices?: DeviceInfo;
};

export type TFeatureItem = {
  title: string;
  iconUrl: string;
  disabled?: boolean;
};

export type TPropertyGrid = {
  bannerItem: any;
  devices?: DeviceInfo;
};
