"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

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
      className={`${containerClass ?? ""} rounded-full shrink-0 !w-auto min-w-16 gap-2 py-1 h-6.5 px-1 items-center justify-center border transition-colors ${
        hasRegions
          ? "border-action bg-selected text-link"
          : "border-control bg-neutral-400/5 text-ink-subtle"
      } text-xs flex flex-row`}
    >
      <button
        type="button"
        className="flex shrink-0 items-center gap-1"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setShowRegions(true);
        }}
      >
        <span className="text-xs ps-1 shrink-0">
          {!hasRegions
            ? t("search.selectLocal")
            : singleTitle
              ? `${t("common.local")}: ${singleTitle}`
              : null}
        </span>
        {hasRegions && !singleTitle ? (
          <span className="shrink-0">{`${regionsIds?.length} ${t("common.local")}`}</span>
        ) : null}
      </button>

      {hasRegions ? (
        <button
          type="button"
          aria-label={`${t("common.removeFilters")} ${t("common.local")}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClearRegions();
          }}
          className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-action flex items-center justify-center"
        >
          <ContentImage
            alt=""
            width={8}
            height={8}
            src="/assets/icons/adds/blue_plus.svg"
            className="w-2 h-2 rotate-45 aspect-square"
          />
        </button>
      ) : null}
    </span>
  );
};

export default RegionButton;
