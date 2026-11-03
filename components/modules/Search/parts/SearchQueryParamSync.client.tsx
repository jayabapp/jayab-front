"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCitiesStore } from "@/store";

import type { SearchQueryParamSyncProps } from "@/types/components/modules/search";

const SearchQueryParamSync = ({
  onSearchParam,
  queryKey = "q",
}: SearchQueryParamSyncProps) => {
  const param = useSearchParams().get(queryKey);
  const cityPickerRevision = useCitiesStore(
    (state) => state.cityPickerRevision,
  );
  const lastReported = useRef<string | null>(null);
  const lastCityPickerRevision = useRef(cityPickerRevision);

  useEffect(() => {
    if (lastReported.current === param) return;
    lastReported.current = param;
    if (!param) return;
    onSearchParam(param);
  }, [param, onSearchParam]);

  useEffect(() => {
    if (lastCityPickerRevision.current === cityPickerRevision) return;
    lastCityPickerRevision.current = cityPickerRevision;
    onSearchParam(null);
  }, [cityPickerRevision, onSearchParam]);

  return null;
};

export default SearchQueryParamSync;
