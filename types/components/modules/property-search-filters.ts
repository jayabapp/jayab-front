export type { ProvienceTypesDto } from "@/api_services/property/property.interface";

import type { ChildCities } from "@/api_services/city/city.interface";
import type { Dispatch, SetStateAction } from "react";
import type { ProvienceTypesDto } from "@/api_services/property/property.interface";

export type SelectedFiltersBarProps = {
  cityWithRegions: ChildCities | null;
  containerClass?: string;
  hiddenFilters?: string[];
  propertyTypes: Record<string, ProvienceTypesDto[]>;
  query: Record<string, string>;
  setFilterModalShow: Dispatch<SetStateAction<boolean>>;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
};

export type SpecialFilterButtonsProps = {
  containerClass?: string;
  hiddenFilters?: string[];
  query: Record<string, string>;
};

export type SpecialFilterButtonProps = {
  cb: () => void | null;
  isChecked: boolean;
  item: { img: string; title: string };
};

export type SelectiveFilterChipProps = {
  list: ProvienceTypesDto[];
  queryKey: string;
  removeFiltersKeys: (keys: string[]) => void;
  title: string;
};

export type PropertyModelFilterProps = {
  isMulty?: boolean;
  list: any[] | undefined;
  mobileFilters?: any;
  onClickCb?: () => void | null;
  query?: any;
  queryKey: number | string;
  setMobileFilters?: Dispatch<any>;
};

export type RemovableFilterChipProps = {
  label: string;
  onRemove: () => void;
};

export type PoolFilterChipProps = {
  isActive: boolean;
  label: string;
  onRemove: () => void;
  onSelect: () => void;
};
