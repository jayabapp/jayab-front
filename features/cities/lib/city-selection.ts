import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";

import type { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";
import type { CityQueryValues, CitySelectionQuery } from "@/types/features/cities";

import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

export const parseIdList = (value?: string | number | null): string[] =>
  `${value ?? ""}`
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

/** Cities named directly by the `cities` query key, resolved against the loaded tree. */
export const resolveQueryCities = (
  provinces: NewCitiesListDto[] | undefined,
  citiesQuery?: string | number | null,
): ChildCities[] => {
  const ids = parseIdList(citiesQuery);
  if (ids.length === 0 || isEmpty(provinces)) return [];
  return (provinces ?? [])
    .flatMap((province) => province.child ?? [])
    .filter((city) => ids.includes(`${city.id}`));
};

/** Every child city of the provinces named by the `provinces` query key. */
export const resolveQueryProvinceCities = (
  provinces: NewCitiesListDto[] | undefined,
  provincesQuery?: string | number | null,
): ChildCities[] => {
  const ids = parseIdList(provincesQuery);
  if (ids.length === 0 || isEmpty(provinces)) return [];
  return (provinces ?? [])
    .filter((province) => ids.includes(`${province.id}`))
    .flatMap((province) => province.child ?? []);
};

export const resolveQueryProvinces = (
  provinces: NewCitiesListDto[] | undefined,
  provincesQuery?: string | number | null,
): NewCitiesListDto[] => {
  const ids = parseIdList(provincesQuery);
  if (ids.length === 0 || isEmpty(provinces)) return [];
  return (provinces ?? []).filter((province) => ids.includes(`${province.id}`));
};

export const matchesCitySearch = (
  item: { title?: string; child?: ChildCities[] },
  search: string,
): boolean => {
  const normalizedSearch = normalizePersianSearchText(search);
  if (!normalizedSearch) return true;
  return (
    normalizePersianSearchText(item?.title ?? "").includes(normalizedSearch) ||
    !!item?.child?.some((child) =>
      normalizePersianSearchText(child?.title ?? "").includes(normalizedSearch),
    )
  );
};

export const hasMatchingChild = (
  province: NewCitiesListDto,
  search: string,
): boolean => {
  const normalizedSearch = normalizePersianSearchText(search);
  if (!normalizedSearch) return false;
  return !!province?.child?.some((city) =>
    normalizePersianSearchText(city?.title ?? "").includes(normalizedSearch),
  );
};

/**
 * The label the city button shows. It is derived from the committed URL selection
 * — never from the in-modal draft — so closing the modal without submitting leaves
 * the trigger label untouched.
 */
export const buildCitySelectionTitle = (
  queryProvinces: NewCitiesListDto[],
  queryCities: ChildCities[],
): string => {
  if (queryProvinces.length === 1 && isEmpty(queryCities)) {
    return `${_STRINGS.PROVINCE} ${queryProvinces[0]?.title}`;
  }
  if (queryCities.length === 1 && isEmpty(queryProvinces)) {
    return `${queryCities[0]?.title}`;
  }
  if (!isEmpty(queryProvinces) || !isEmpty(queryCities)) {
    return `${queryCities.length + queryProvinces.length} ${_STRINGS.CITY}`;
  }
  return "";
};

/**
 * Collapses the selected cities back into the narrowest URL shape: a province id
 * whenever every one of its cities is selected, individual city ids otherwise.
 */
export const buildCitySelectionQuery = (
  provinces: NewCitiesListDto[] | undefined,
  selectedCities: ChildCities[],
  baseQuery: CityQueryValues,
): CitySelectionQuery => {
  const body: Record<string, unknown> = { ...baseQuery };
  const provinceList = provinces ?? [];
  const isSelected = (city: { id: number }) =>
    selectedCities.some((selected) => selected?.id === city?.id);

  const touchedProvinces = provinceList
    .filter((province) => province?.child?.some(isSelected))
    .map((province) => ({
      ...province,
      child: (province?.child ?? []).filter(isSelected),
    }));

  const fullySelectedProvinces = touchedProvinces.filter((province) => {
    const source = provinceList.find((entry) => entry?.id === province?.id);
    return source?.child?.length === province?.child?.length;
  });

  let storedCities: ChildCities[] = selectedCities;
  let storedProvinces: NewCitiesListDto[] = [];

  if (fullySelectedProvinces.length > 0) {
    storedProvinces = fullySelectedProvinces;
    const fullySelectedIds = fullySelectedProvinces.map((province) => province?.id);
    const remainingCities = touchedProvinces
      .filter((province) => !fullySelectedIds.includes(province?.id))
      .flatMap((province) => province?.child ?? []);

    storedCities = remainingCities;
    body.cities = remainingCities.map((city) => city?.id);
    body.provinces = fullySelectedProvinces.map((province) => province?.id);
  } else {
    body.cities = selectedCities.map((city) => city?.id);
    delete body.provinces;
  }

  delete body.page;
  delete body.regions;

  return { body, storedCities, storedProvinces };
};
