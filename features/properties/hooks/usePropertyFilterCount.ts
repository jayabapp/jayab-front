"use client";

import { propertyCountOptions } from "@features/properties/api/property.options";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { PropertyFilterDraft } from "@/types/components/modules/property-search-filters";

import queryBuilder from "@/helpers/queryBuilder";

/**
 * A checkbox is cheap to tick and the list endpoint is not cheap to answer, so
 * the draft is held still for a beat before it is asked about. Long enough that
 * running down a list of amenities produces one request instead of six; short
 * enough that a single deliberate tick still feels answered.
 */
const COUNT_DEBOUNCE_MS = 500;

/**
 * The number of properties the currently staged (unsubmitted) filters match.
 *
 * The draft is serialised before it is debounced. Debouncing the object itself
 * would be useless — `setFilters` hands back a fresh object on every keystroke,
 * so the reference always differs and the timer would restart forever without
 * the values having changed.
 */
export const usePropertyFilterCount = (
  draft: PropertyFilterDraft,
  enabled = true,
) => {
  const serialized = queryBuilder({ ...draft, page: undefined });
  const debounced = useDebouncedValue(serialized, COUNT_DEBOUNCE_MS);

  // Rebuilt from the settled string rather than captured from `draft`, so the
  // request can never carry values newer than the ones that were debounced.
  const settled = useMemo(
    () => Object.fromEntries(new URLSearchParams(debounced)),
    [debounced],
  );

  const { data, isFetching } = useQuery(propertyCountOptions(settled, enabled));

  return {
    count: data,
    // True while the user is still typing or ticking and the answer on screen
    // belongs to an older draft.
    isStale: isFetching || serialized !== debounced,
  };
};
