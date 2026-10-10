import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

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
        <ContentImage
          alt=""
          width={10}
          height={10}
          src="/assets/icons/adds/x_mark.svg"
          className="w-2.5 h-2.5 opacity-30 p-0.5 text-ink aspect-square"
        />
      </button>
    </div>
  );
};

export default LocationChip;
