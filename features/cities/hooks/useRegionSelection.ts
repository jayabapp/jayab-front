"use client";

import { matchesCitySearch, parseIdList } from "@features/cities/lib/city-selection";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { ChildCities } from "@/api_services/city/city.interface";
import type { RegionSelectionInput, RegionSelectionState } from "@/types/features/cities";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";

/**
 * Region selection mirrors {@link useCitySelection}: the URL owns the committed
 * value and the draft is dropped whenever the URL or the parent city changes.
 */
export const useRegionSelection = ({
  navigateUrl,
  cityWithRegions,
}: RegionSelectionInput): RegionSelectionState => {
  const router = useRouter();
  const pathname = usePathname();
  const queries = useQueryGet<Record<string, string>>();
  const regionsQuery = queries?.regions;

  const regions = useMemo(() => cityWithRegions?.child ?? [], [cityWithRegions]);

  const committedRegions = useMemo(() => {
    const ids = parseIdList(regionsQuery);
    if (ids.length === 0) return [];
    return ids
      .map((id) => regions.find((region) => `${region?.id}` === id))
      .filter((region): region is ChildCities => !!region);
  }, [regionsQuery, regions]);

  const selectionKey = `${regionsQuery ?? ""}|${cityWithRegions?.id ?? ""}`;
  const [draft, setDraft] = useState<{
    key: string;
    regions: ChildCities[] | null;
    search: string;
  }>({ key: selectionKey, regions: null, search: "" });

  if (draft.key !== selectionKey) {
    setDraft({ key: selectionKey, regions: null, search: "" });
  }

  const selectedRegions = draft.regions ?? committedRegions;

  const toggleRegion = (region: ChildCities) =>
    setDraft((current) => {
      const currentRegions = current.regions ?? committedRegions;
      return {
        ...current,
        key: selectionKey,
        regions: currentRegions.some((entry) => entry?.id === region?.id)
          ? currentRegions.filter((entry) => entry?.id !== region?.id)
          : [...currentRegions, region],
      };
    });

  const visibleRegions = useMemo(
    () => regions.filter((region) => matchesCitySearch(region, draft.search)),
    [regions, draft.search],
  );

  const submit = () => {
    const body: Record<string, unknown> = {
      ...queries,
      regions: selectedRegions.map((region) => region?.id),
    };
    delete body.page;
    if (navigateUrl) {
      router.push(`${navigateUrl}?${queryBuilder(body)}`);
      return;
    }
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return {
    regions,
    search: draft.search,
    selectedRegions,
    setSearch: (value: string) =>
      setDraft((current) => ({ ...current, key: selectionKey, search: value })),
    submit,
    toggleRegion,
    visibleRegions,
  };
};
