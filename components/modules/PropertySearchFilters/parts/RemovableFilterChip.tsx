import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { RemovableFilterChipProps } from "@/types/components/modules/property-search-filters";

const RemovableFilterChip = ({
  label,
  onRemove,
  onLabelClick,
}: RemovableFilterChipProps) => {
  const t = useTranslations("listing");

  return (
    <div className="filter-chip filter-chip-active gap-2 pe-2">
      {onLabelClick ? (
        <button type="button" onClick={onLabelClick} className="cursor-pointer">
          {label}
        </button>
      ) : (
        <p>{label}</p>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={t("removeFilterNamed", { title: label })}
        className="flex size-5 cursor-pointer items-center justify-center rounded-full border border-action"
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
};

export default RemovableFilterChip;
