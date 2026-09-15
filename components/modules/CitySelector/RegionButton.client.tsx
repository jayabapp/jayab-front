"use client";

import type { RegionButtonProps } from "@/types/components/modules/city-selector";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const RegionButton = ({
  regionsIds,
  regionTitles,
  containerClass,
  setShowRegions,
  onClearRegions,
}: RegionButtonProps) => {
  const hasRegions = !isEmpty(regionsIds);
  const singleTitle =
    regionsIds?.length === 1 && regionTitles?.length === 1
      ? regionTitles[0]
      : null;

  return (
    <span
      className={`${containerClass ?? ""} rounded-full shrink-0 !w-auto min-w-16 gap-2 py-1 h-6.5 px-1 items-center justify-center border transition-colors ${
        hasRegions
          ? "border-brand-600 bg-brand-100 text-brand-700"
          : "border-neutral-400 bg-neutral-400/5 text-neutral-400"
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
        <span className="text-xs pr-1 shrink-0">
          {!hasRegions
            ? _STRINGS.SELECT_LOCAL
            : singleTitle
              ? `${_STRINGS.LOCAL}: ${singleTitle}`
              : _STRINGS.LOCAL}
        </span>
        {hasRegions && !singleTitle ? (
          <span className="shrink-0">{`(${regionsIds?.length} ${_STRINGS.ITEM})`}</span>
        ) : null}
      </button>

      {hasRegions ? (
        <button
          type="button"
          aria-label={`${_STRINGS.REMOVE_FILTERS} ${_STRINGS.LOCAL}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClearRegions();
          }}
          className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600 flex items-center justify-center"
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
