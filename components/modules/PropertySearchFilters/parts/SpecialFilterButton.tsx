import type { SpecialFilterButtonProps } from "@/types/components/modules/property-search-filters";

import { ContentImage } from "@elements/Image";

const SpecialFilterButton = ({ cb, isChecked, item }: SpecialFilterButtonProps) => (
  <button
    type="button"
    onClick={cb}
    aria-pressed={isChecked}
    className={`rounded-full !w-auto ${
      isChecked ? "border-brand-600 bg-brand-600/5 text-brand-600" : "opacity-70"
    } transition-all cursor-pointer gap-0 py-1 h-[1.625rem] pl-2 pr-1 flex items-center justify-center border text-xs`}
  >
    <span className="flex items-center gap-1">
      <ContentImage
        alt=""
        width={20}
        height={20}
        src={item?.img}
        className={`size-5 transition-all ${isChecked ? "" : "grayscale opacity-60"}`}
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
