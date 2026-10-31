import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { CityModalHeaderProps } from "@/types/components/modules/city-selector";

const CityModalHeader = ({
  onBack,
  onHide,
  selectedProvince,
}: CityModalHeaderProps) => {
  const t = useTranslations();

  return (
    <div className="app-text flex justify-between border-b items-center py-5 custome-shadow-card px-4 sticky top-0 bg-surface z-10">
      <button
        type="button"
        onClick={onBack}
        disabled={!selectedProvince}
        aria-label={t("common.back")}
        className={`transition-all ${selectedProvince ? "" : "opacity-0"}`}
      >
        <Icon name="chevron-start" size={16} />
      </button>
      <p className="text-base font-semibold">
        {selectedProvince
          ? t("header.chooseCity")
          : t("search.selectProveCity")}
      </p>
      <button type="button" onClick={onHide} aria-label={t("common.close")}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
};

export default CityModalHeader;
