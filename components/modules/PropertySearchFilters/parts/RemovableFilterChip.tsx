import type { RemovableFilterChipProps } from "@/types/components/modules/property-search-filters";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";

/** The active-filter pill: a label plus the control that clears that filter. */
const RemovableFilterChip = ({ label, onRemove }: RemovableFilterChipProps) => (
  <div className="rounded-full !w-auto gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-brand-600 bg-brand-600/5 text-brand-600 text-xs">
    <p className="text-xs pr-2">{label}</p>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`${_STRINGS.REMOVE_FILTERS} ${label}`}
      className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600 flex items-center justify-center"
    >
      <ContentImage
        alt=""
        width={8}
        height={8}
        className="w-2 h-2 rotate-45 aspect-square"
        src="/assets/icons/adds/blue_plus.svg"
      />
    </button>
  </div>
);

export default RemovableFilterChip;
