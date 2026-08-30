import type { Dispatch, SetStateAction } from "react";
export type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ChildCities } from "@/api_services/city/city.interface";

export type SelectedFiltersBarProps = {
  containerClass?: string;
  hiddenFilters?: string[];
  query: Record<string, string>;
  cityWithRegions: ChildCities | null;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Record<string, ProvienceTypesDto[]>;
  setFilterModalShow: Dispatch<SetStateAction<boolean>>;
};

export type SpecialFilterButtonsProps = {
  containerClass?: string;
  hiddenFilters?: string[];
  query: Record<string, string>;
};

export type SpecialFilterButtonProps = {
  isChecked: boolean;
  cb: () => void | null;
  item: { img: string; title: string };
};

export type SelectiveFilterChipProps = {
  title: string;
  queryKey: string;
  list: ProvienceTypesDto[];
  removeFiltersKeys: (keys: string[]) => void;
};

export type PropertyModelFilterProps = {
  query?: any;
  isMulty?: boolean;
  mobileFilters?: any;
  list: any[] | undefined;
  queryKey: number | string;
  onClickCb?: () => void | null;
  setMobileFilters?: Dispatch<any>;
};

export type RemovableFilterChipProps = {
  label: string;
  onRemove: () => void;
};

export type PoolFilterChipProps = {
  label: string;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

export type PropertyFilterDraft = Record<string, any>;

export type PropertyFilterFormProps = {
  hiddenFilters?: string[];
  filters: PropertyFilterDraft;
  queries: Record<string, string>;
  setFilters: Dispatch<PropertyFilterDraft>;
  propertyTypes?: Record<string, ProvienceTypesDto[]>;
};

export type PropertySortMenuProps = {
  query?: Record<string, string>;
};

export type DateFilterProps = {
  filters: PropertyFilterDraft;
  setFilters: Dispatch<any>;
};

export type FilterCheckProps = {
  title: string;
  queryKey: string;
  withBadge?: boolean;
  query?: PropertyFilterDraft;
  mobileFilters?: PropertyFilterDraft;
  setMobileFilters?: Dispatch<PropertyFilterDraft>;
};

export type FilterCounterProps = {
  title: string;
  queryKey: string;
  mobileFilters?: PropertyFilterDraft;
  setMobileFilters?: Dispatch<PropertyFilterDraft>;
  query?: Record<string, string | string[] | undefined>;
};

export type PriceRangeFilterProps = {
  steps?: number;
  lowerKey: string;
  upLimit?: number;
  higherKey: string;
  lowLimit?: number;
  setFilters?: Dispatch<any>;
  filters?: PropertyFilterDraft;
};

export type PropertyRulesFilterProps = {
  hiddenFilters?: string[];
  filters: PropertyFilterDraft;
  queries: Record<string, string>;
  setFilters: Dispatch<PropertyFilterDraft>;
  propertyTypes?: Record<string, { id: string | number; title: string }[]>;
};
