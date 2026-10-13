import { useTranslations } from "next-intl";

const StayCalendarLegend = () => {
  const t = useTranslations("reserve");

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-muted">
      <span className="flex items-center gap-2">
        <span className="relative size-4 overflow-hidden rounded border border-line-strong bg-surface-muted">
          <span
            aria-hidden="true"
            className="striped absolute inset-0 opacity-30"
          />
        </span>
        {t("reservedDays")}
      </span>
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-warning-500"
        />
        {t("peakDays")}
      </span>
      <span className="text-ink-subtle">{t("pricesInThousands")}</span>
    </div>
  );
};

export default StayCalendarLegend;
