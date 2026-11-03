import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { LocationChipProps } from "@/types/components/modules/city-selector";

const LocationChip = ({ onRemove, prefix, title }: LocationChipProps) => {
  const t = useTranslations("common");

  return (
    <div className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-action/30 bg-action/5 text-xs">
      <p className="text-sm text-ink ps-2">
        {prefix ? `${prefix} ` : ""}
        {title}
      </p>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${t("close")} ${title ?? ""}`}
        className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-action/30 flex items-center justify-center"
      >
        <Icon name="x" size={16} className="size-3 text-ink-muted" />
      </button>
    </div>
  );
};

export default LocationChip;
