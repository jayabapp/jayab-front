import type { FilterPanelHeaderProps } from "@/types/components/modules/property-search-filters";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";

/**
 * The filter panel's title row: what the panel is, how much of it is currently
 * doing something, and the one control that undoes all of it.
 *
 * The reset is only rendered when there is something to reset. A permanently
 * visible "حذف همه" on an untouched panel invites the user to wonder what they
 * would be deleting.
 */
const FilterPanelHeader = ({ activeCount, onReset }: FilterPanelHeaderProps) => (
  <div className="flex w-full items-center justify-between gap-2 border-b border-neutral-100 pb-3">
    <div className="flex items-center gap-2">
      <ContentImage
        alt=""
        width={18}
        height={18}
        className="size-4.5 shrink-0"
        src="/assets/icons/property/filter_icon.svg"
      />
      <p className="text-base font-medium text-neutral-900">
        {_STRINGS.FILTERS}
      </p>
      {activeCount > 0 ? (
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xxs font-bold text-brand-600">
          {activeCount} {_STRINGS.ACTIVE_FILTER_SUFFIX}
        </span>
      ) : (
        <></>
      )}
    </div>

    {activeCount > 0 ? (
      <button
        type="button"
        onClick={onReset}
        className="shrink-0 text-xs text-brand-600 transition-colors hover:text-brand-800"
      >
        {_STRINGS.REMOVE_FILTERS}
      </button>
    ) : (
      <></>
    )}
  </div>
);

export default FilterPanelHeader;
