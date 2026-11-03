import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { SearchOptionRowProps } from "@/types/features/search";
import type { SearchOptionKind } from "@/types/features/search";

const ICON: Record<SearchOptionKind, string> = {
  place: "/assets/icons/home/literly_map.svg",
  property: "/assets/icons/adds/verified_hexy_badge.svg",
  guide: "/assets/icons/edit/magnifier.svg",
};

const BADGE = {
  place: "search.searchBadgePlace",
  property: "search.searchBadgeProperty",
  guide: "search.searchBadgeGuide",
} as const satisfies Record<SearchOptionKind, string>;

const SearchOptionRow = ({
  index,
  option,
  onHover,
  onSelect,
  isActive,
}: SearchOptionRowProps) => {
  const t = useTranslations();

  return (
    <button
      type="button"
      role="option"
      onClick={onSelect}
      aria-selected={isActive}
      data-option-index={index}
      id={`search-option-${index}`}
      onMouseEnter={() => onHover(index)}
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
          <span className="line-clamp-1 text-2xs text-ink-subtle">
            {option.hint}
          </span>
        ) : (
          <></>
        )}
      </span>

      <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-2xs text-ink-muted">
        {option.badge || t(BADGE[option.kind])}
      </span>
    </button>
  );
};

export default SearchOptionRow;
