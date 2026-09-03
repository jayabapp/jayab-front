import type { SearchOptionKind, SearchOptionRowProps } from "@/types/features/search";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

// Every kind gets its own icon and its own badge word. Before this, a listing
// and a guide page were both a grey magnifier over brand-blue text, so the list
// gave the reader no way to tell what a row would actually open.
const ICON: Record<SearchOptionKind, string> = {
  place: "/assets/icons/home/literly_map.svg",
  property: "/assets/icons/adds/verified_hexy_badge.svg",
  guide: "/assets/icons/edit/magnifier.svg",
};

const BADGE: Record<SearchOptionKind, string> = {
  place: _STRINGS.SEARCH_BADGE_PLACE,
  property: _STRINGS.SEARCH_BADGE_PROPERTY,
  guide: _STRINGS.SEARCH_BADGE_GUIDE,
};

const SearchOptionRow = ({
  index,
  isActive,
  onHover,
  onSelect,
  option,
}: SearchOptionRowProps) => (
  <button
    type="button"
    role="option"
    id={`search-option-${index}`}
    aria-selected={isActive}
    data-option-index={index}
    onClick={onSelect}
    onMouseEnter={() => onHover(index)}
    // `search-option` carries the active/hover surface; the pointer and the
    // keyboard cursor therefore light up the same way.
    className={`search-option ${isActive ? "search-option-active" : ""}`}
  >
    <span className="search-option-icon">
      <ContentImage
        alt=""
        width={16}
        height={16}
        src={ICON[option.kind]}
        className="h-4 w-4 shrink-0 object-contain"
      />
    </span>

    <span className="flex min-w-0 flex-1 flex-col items-start">
      <span className="line-clamp-1 text-sm">{option.label}</span>
      {!!option.hint ? (
        <span className="line-clamp-1 text-xxs text-neutral-500">
          {option.hint}
        </span>
      ) : (
        <></>
      )}
    </span>

    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xxs text-neutral-600">
      {BADGE[option.kind]}
    </span>
  </button>
);

export default SearchOptionRow;
