"use client";

import { extraDiscoveryFilters } from "@features/properties/lib/discovery-filter-policy";
import { useDiscoveryBaseline } from "@features/properties/context/DiscoveryContext";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { useTranslations } from "next-intl";

import type { RangeFilterChipProps } from "@/types/components/modules/property-search-filters";

import DiscoveryPriceFilter from "./DiscoveryPriceFilter.client";
import FilterEditorChip from "./FilterEditorChip.client";
import PriceRangeFilter from "./PriceRangeFilter.client";

const RangeFilterChip = ({
  icon,
  unit,
  title,
  steps,
  upLimit,
  lowerKey,
  higherKey,
  labelTitle,
}: RangeFilterChipProps) => {
  const t = useTranslations("common");
  const formatNumber = useFormatNumber();
  const query = extraDiscoveryFilters(
    useDiscoveryQuery(),
    useDiscoveryBaseline(),
  );

  const words = [
    query[lowerKey]
      ? `${t("from")} ${formatNumber(String(query[lowerKey]))}`
      : "",
    query[higherKey]
      ? `${t("to")} ${formatNumber(String(query[higherKey]))}`
      : "",
  ].filter(Boolean);

  return (
    <FilterEditorChip
      icon={icon}
      title={title}
      panelClass="w-96"
      keys={[lowerKey, higherKey]}
      label={`${labelTitle ?? title} ${words.join(" ")} ${unit}`.trim()}
      renderEditor={(draft, setDraft) =>
        lowerKey === "min_price" ? (
          <DiscoveryPriceFilter filters={draft} setFilters={setDraft} />
        ) : (
          <div className="flex w-full flex-col gap-4 pb-2 pt-1">
            <p className="text-xs text-ink-muted">
              {t("from")} {formatNumber(draft[lowerKey] || 0)} {t("to")}{" "}
              {formatNumber(draft[higherKey] || upLimit)} {unit}
            </p>
            <PriceRangeFilter
              lowLimit={0}
              steps={steps}
              filters={draft}
              upLimit={upLimit}
              lowerKey={lowerKey}
              higherKey={higherKey}
              setFilters={setDraft}
            />
          </div>
        )
      }
    />
  );
};

export default RangeFilterChip;
