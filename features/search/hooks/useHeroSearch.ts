"use client";

import { usePropertyFilterCount } from "@features/properties/hooks/usePropertyFilterCount";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { HeroSearchDraft } from "@/types/features/search";

import queryBuilder from "@/helpers/queryBuilder";

/**
 * The hero's staged search.
 *
 * @param countEnabled Whether to ask how many properties the staged draft would
 * match. Off by default: on the desktop bar the answer is one click away and the
 * request would be pure overhead on every home-page visit. The mobile sheet
 * turns it on while it is open, because there the user commits to three
 * decisions before seeing a single result and "۰ اقامتگاه" is worth knowing
 * before the page transition, not after it.
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

  const hasCriteria = Boolean(
    draft.cities || draft.q?.trim() || draft.checkin || draft.total_guests,
  );

  // A resolved city id is a filter the list endpoint understands; a raw term is
  // not resolved yet, so it goes through `q` exactly as `/rooms` would send it.
  // Sending both would over-narrow the count against a search the user has not
  // actually run.
  const countFilters = useMemo(
    () => ({
      // A half-picked range is not a stay. Between the check-in tap and the
      // check-out tap the draft holds a `checkin` with no `checkout`, and
      // counting against that spends a request on a question the user is
      // visibly still answering — and gets back a number for a different stay
      // than the one they are choosing.
      checkin: draft.checkout ? draft.checkin : undefined,
      checkout: draft.checkout,
      total_guests: draft.total_guests || undefined,
      cities: draft.cities,
      q: draft.cities ? undefined : draft.q?.trim() || undefined,
    }),
    [draft.checkin, draft.checkout, draft.cities, draft.q, draft.total_guests],
  );

  const { count, isStale: isCountStale } = usePropertyFilterCount(
    countFilters,
    countEnabled && hasCriteria,
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
