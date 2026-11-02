"use client";

import { parseIdList } from "@features/cities/lib/city-selection";
import { Icon } from "@elements/Icon";

import type { RegionFilterProps } from "@/types/components/modules/property-search-filters";

const RegionFilter = ({ regions, filters, setFilters }: RegionFilterProps) => {
  const selected = parseIdList(filters?.regions);

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
    <div className="flex flex-wrap gap-2">
      {regions.map((region) => {
        const isOn = selected.includes(`${region.id}`);
        return (
          <button
            type="button"
            key={region.id}
            aria-pressed={isOn}
            onClick={() => toggle(`${region.id}`)}
            className={`filter-chip ${isOn ? "filter-chip-active" : "filter-chip-idle"}`}
          >
            {isOn ? (
              <Icon name="check" size={16} className="text-link" />
            ) : null}
            <span>{region.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RegionFilter;
