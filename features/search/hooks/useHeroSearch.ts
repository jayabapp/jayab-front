"use client";

import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { HeroSearchDraft } from "@/types/features/search";

import queryBuilder from "@/helpers/queryBuilder";

export const useHeroSearch = () => {
  const router = useRouter();
  const [draft, setDraft] = useState<HeroSearchDraft>({});

  const { isPending, mutate } = usePropertySearch();

  const patch = useCallback(
    (next: Partial<HeroSearchDraft>) =>
      setDraft((current) => ({ ...current, ...next })),
    [],
  );

  const explicitFilters = useMemo(
    () => ({
      checkin: draft.checkin,
      checkout: draft.checkout,
      total_guests: draft.total_guests || undefined,
    }),
    [draft.checkin, draft.checkout, draft.total_guests],
  );

  const submit = useCallback(() => {
    const term = draft.q?.trim();

    if (draft.cities) {
      router.push(
        `${draft.landingUrl || "/rooms"}?${queryBuilder(
          draft.landingUrl
            ? explicitFilters
            : { cities: draft.cities, ...explicitFilters },
        )}`,
      );
      return;
    }
    if (term) {
      mutate({ q: term, extra: explicitFilters });
      return;
    }
    router.push(`/rooms?${queryBuilder({ ...explicitFilters })}`);
  }, [
    draft.cities,
    draft.landingUrl,
    draft.q,
    explicitFilters,
    mutate,
    router,
  ]);

  const clearDates = useCallback(
    () => patch({ checkin: undefined, checkout: undefined }),
    [patch],
  );

  return { clearDates, draft, isPending, patch, submit };
};
