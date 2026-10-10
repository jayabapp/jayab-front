"use client";

import { usePropertyFilterCount } from "@features/properties/hooks/usePropertyFilterCount";
import { useTranslations } from "next-intl";

import type { FilterApplyBarProps } from "@/types/components/modules/property-search-filters";

import numberWithCommas from "@/helpers/numberWithCommas";
import Button from "@elements/Button";

const FilterApplyBar = ({
  draft,
  onApply,
  enabled = true,
}: FilterApplyBarProps) => {
  const t = useTranslations("listing");

  const { count, isStale } = usePropertyFilterCount(draft, enabled);

  const hasCount = typeof count === "number";
  const isEmptyResult = hasCount && count === 0;

  const label = !hasCount
    ? t("doTheFiltering")
    : isEmptyResult
      ? t("noMatchingProperty")
      : t("showResults", { count, formatted: numberWithCommas(count) });

  return (
    <div className="w-full border-t border-surface-muted bg-surface px-3 pb-3 pt-2.5">
      <Button
        width="w-full"
        title={label}
        onClick={onApply}
        containerClass="w-full"
        disabled={isEmptyResult}
        btnClass={`transition-opacity ${isStale ? "opacity-60" : ""}`}
      />
    </div>
  );
};

export default FilterApplyBar;
