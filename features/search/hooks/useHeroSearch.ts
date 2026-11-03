"use client";

import { useCallback, useMemo, useState } from "react";
import { usePropertyFilterCount } from "@features/properties/hooks/usePropertyFilterCount";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useCitiesStore } from "@/store";
import { withQuery } from "@features/search/lib/search-url";
import { useRouter } from "next/navigation";

import type { HeroSearchDraft } from "@/types/features/search";

/**
 * The hero's staged search.
 * @param countEnabled
 */
export const useHeroSearch = (countEnabled = false) => {
  const router = useRouter();
  const [draft, setDraft] = useState<HeroSearchDraft>({});

  const { isPending, mutate } = usePropertySearch();

  const patch = useCallback(
    (next: Partial<HeroSearchDraft>) =>
      setDraft((current) => ({ ...current, ...next })),
    [],
  );

  const reset = useCallback(() => setDraft({}), []);

  const explicitFilters = useMemo(
    () => ({
      checkin: draft.checkin,
      checkout: draft.checkout,
      total_guests: draft.total_guests || undefined,
    }),
    [draft.checkin, draft.checkout, draft.total_guests],
  );

  const location = useMemo(
    () => ({
      cities: draft.cities,
      provinces: draft.provinces,
      regions: draft.regions,
    }),
    [draft.cities, draft.provinces, draft.regions],
  );
  const hasLocation = Boolean(draft.cities || draft.provinces || draft.regions);

  const hasCriteria = Boolean(
    hasLocation ||
    draft.propertyHref ||
    draft.landingUrl ||
    draft.q?.trim() ||
    draft.checkin ||
    draft.total_guests,
  );

  const countFilters = useMemo(
    () => ({
      checkin: draft.checkout ? draft.checkin : undefined,
      checkout: draft.checkout,
      total_guests: draft.total_guests || undefined,
      ...location,
      q: hasLocation ? undefined : draft.q?.trim() || undefined,
    }),
    [
      draft.checkin,
      draft.checkout,
      draft.q,
      draft.total_guests,
      hasLocation,
      location,
    ],
  );

  const isDestination = Boolean(
    draft.propertyHref || (draft.landingUrl && !hasLocation),
  );

  const { count, isStale: isCountStale } = usePropertyFilterCount(
    countFilters,
    countEnabled && hasCriteria && !isDestination,
  );

  const submit = useCallback(() => {
    const term = draft.q?.trim();

    if (draft.propertyHref) {
      router.push(withQuery(draft.propertyHref, explicitFilters));
      return;
    }

    if (hasLocation) {
      const path =
        draft.landingUrl && !draft.regions ? draft.landingUrl : "/rooms";
      useCitiesStore.setState((state) => ({
        locationsData: {
          ...state.locationsData,
          label: draft.cityTitle,
          path,
          query: location,
        },
      }));
      router.push(
        withQuery(
          path,
          path === "/rooms"
            ? { ...location, ...explicitFilters }
            : explicitFilters,
        ),
      );
      return;
    }

    if (draft.landingUrl) {
      router.push(withQuery(draft.landingUrl, explicitFilters));
      return;
    }

    if (term) {
      mutate({ q: term, extra: explicitFilters });
      return;
    }
    router.push(withQuery("/rooms", explicitFilters));
  }, [
    draft.cityTitle,
    draft.landingUrl,
    draft.propertyHref,
    draft.q,
    draft.regions,
    explicitFilters,
    hasLocation,
    location,
    mutate,
    router,
  ]);

  const clearDates = useCallback(
    () => patch({ checkin: undefined, checkout: undefined }),
    [patch],
  );

  return {
    clearDates,
    count,
    draft,
    hasCriteria,
    isCountStale,
    isPending,
    patch,
    reset,
    submit,
  };
};
