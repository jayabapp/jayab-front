export type { ChildCities } from "@/api_services/city/city.interface";
export type {
  ProvienceTypesDto,
  Question,
  RelatedLandings,
  SingleLandingDto,
} from "@/api_services/property/property.interface";

import type {
  ProvienceTypesDto,
  Question,
  RelatedLandings,
  SingleLandingDto,
} from "@/api_services/property/property.interface";
import type { ChildCities } from "@/api_services/city/city.interface";
import type { Dispatch, SetStateAction } from "react";
import type { DeviceInfo } from "@/helpers/device.detector";

export type PropertyDiscoveryProps = {
  devices?: DeviceInfo;
};

export type LandingDiscoveryProps = {
  devices?: DeviceInfo;
  landing: SingleLandingDto;
};

export type DiscoveryResultsProps = {
  devices?: DeviceInfo;
  query: Record<string, any>;
  /** Offered from the empty state so a dead-end result set is escapable. */
  onClearFilters?: () => void;
};

export type PropertyCategoryStripProps = {
  data: ProvienceTypesDto[] | undefined;
  propertyKey: string;
  query: Record<string, any>;
};

export type PropertyCategoryItemProps = {
  cb?: () => void | null;
  isSelected?: boolean;
  item: ProvienceTypesDto;
};

export type DiscoveryFilterModalProps = {
  filters: Record<string, any>;
  hiddenFilters?: string[];
  onApply: () => void;
  onClose: () => void;
  onShowCityModal: () => void;
  cityTitle?: string;
  cityWithRegions: ChildCities | null;
  onClearExtraFilters?: () => void;
  propertyTypes?: Record<string, ProvienceTypesDto[]>;
  queries: Record<string, any>;
  setFilters: Dispatch<any>;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  show: boolean;
};

export type LandingContentProps = {
  data: SingleLandingDto;
};

export type LandingRelatedTagsProps = {
  data: RelatedLandings[];
};

export type LandingFaqProps = {
  data: Question[];
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
