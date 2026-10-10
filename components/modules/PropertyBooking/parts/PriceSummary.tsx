
import { useFormatToman } from "@hooks/useFormatToman";
import { useTranslations } from "next-intl";

import type { PriceSummaryProps } from "@/types/components/modules/property-booking";

const ROW_CLASS =
  "flex items-center justify-between gap-3 text-sm text-ink";

const PriceSummary = ({ isRefreshing, quote }: PriceSummaryProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations("reserve");

  return (
    <div
      className={`relative flex flex-col gap-2 transition-opacity motion-reduce:transition-none ${isRefreshing ? "opacity-60" : ""}`}
      aria-live="polite"
    >
      {isRefreshing ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 bg-brand-500"
        />
      ) : null}
      <div className={ROW_CLASS}>
        <span>{t("stayNights", { count: Number(quote.nights) })}</span>
        <span>{formatToman(quote.rent_total)}</span>
      </div>

      {quote.extra_guests > 0 ? (
        <div className={ROW_CLASS}>
          <span>
            {t("extraGuestsCount", { count: Number(quote.extra_guests) })} ×{" "}
            {t("nights", { count: Number(quote.nights) })}
          </span>
          <span>{formatToman(quote.extra_guest_total)}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-base font-bold text-ink">
        <span>{t("approxStayCost")}</span>
        <span>{formatToman(quote.stay_total)}</span>
      </div>

      {quote.cleaning_fee > 0 ? (
        <p className="text-xs text-ink-subtle">
          {t("cleaningFeeConditionalPrefix")}
          {formatToman(quote.cleaning_fee)}
          {t("cleaningFeeConditionalSuffix")}
        </p>
      ) : null}
    </div>
  );
};

export default PriceSummary;
