"use client";

import { useEffect, useMemo, useState } from "react";
import { formatJalaliWeekdayDay } from "@features/reservations/mappers/reservation-dates";
import { STAY_MONTH_HORIZON } from "@features/reservations/lib/stay-months";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { isCompleteRange } from "@features/reservations/lib/stay-range";
import { useTranslations } from "next-intl";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { stayMonths } from "@features/reservations/lib/stay-months";

import type { StayDateSheetProps } from "@/types/components/modules/property-booking";
import type { TDateSummary } from "@/types/components/modules/property-booking";
import type { StayRange } from "@features/reservations/lib/stay-range";

import StayCalendarLegend from "./StayCalendarLegend";
import StayCalendarGrid from "./StayCalendarGrid.client";
import FullScreenSheet from "./FullScreenSheet.client";
import moment from "moment-jalaali";

const DateSummary = ({ label, value }: TDateSummary) => {
  const t = useTranslations("reserve");
  const jalali = useJalaliFormat();

  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <span className="text-xs text-ink-subtle">{label}</span>
      <span
        className={`text-sm ${value ? "font-semibold text-ink" : "text-ink-subtle"}`}
      >
        {value ? formatJalaliWeekdayDay(value, jalali) : t("emptyDate")}
      </span>
    </div>
  );
};

const StayDateSheetBody = ({
  initial,
  onClose,
  reserved,
  onConfirm,
  propertyId,
}: Omit<StayDateSheetProps, "show">) => {
  const t = useTranslations("reserve");

  const [draft, setDraft] = useState<StayRange>(initial);
  const months = useMemo(() => stayMonths(0, STAY_MONTH_HORIZON), []);

  useEffect(() => {
    if (!initial.start) return;
    const key = `${moment(initial.start).jYear()}-${moment(initial.start).jMonth() + 1}`;
    document
      .querySelector(`[data-stay-month="${key}"]`)
      ?.scrollIntoView({ block: "start" });
  }, [initial.start]);

  const complete = isCompleteRange(draft) ? draft : null;
  const nights = complete ? nightsBetween(complete.start, complete.end) : 0;

  return (
    <FullScreenSheet
      show
      onHide={onClose}
      title={t("tripDate")}
      footer={
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <DateSummary label={t("checkinDate")} value={draft.start} />
            <DateSummary label={t("checkoutDate")} value={draft.end} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDraft({})}
              className="h-11 cursor-pointer rounded-10 border border-line px-5 text-sm text-ink-muted transition-colors hover:bg-surface-muted"
            >
              {t("clearStay")}
            </button>
            <button
              type="button"
              disabled={!complete}
              onClick={() => complete && onConfirm(complete)}
              className="h-11 flex-1 cursor-pointer rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:hover:bg-line-strong"
            >
              {t("pickDatesCta")}
              {nights ? ` (${t("nights", { count: Number(nights) })})` : ""}
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <StayCalendarLegend />
        <StayCalendarGrid
          lazy
          range={draft}
          months={months}
          onChange={setDraft}
          reserved={reserved}
          propertyId={propertyId}
        />
      </div>
    </FullScreenSheet>
  );
};

const StayDateSheet = ({ show, ...props }: StayDateSheetProps) =>
  show ? <StayDateSheetBody {...props} /> : null;

export default StayDateSheet;
