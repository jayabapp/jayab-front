import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { FilterPanelHeaderProps } from "@/types/components/modules/property-search-filters";

const FilterPanelHeader = ({
  onReset,
  activeCount,
}: FilterPanelHeaderProps) => {
  const t = useTranslations();

  return (
    <div className="flex w-full items-center justify-between gap-2 border-b border-surface-muted pb-3">
      <div className="flex items-center gap-2">
        <ContentImage
          alt=""
          width={18}
          height={18}
          className="size-4.5 shrink-0"
          src="/assets/icons/property/filter_icon.svg"
        />
        <p className="text-base font-medium text-ink">
          {t("listing.filters")}
        </p>
        {activeCount > 0 ? (
          <span className="rounded-full bg-selected px-2 py-0.5 text-2xs font-bold text-link">
            {t("listing.activeFilters", { count: Number(activeCount) })}
          </span>
        ) : (
          <></>
        )}
      </div>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 text-xs text-link transition-colors hover:text-on-selected"
        >
          {t("common.removeFilters")}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FilterPanelHeader;
