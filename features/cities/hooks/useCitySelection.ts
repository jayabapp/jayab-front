"use client";

import {
  buildCitySelectionQuery,
  buildCitySelectionTitle,
  matchesCitySearch,
  resolveQueryCities,
  resolveQueryProvinceCities,
  resolveQueryProvinces,
} from "@features/cities/lib/city-selection";
import { cancelPropertyDiscoveryQueries } from "@features/properties/api/property-discovery.cache";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCitiesStore } from "@/store";
import { useCityTree } from "@features/cities/hooks/useCityTree";

import type { CitySelectionState } from "@/types/features/cities";
import type { CitySelectionInput } from "@/types/features/cities";
import type { NewCitiesListDto } from "@/api_services/city/city.interface";
import type { ChildCities } from "@/api_services/city/city.interface";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import isEmpty from "lodash/isEmpty";

export const useCitySelection = ({
  enabled,
  navigateUrl,
  customValues,
  skipEmptyNavigation,
  onSubmitCustomValues,
}: CitySelectionInput): CitySelectionState => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const urlQueries = useQueryGet<Record<string, string>>();
  const queries = customValues ?? urlQueries;
  const citiesQuery = queries?.cities;
  const provincesQuery = queries?.provinces;

  const { data: provinces, isLoading } = useCityTree(enabled);

  const queryCities = useMemo(
    () => resolveQueryCities(provinces, citiesQuery),
    [provinces, citiesQuery],
  );
  const queryProvinces = useMemo(
    () => resolveQueryProvinces(provinces, provincesQuery),
    [provinces, provincesQuery],
  );
  const queryProvinceCities = useMemo(
    () => resolveQueryProvinceCities(provinces, provincesQuery),
    [provinces, provincesQuery],
  );

  const committedSelection = useMemo(
    () => [...queryCities, ...queryProvinceCities],
    [queryCities, queryProvinceCities],
  );

  const selectionKey = `${enabled}|${citiesQuery ?? ""}|${provincesQuery ?? ""}`;
  const [draft, setDraft] = useState<{
    key: string;
    cities: ChildCities[] | null;
    province: NewCitiesListDto | null;
    search: string;
  }>({ key: selectionKey, cities: null, province: null, search: "" });

  if (draft.key !== selectionKey) {
    setDraft({ key: selectionKey, cities: null, province: null, search: "" });
  }

  const selectedCities = draft.cities ?? committedSelection;
  const selectedProvince = draft.province;
  const search = draft.search;

  const patchDraft = (
    patch: Partial<Omit<typeof draft, "key">> & {
      cities?: ChildCities[] | null;
    },
  ) => setDraft((current) => ({ ...current, key: selectionKey, ...patch }));

  const setSelectedCities = (cities: ChildCities[]) => patchDraft({ cities });

  const toggleCity = (city: ChildCities) =>
    setSelectedCities(
      selectedCities.some((entry) => entry?.id === city?.id)
        ? selectedCities.filter((entry) => entry?.id !== city?.id)
        : [...selectedCities, city],
    );

  const removeProvince = (province: NewCitiesListDto) =>
    setSelectedCities(
      selectedCities.filter(
        (entry) => !province?.child?.some((city) => city?.id === entry?.id),
      ),
    );

  const clearSelected = () => patchDraft({ cities: [], province: null });

  const cities = selectedProvince?.child ?? [];
  const visibleProvinces = useMemo(
    () =>
      (provinces ?? []).filter((province) =>
        matchesCitySearch(province, search),
      ),
    [provinces, search],
  );

  const title = useMemo(
    () => buildCitySelectionTitle(queryProvinces, queryCities),
    [queryProvinces, queryCities],
  );

  const regionCity = useMemo(
    () =>
      committedSelection.length === 1 && !isEmpty(committedSelection[0]?.child)
        ? committedSelection[0]
        : null,
    [committedSelection],
  );

  const submit = () => {
    if (onSubmitCustomValues) {
      onSubmitCustomValues((current: any) => ({
        ...current,
        cities: selectedCities.map((city) => city?.id),
      }));
      return;
    }

    const { body, storedCities, storedProvinces } = buildCitySelectionQuery(
      provinces,
      selectedCities,
      queries,
    );

    useCitiesStore.setState({
      locationsData: { cities: storedCities, provinces: storedProvinces },
    });

    cancelPropertyDiscoveryQueries(queryClient);

    if (navigateUrl) {
      const isEmptySelection = !body.provinces && isEmpty(body.cities);
      if (skipEmptyNavigation && isEmptySelection) return;
      router.push(`${navigateUrl}?${queryBuilder(body)}`);
      return;
    }
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return {
    cities,
    clearSelected,
    isLoading,
    provinces,
    regionCity,
    removeProvince,
    search,
    selectedCities,
    selectedProvince,
    setSearch: (value: string) => patchDraft({ search: value }),
    setSelectedCities,
    setSelectedProvince: (province: NewCitiesListDto | null) =>
      patchDraft({ province }),
    submit,
    title,
    toggleCity,
    visibleProvinces,
  };
};
