import { useTranslations } from "next-intl";

const PropertyCalendarLegend = () => {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
      <span className="flex items-center gap-2">
        <span className="relative size-4 overflow-hidden rounded border border-line-strong bg-surface-muted">
          <span aria-hidden="true" className="striped absolute inset-0 opacity-30" />
        </span>
        {t("reserve.reservedDays")}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-warning-500" />
        {t("reserve.peakDays")}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="size-4 rounded border border-line-strong bg-surface-hover" />
        {t("common.today")}
      </span>
    </div>
  );
};

export default PropertyCalendarLegend;
