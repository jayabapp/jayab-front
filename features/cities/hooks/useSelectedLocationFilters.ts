"use client";

import { usePathname, useRouter } from "next/navigation";
import { parseIdList } from "@features/cities/lib/city-selection";
import { useCitiesStore } from "@/store";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import isEmpty from "lodash/isEmpty";

type LocationEntry = { id: number | string; title?: string };
type LocationKey = "cities" | "provinces" | "regions";

/**
 * The location chips shown inside the search panel. The chip list is whatever the
 * cities store holds; toggling a chip rewrites the matching URL key and prunes the
 * store to match, so the store and the URL never disagree.
 */
export const useSelectedLocationFilters = (onNavigate?: () => void) => {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useQueryGet<Record<string, string>>();
  const { locationsData } = useCitiesStore();

  const applyQuery = (ids: string[], key: LocationKey) => {
    const body: Record<string, unknown> = { ...queries, [key]: ids };
    if (isEmpty(ids)) delete body[key];
    delete body.page;
    // Regions only make sense under the city they belong to, so any change to the
    // city or province set drops them instead of leaving an orphaned filter.
    if (key !== "regions") delete body.regions;
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
              regions: undefined,
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
