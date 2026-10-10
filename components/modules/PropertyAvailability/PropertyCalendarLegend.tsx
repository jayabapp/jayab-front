import { useTranslations } from "next-intl";

import type { PropertyCalendarLegendProps } from "@/types/components/modules/property-availability";


const PropertyCalendarLegend = ({
  isAdvisor,
  isCustomer,
}: PropertyCalendarLegendProps) => {
  const t = useTranslations("reserve");

  return (
  <div className="w-full flex flex-wrap gap-y-1 gap-x-5">
    <div className="flex text-ink-subtle text-sm items-center gap-2">
      <div className="w-5 h-5 striped !bg-surface-hover rounded-md" />
      <p className="text-xs md:text-sm">{t("reservedDays")}</p>
    </div>
    <div className="flex text-ink-subtle text-sm items-center gap-2">
      <div className="w-5 h-5 !bg-surface-hover rounded-md" />
      <p className="text-xs md:text-sm">{t("emptyDays")}</p>
    </div>
    <div className="flex text-ink-subtle text-sm items-center gap-2">
      <div className="w-3.5 h-0.5 bg-danger-500 rounded-full" />
      <p className="text-xs md:text-sm">{t("peakDays")}</p>
    </div>
    {isAdvisor || isCustomer ? null : (
      <div className="flex text-ink-subtle text-sm items-center gap-2">
        <div className="w-1 h-1 bg-action rounded-full" />
        <p className="text-xs md:text-sm">{t("memoDays")}</p>
      </div>
    )}
  </div>
);
};

export default PropertyCalendarLegend;
