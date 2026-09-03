"use client";

import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { HeroSearchDraft } from "@/types/features/search";

import queryBuilder from "@/helpers/queryBuilder";

/**
 * The home hero's search: where, when, how many.
 *
 * Everything is staged and nothing navigates until submit. That matters here in
 * a way it did not for the old hero — picking a city used to jump straight to
 * `/rooms`, which made it impossible to also choose dates before leaving, so
 * the two filters that actually decide availability could only be applied after
 * landing on an unfiltered list.
 *
 * Submit takes one of two routes:
 *
 * - A place picked from the suggestions or the city modal already carries its
 *   own ids, so the URL is built directly and no request is needed.
 * - Free text still has to be resolved — "ویلا تبریز" means a city *and* a
 *   property type — so it goes through the same `/extract` call the rest of the
 *   app uses, with the dates and guests merged onto whatever it returns.
 */
export const useHeroSearch = () => {
  const router = useRouter();
  const [draft, setDraft] = useState<HeroSearchDraft>({});

  const { isPending, mutate } = usePropertySearch();

  const patch = useCallback(
    (next: Partial<HeroSearchDraft>) =>
      setDraft((current) => ({ ...current, ...next })),
    [],
  );

  /** Filters the free-text resolver cannot infer and must not overwrite. */
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
        `/rooms?${queryBuilder({ cities: draft.cities, ...explicitFilters })}`,
      );
      return;
    }

    if (term) {
      mutate({ q: term, extra: explicitFilters });
      return;
    }

    // Dates or guests on their own are still a narrower list than the bare
    // catalogue, so an empty "where" is a valid search rather than a no-op.
    router.push(`/rooms?${queryBuilder({ ...explicitFilters })}`);
  }, [draft.cities, draft.q, explicitFilters, mutate, router]);

  const clearDates = useCallback(
    () => patch({ checkin: undefined, checkout: undefined }),
    [patch],
  );

  return { clearDates, draft, isPending, patch, submit };
};
