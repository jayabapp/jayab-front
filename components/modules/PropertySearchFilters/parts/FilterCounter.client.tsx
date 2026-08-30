"use client";

import type { FilterCounterProps } from "@/types/components/modules/property-search-filters";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Counter } from "@elements/Form";

import queryBuilder from "@/helpers/queryBuilder";

const FilterCounter = ({
  title,
  queryKey,
  query = {},
  mobileFilters,
  setMobileFilters,
}: FilterCounterProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const queryData = useMemo(() => {
    if (mobileFilters && queryKey in mobileFilters) {
      return Number(mobileFilters[queryKey]) || 0;
    }
    const raw = query[queryKey];
    return raw ? Number(String(raw).split(",")[0]) || 0 : 0;
  }, [mobileFilters, queryKey, query]);

  const queryMaker = useCallback(
    (value: number) => {
      const source = mobileFilters ? { ...mobileFilters } : { ...query };
      const body: Record<string, unknown> = { ...source, [queryKey]: value };
      if (queryKey === "parent_category") {
        delete body.specifications;
        delete body.categories;
      }
      if (setMobileFilters) {
        setMobileFilters(body);
        return;
      }
      if (value === 0) delete body[queryKey];
      router.replace(`${pathname}?${queryBuilder(body)}`);
    },
    [mobileFilters, query, queryKey, setMobileFilters, pathname, router],
  );

  return (
    <div className="w-full py-2 border-b flex items-center justify-between">
      <p className="text-sm">{title}</p>
      <div className="w-1/3">
        <Counter plusMinusNumber={1} value={queryData} setValue={queryMaker} />
      </div>
    </div>
  );
};

export default FilterCounter;
