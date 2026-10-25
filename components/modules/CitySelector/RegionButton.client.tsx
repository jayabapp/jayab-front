"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { RegionButtonProps } from "@/types/components/modules/city-selector";

import isEmpty from "lodash/isEmpty";

const RegionButton = ({
  regionsIds,
  regionTitles,
  containerClass,
  setShowRegions,
  onClearRegions,
}: RegionButtonProps) => {
  const t = useTranslations();

  const hasRegions = !isEmpty(regionsIds);
  const singleTitle =
    regionsIds?.length === 1 && regionTitles?.length === 1
      ? regionTitles[0]
      : null;

  return (
    <span
      className={`filter-chip ${hasRegions ? "filter-chip-active" : "filter-chip-idle"} ${containerClass ?? ""}`}
    >
      <button
        type="button"
        className="flex h-full cursor-pointer items-center gap-1.5"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setShowRegions(true);
        }}
      >
        <Icon name="map-pin" size={20} className="text-link" />
        <span>
          {!hasRegions
            ? t("search.selectLocal")
            : (singleTitle ?? `${regionsIds?.length} ${t("common.local")}`)}
        </span>
        {hasRegions ? null : (
          <Icon name="chevron-down" size={16} className="text-ink-subtle" />
        )}
      </button>

      {hasRegions ? (
        <button
          type="button"
          aria-label={t("listing.removeFilterNamed", {
            title: t("common.local"),
          })}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClearRegions();
          }}
          className="flex size-5 cursor-pointer items-center justify-center rounded-full border border-action"
        >
          <Icon name="x" size={16} />
        </button>
      ) : null}
    </span>
  );
};

export default RegionButton;
