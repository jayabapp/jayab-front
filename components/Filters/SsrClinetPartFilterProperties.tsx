"use client";

import { useProperties } from "@features/properties/hooks/useProperties";
import { WeekDays } from "@/utils/constantss";
import { useMemo } from "react";

import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";
import ServerSidePaginate from "@/components/shared/Pagination/ServerSidePaginate";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import moment from "moment-jalaali";

export interface catQueryTypes {
  [key: string]: string | null | undefined;
}

type SsrClinetPartFilterPropertiesType = {
  sortType?: { id?: string };
  pageQuery: string | null | undefined;
  query: catQueryTypes;
  hiddenFilters: string[];
};

export const removeKeyArray = (
  keys: string[],
  object: { [key: string]: unknown },
) => {
  keys.forEach((key) => delete object[key]);
};

const SsrClinetPartFilterProperties = ({
  query,
  pageQuery,
  hiddenFilters,
}: SsrClinetPartFilterPropertiesType) => {
  const visibleQuery = useMemo(() => {
    const result = { ...query };
    removeKeyArray(hiddenFilters, result);
    return pageQuery ? { ...result, page: pageQuery } : result;
  }, [hiddenFilters, pageQuery, query]);
  const week = useMemo<any[]>(() => {
    const dayOfWeek = moment().day();
    return Array.from({ length: 7 }, (_, offset) =>
      WeekDays.find((item) => item.id === (dayOfWeek + offset) % 7),
    );
  }, []);
  const { properties, meta, isPending } = useProperties(
    visibleQuery,
    Boolean(pageQuery),
  );

  if (!pageQuery) return null;

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-2 px-1 pt-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyList />
      </div>
    );
  }

  return (
    <div className="w-full self-center px-0">
      <div className="grid grid-cols-1 gap-2 overflow-hidden px-1 pb-8 pt-4 md:grid-cols-2 md:gap-4 md:pt-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            week={week}
            data={property}
            key={`PRODUCT${property.id}`}
          />
        ))}
      </div>
      {meta ? (
        <ServerSidePaginate
          query={visibleQuery}
          totalCount={meta.total}
          pageSize={meta.perPage}
          currentPage={Number(pageQuery)}
        />
      ) : null}
    </div>
  );
};

export default SsrClinetPartFilterProperties;
