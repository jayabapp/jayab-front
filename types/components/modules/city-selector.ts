export type { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";

import type { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";
import type { Dispatch, SetStateAction } from "react";

export type CityModalProps = {
  customeValues?: Record<string, string> | null;
  isHome?: boolean;
  item?: { submitTitle?: string };
  onHide: () => void | null;
  onSubmitCustomeCB?: ((updater: (current: any) => any) => void) | null;
  onSubmitExtendedCB?: () => void | null;
  passedUrl?: string;
  setRegionsCb?: (city: ChildCities | null) => void | null;
  setTitle?: (title: string) => void | null;
  show: boolean;
};

export type RegionModalProps = {
  cityWithRegions: ChildCities | null;
  onHide: () => void | null;
  passedUrl?: string;
  show: boolean;
};

export type CitySelectorTitleProps = {
  cb: () => void | null;
  cityWithRegions: ChildCities | null;
  hideCityPart?: boolean;
  queries: Record<string, string>;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  showRegions?: boolean;
  title?: string;
};

export type RegionButtonProps = {
  containerClass?: string;
  onClearRegions: () => void;
  regionsIds?: string[];
  setShowRegions: Dispatch<SetStateAction<boolean>>;
};

export type CityCardProps = {
  callback: () => void | null;
  isChecked: boolean;
  item: ChildCities;
};

export type ProvinceCardProps = {
  callback: () => void | null;
  item: NewCitiesListDto;
};

export type CityModalHeaderProps = {
  onBack: () => void | null;
  onHide: () => void | null;
  selectedProvince: NewCitiesListDto | null;
};

export type CitySearchInputProps = {
  onChange: (value: string) => void;
  options?: { placeholder?: string };
  value: string;
};

export type CityModalAllCitiesButtonProps = {
  cities: ChildCities[] | undefined;
  onToggleAll: (cities: ChildCities[]) => void;
  selectedCities: ChildCities[];
};

export type SelectedCitiesSwiperProps = {
  clearSelected: () => void;
  onCityClick: (city: ChildCities) => void;
  onProvCancelClick: (province: NewCitiesListDto) => void;
  provinces: NewCitiesListDto[] | undefined;
  selectedCities: ChildCities[];
};

export type SelectedRegionChipsProps = {
  onRegionClick: (region: ChildCities) => void;
  selectedRegions: ChildCities[];
};

export type LocationChipProps = {
  onRemove: () => void;
  title?: string;
  prefix?: string;
};
