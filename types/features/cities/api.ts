export type { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";

import type { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";

export type CityQueryValues = Record<string, string | undefined>;

export type CitySelectionQuery = {
  body: Record<string, unknown>;
  storedCities: ChildCities[];
  storedProvinces: NewCitiesListDto[];
};

export type CitySelectionInput = {
  customValues?: CityQueryValues | null;
  enabled: boolean;
  navigateUrl?: string;
  skipEmptyNavigation?: boolean;
  onSubmitCustomValues?: ((updater: (current: any) => any) => void) | null;
};

export type CitySelectionState = {
  cities: ChildCities[];
  clearSelected: () => void;
  isLoading: boolean;
  provinces: NewCitiesListDto[] | undefined;
  regionCity: ChildCities | null;
  removeProvince: (province: NewCitiesListDto) => void;
  search: string;
  selectedCities: ChildCities[];
  selectedProvince: NewCitiesListDto | null;
  setSearch: (value: string) => void;
  setSelectedCities: (cities: ChildCities[]) => void;
  setSelectedProvince: (province: NewCitiesListDto | null) => void;
  submit: () => void;
  title: string;
  toggleCity: (city: ChildCities) => void;
  visibleProvinces: NewCitiesListDto[];
};

export type RegionSelectionInput = {
  cityWithRegions: ChildCities | null;
  navigateUrl?: string;
};

export type RegionSelectionState = {
  regions: ChildCities[];
  search: string;
  selectedRegions: ChildCities[];
  setSearch: (value: string) => void;
  submit: () => void;
  toggleRegion: (region: ChildCities) => void;
  visibleRegions: ChildCities[];
};
