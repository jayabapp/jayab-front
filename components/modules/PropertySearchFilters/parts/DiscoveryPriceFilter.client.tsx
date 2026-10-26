"use client";

import { priceSliderMaximum } from "@features/properties/lib/price-histogram";
import { usePriceHistogram } from "@features/properties/hooks/usePriceHistogram";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { PRICE_RANGE } from "@features/properties/constants/filter-ranges";

import type { PriceRangeFilterProps } from "@/types/components/modules/property-search-filters";
import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";

import PriceRangeFilter from "./PriceRangeFilter.client";

const DiscoveryPriceFilter = ({
  filters = {},
  setFilters,
  searchFilters,
}: Pick<PriceRangeFilterProps, "filters" | "setFilters"> & {
  searchFilters?: PropertyFilters;
}) => {
  const t = useTranslations();
  const format = useFormatNumber();
  const applied = useDiscoveryQuery();
  const { data, isFetching, isError, isSettling } = usePriceHistogram(
    searchFilters ?? applied,
  );
  const maximum = priceSliderMaximum(data?.max, filters);
  const bins = !isSettling && !isError ? (data?.bins ?? []) : [];
  const highestCount = Math.max(1, ...bins.map((bin) => bin.count));
  const lower = Number(filters.min_price) || 0;
  const higher = Number(filters.max_price) || maximum;

  return (
    <div
      className="flex w-full flex-col gap-4 pb-2 pt-1"
      aria-busy={isFetching || isSettling}
    >
      {bins.length ? (
        <div
          role="img"
          aria-label={t("listing.priceDistribution")}
          className="flex h-16 items-end gap-0.5"
          dir="ltr"
        >
          {bins.map((bin, index) => (
            <span
              key={index}
              aria-hidden="true"
              title={t("listing.priceDistributionBin", {
                from: format(bin.from),
                to: format(bin.to),
                count: format(bin.count),
              })}
              className={`min-w-0 flex-1 rounded-t-sm ${bin.to >= lower && bin.from <= higher ? "bg-action" : "bg-line-strong"}`}
              style={{
                height: `${Math.max(bin.count > 0 ? 3 : 0, (bin.count / highestCount) * 100)}%`,
              }}
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-xs text-ink-subtle">
          {t("listing.priceDistributionUnavailable")}
        </p>
      ) : null}
      <p className="text-xs text-ink-muted">
        {t("common.from")} {format(lower)} {t("common.to")} {format(higher)}{" "}
        {t("common.toman")}
      </p>
      <PriceRangeFilter
        lowLimit={0}
        filters={filters}
        upLimit={maximum}
        lowerKey="min_price"
        higherKey="max_price"
        setFilters={setFilters}
        steps={PRICE_RANGE.step}
      />
    </div>
  );
};

export default DiscoveryPriceFilter;
