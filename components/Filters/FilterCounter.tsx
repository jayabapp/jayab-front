"use client";

import queryBuilder from "@/helpers/queryBuilder";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, useCallback, useMemo } from "react";
import Counter from "../shared/Form/Counter";

interface FilterCounterProps {
  query?: Record<string, string | string[] | undefined>;
  queryKey: string;
  isMulty?: boolean;
  setMobileFilters?: Dispatch<Record<string, unknown>>;
  mobileFilters?: Record<string, unknown>;
  title: string;
}

const FilterCounter = ({ title, query = {}, queryKey, setMobileFilters, mobileFilters }: FilterCounterProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const queryData = useMemo(() => {
    if (mobileFilters && queryKey in mobileFilters) {
      return Number(mobileFilters[queryKey]) || 0;
    }
    const raw = query[queryKey];
    if (raw) {
      return Number(String(raw).split(",")[0]) || 0;
    }
    return 0;
  }, [mobileFilters, queryKey, query]);

  const queryMaker = useCallback(
    (value: number) => {
      const source = mobileFilters ? { ...mobileFilters } : { ...query };
      const body = { ...source, [queryKey]: value };

      if (queryKey === "parent_category") {
        delete body.specifications;
        delete body.categories;
      }

      if (setMobileFilters) {
        // Keep 0 in mobileFilters so we know the user set it
        setMobileFilters(body);
      } else {
        // Only strip 0 from URL query, not from mobileFilters
        if (value === 0) {
          delete body[queryKey];
        }
        router.replace(`${pathname}?${queryBuilder(body)}`);
      }
    },
    [mobileFilters, query, queryKey, setMobileFilters, pathname, router],
  );
  return (
    <div className=" w-full py-2 border-b flex items-center justify-between     ">
      <p className="text-sm">{title}</p>

      <div className="w-1/3">
        {" "}
        <Counter plusMinusNumber={1} value={queryData} setValue={queryMaker} />
      </div>
    </div>
  );
};

export default FilterCounter;
