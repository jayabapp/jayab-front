"use client";

import type { SearchQueryParamSyncProps } from "@/types/components/modules/search";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Reports the `q` search param to the panel exactly once per distinct value.
 *
 * Reading `useSearchParams` suspends, so this stays a leaf under its own
 * `<Suspense>` boundary instead of forcing the whole panel to be client-rendered.
 */
const SearchQueryParamSync = ({ onSearchParam, queryKey = "q" }: SearchQueryParamSyncProps) => {
  const param = useSearchParams().get(queryKey);
  const lastReported = useRef<string | null>(null);

  useEffect(() => {
    if (lastReported.current === param) return;
    lastReported.current = param;
    onSearchParam(param);
  }, [param, onSearchParam]);

  return null;
};

export default SearchQueryParamSync;
