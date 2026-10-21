import { useTranslations } from "next-intl";
import { PropertyCalendarLegend } from "@modules/PropertyAvailability";

const StayCalendarLegend = () => {
  const t = useTranslations("reserve");

  return (
    <div className="flex flex-col gap-1">
      <PropertyCalendarLegend />
      <span className="text-xs text-ink-subtle">{t("pricesInThousands")}</span>
    </div>
  );
};

export default StayCalendarLegend;
