import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { SearchLocationChipProps } from "@/types/components/modules/search";

const SearchLocationChip = ({
  title,
  onRemove,
  isProvince,
}: SearchLocationChipProps) => {
  const t = useTranslations("common");

  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`${t("close")} ${title ?? ""}`}
      className="rounded-full gap-4 py-0.5 px-2 pe-1 flex items-center justify-center border border-action/30 bg-action/5 text-xs"
    >
      <span className="text-sm">
        {isProvince ? `${t("province")} ` : ""}
        {title}
      </span>
      <span className="w-4 h-4 aspect-square rounded-full border border-action/30 flex items-center justify-center">
        <Icon name="x" size={16} className="size-3 text-ink-muted" />
      </span>
    </button>
  );
};

export default SearchLocationChip;
