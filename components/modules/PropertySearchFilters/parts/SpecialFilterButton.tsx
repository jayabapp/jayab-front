import type { SpecialFilterButtonProps } from "@/types/components/modules/property-search-filters";

import { ContentImage } from "@elements/Image";

const SpecialFilterButton = ({ cb, isChecked, item }: SpecialFilterButtonProps) => (
  <button
    type="button"
    onClick={cb}
    aria-pressed={isChecked}
    className={`filter-chip ${isChecked ? "filter-chip-active" : "filter-chip-idle"}`}
  >
    <span className="flex items-center gap-1">
      <ContentImage
        alt=""
        width={20}
        height={20}
        src={item?.img}
        className="size-5 transition-all"
      />
      <span className="text-xs pr-2 shrink-0">{item?.title}</span>
    </span>
    {isChecked ? (
      <span className="w-4 h-4 mr-2 aspect-square rounded-full border border-brand-600 flex items-center justify-center">
        <ContentImage
          alt=""
          width={8}
          height={8}
          className="w-2 h-2 rotate-45 aspect-square"
          src="/assets/icons/adds/blue_plus.svg"
        />
      </span>
    ) : null}
  </button>
);

export default SpecialFilterButton;
