import type { LocationChipProps } from "@/types/components/modules/city-selector";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";

/** The shared "selected location" pill used by every city/region list in this module. */
const LocationChip = ({ onRemove, prefix, title }: LocationChipProps) => (
  <div className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-brand-600/30 bg-brand-600/5 text-xs">
    <p className="text-sm text-neutral-900 pr-2">
      {prefix ? `${prefix} ` : ""}
      {title}
    </p>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`${_STRINGS.CLOSE} ${title ?? ""}`}
      className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600/30 flex items-center justify-center"
    >
      <ContentImage
        alt=""
        width={10}
        height={10}
        src="/assets/icons/adds/x_mark.svg"
        className="w-2.5 h-2.5 opacity-30 p-0.5 text-neutral-900 aspect-square"
      />
    </button>
  </div>
);

export default LocationChip;
