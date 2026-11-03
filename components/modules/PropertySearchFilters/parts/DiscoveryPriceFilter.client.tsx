"use client";

import { priceSliderMaximum } from "@features/properties/lib/price-histogram";
import { usePriceHistogram } from "@features/properties/hooks/usePriceHistogram";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { PRICE_RANGE } from "@features/properties/constants/filter-ranges";
import { useState } from "react";
import { p2e } from "@/helpers/NumberConverter";

import type { PriceRangeFilterProps } from "@/types/components/modules/property-search-filters";
import type { PropertyFilters } from "@features/properties/lib/normalize-property-filters";
import type { TPriceField } from "@/types/components/modules/property-search-filters";

import PriceRangeFilter from "./PriceRangeFilter.client";

const PriceField = ({ label, value, placeholder, onCommit }: TPriceField) => {
  const t = useTranslations("common");
  const format = useFormatNumber();
  const [draft, setDraft] = useState<string | null>(null);
  const digits = (text: string) => p2e(text).replace(/\D/g, "");

  const commit = () => {
    if (draft === null) return;
    setDraft(null);
    onCommit(Number(draft) || undefined);
  };

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-ink-subtle">
      {label}
      <span className="flex h-11 items-center gap-1.5 rounded-10 border border-line bg-surface px-3 focus-within:border-action">
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={
            draft !== null
              ? draft
                ? format(Number(draft))
                : ""
              : value
                ? format(value)
                : ""
          }
          onFocus={() => setDraft(value ? String(value) : "")}
          onChange={(event) => setDraft(digits(event.target.value))}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-subtle"
        />
        <span className="shrink-0">{t("toman")}</span>
      </span>
    </label>
  );
};

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

  const setPrice = (min?: number, max?: number) => {
    const [low, high] = min && max && min > max ? [max, min] : [min, max];
    setFilters?.((current: Record<string, unknown>) => ({
      ...current,
      min_price: low || undefined,
      max_price: high || undefined,
    }));
  };

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
      <PriceRangeFilter
        lowLimit={0}
        filters={filters}
        upLimit={maximum}
        lowerKey="min_price"
        higherKey="max_price"
        setFilters={setFilters}
        steps={PRICE_RANGE.fineStep}
      />
      <div className="flex gap-3">
        <PriceField
          label={t("listing.priceMin")}
          placeholder={format(0)}
          value={Number(filters.min_price) || undefined}
          onCommit={(value) =>
            setPrice(value, Number(filters.max_price) || undefined)
          }
        />
        <PriceField
          label={t("listing.priceMax")}
          placeholder={format(maximum)}
          value={Number(filters.max_price) || undefined}
          onCommit={(value) =>
            setPrice(Number(filters.min_price) || undefined, value)
          }
        />
      </div>
    </div>
  );
};

export default DiscoveryPriceFilter;
