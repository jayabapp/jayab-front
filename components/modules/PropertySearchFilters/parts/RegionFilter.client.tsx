"use client";

import { matchesCitySearch, parseIdList } from "@features/cities/lib/city-selection";
import { CityCard, CitySearchInput } from "@modules/CitySelector";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { RegionFilterProps } from "@/types/components/modules/property-search-filters";

const RegionFilter = ({ regions, filters, setFilters }: RegionFilterProps) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const selected = parseIdList(filters?.regions);
  const visibleRegions = regions.filter((region) =>
    matchesCitySearch(region, search),
  );

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((entry) => entry !== id)
      : [...selected, id];
    setFilters({
      ...filters,
      regions: next.length ? next.join(",") : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-20 border border-line bg-surface p-2">
      <CitySearchInput
        value={search}
        onChange={setSearch}
        options={{ placeholder: t("search.searchRegion") }}
      />
      <div
        role="group"
        aria-label={t("common.local")}
        className="max-h-60 overflow-y-auto overscroll-contain px-1"
      >
        {visibleRegions.length ? (
          visibleRegions.map((region) => (
            <CityCard
              key={region.id}
              item={region}
              isChecked={selected.includes(`${region.id}`)}
              callback={() => toggle(`${region.id}`)}
            />
          ))
        ) : (
          <p className="py-5 text-center text-sm text-ink-muted">
            {t("common.empty")}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegionFilter;
