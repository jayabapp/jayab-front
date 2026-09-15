"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCitiesStore } from "@/store";
import { parseIdList } from "@features/cities/lib/city-selection";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import isEmpty from "lodash/isEmpty";

type LocationEntry = {
  title?: string;
  id: number | string;
  parent_id?: number | string | null;
};

type LocationKey = "cities" | "provinces" | "regions";

export const useSelectedLocationFilters = (onNavigate?: () => void) => {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useQueryGet<Record<string, string>>();
  const { locationsData } = useCitiesStore();
  const currentRegionIds = parseIdList(queries?.regions);
  const regionsUnder = (cityIds: string[]) =>
    ((locationsData?.regions ?? []) as LocationEntry[]).filter(
      (region) =>
        cityIds.includes(`${region?.parent_id}`) &&
        currentRegionIds.includes(`${region?.id}`),
    );

  const applyQuery = (ids: string[], key: LocationKey) => {
    const body: Record<string, unknown> = { ...queries, [key]: ids };
    if (isEmpty(ids)) delete body[key];
    delete body.page;
    if (key !== "regions") {
      const keptRegions =
        key === "cities"
          ? regionsUnder(ids).map((region) => `${region.id}`)
          : [];
      if (keptRegions.length > 0) body.regions = keptRegions;
      else delete body.regions;
    }
    onNavigate?.();
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const toggle = (item: LocationEntry, key: LocationKey) => {
    const current = parseIdList(queries?.[key]);
    const id = `${item?.id}`;
    const next = current.includes(id)
      ? current.filter((entry) => entry !== id)
      : [...current, id];

    const stored = (locationsData?.[key] ?? []) as LocationEntry[];
    const nextStored = next
      .map((entry) => stored.find((value) => `${value?.id}` === entry))
      .filter(Boolean);

    useCitiesStore.setState({
      locationsData:
        key === "regions"
          ? { ...locationsData, regions: nextStored }
          : {
              ...locationsData,
              regions: key === "cities" ? regionsUnder(next) : undefined,
              [key]: nextStored,
            },
    });
    applyQuery(next, key);
  };

  return {
    cities: (locationsData?.cities ?? []) as LocationEntry[],
    provinces: (locationsData?.provinces ?? []) as LocationEntry[],
    regions: (locationsData?.regions ?? []) as LocationEntry[],
    hasSelection:
      !isEmpty(locationsData?.cities) ||
      !isEmpty(locationsData?.provinces) ||
      !isEmpty(locationsData?.regions),
    toggleCity: (item: LocationEntry) => toggle(item, "cities"),
    toggleProvince: (item: LocationEntry) => toggle(item, "provinces"),
    toggleRegion: (item: LocationEntry) => toggle(item, "regions"),
  };
};
