import type { SearchLocationChipProps } from "@/types/components/modules/search";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";

const SearchLocationChip = ({ isProvince, onRemove, title }: SearchLocationChipProps) => (
  <button
    type="button"
    onClick={onRemove}
    aria-label={`${_STRINGS.CLOSE} ${title ?? ""}`}
    className="rounded-full gap-4 py-0.5 px-2 pl-1 flex items-center justify-center border border-brand-600/30 bg-brand-600/5 text-xs"
  >
    <span className="text-sm">
      {isProvince ? `${_STRINGS.PROVINCE} ` : ""}
      {title}
    </span>
    <span className="w-4 h-4 aspect-square rounded-full border border-brand-600/30 flex items-center justify-center">
      <ContentImage
        alt=""
        width={10}
        height={10}
        src="/assets/icons/adds/x_mark.svg"
        className="w-2.5 h-2.5 opacity-30 p-0.5 text-neutral-900 aspect-square"
      />
    </span>
  </button>
);

export default SearchLocationChip;
