"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchDateRangePicker } from "@modules/PropertySearchFilters";
import { CLEARED_DRAFT_TARGET } from "@features/search/lib/search-option-draft";
import { useOverlayBackButton } from "@hooks/useOverlayBackButton";
import { searchOptionToDraft } from "@features/search/lib/search-option-draft";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";
import { SearchInlinePanel } from "@modules/Search";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { updateDateRange } from "@modules/PropertySearchFilters";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";
import { motion } from "framer-motion";

import type { HeroSearchSheetProps } from "@/types/components/modules/home-hero-search";
import type { HeroSearchStep } from "@/types/components/modules/home-hero-search";

import HeroGuestsStep from "./HeroGuestsStep";
import HeroStepCard from "./HeroStepCard";
import moment from "moment-jalaali";

const DAY_MONTH_FORMAT = "jD jMMMM";
const JALALI_FORMAT = "jYYYY/jMM/jD";

const STEP_ICON: Record<HeroSearchStep, string> = {
  where: "/assets/icons/adds/pin_point_location.svg",
  dates: "/assets/icons/reserve/blue_calendar_reserve.svg",
  guests: "/assets/icons/reserve/blue_persons.svg",
};

const HeroSearchSheet = ({
  count,
  draft,
  onClose,
  onPatch,
  onReset,
  onSubmit,
  isPending,
  isCountStale,
}: HeroSearchSheetProps) => {
  const t = useTranslations();
  const jalali = useJalaliFormat();

  const [step, setStep] = useState<HeroSearchStep>(() =>
    !draft.cities && !draft.q ? "where" : !draft.checkin ? "dates" : "guests",
  );
  const [visited, setVisited] = useState<HeroSearchStep[]>(() => [step]);

  const openStep = useCallback((next: HeroSearchStep) => {
    setStep(next);
    setVisited((current) =>
      current.includes(next) ? current : [...current, next],
    );
  }, []);

  const skippedSummary = (of: HeroSearchStep, label: string) =>
    visited.includes(of) && step !== of ? label : "";

  useBodyScrollLock(true);
  const requestClose = useOverlayBackButton(true, onClose);

  useEffect(() => {
    if (step === "where") return;
    document
      .getElementById(`hero-step-${step}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const datesSummary = useMemo(() => {
    if (!draft.checkin) return "";
    const checkin = jalali(draft.checkin, DAY_MONTH_FORMAT);
    return draft.checkout
      ? `${checkin} - ${jalali(draft.checkout, DAY_MONTH_FORMAT)}`
      : `${checkin} - ...`;
  }, [draft.checkin, draft.checkout, jalali]);

  const onPickDay = useCallback(
    (day: string) =>
      updateDateRange({
        date: day,
        cb: () => openStep("guests"),
        state: { checkin: draft.checkin, checkout: draft.checkout },
        setState: (updater) =>
          onPatch(
            typeof updater === "function"
              ? updater({ checkin: draft.checkin, checkout: draft.checkout })
              : updater,
          ),
      }),
    [draft.checkin, draft.checkout, onPatch, openStep],
  );

  const onSkipDates = useCallback(() => {
    onPatch({ checkin: undefined, checkout: undefined });
    openStep("guests");
  }, [onPatch, openStep]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      animate={{ y: 0 }}
      initial={{ y: "100%" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="fixed inset-0 z-[1000] flex h-[100dvh] w-full flex-col bg-surface-muted"
    >
      <header className="flex shrink-0 items-center justify-between border-b bg-surface px-4 py-3">
        <button
          type="button"
          onClick={requestClose}
          aria-label={t("common.close")}
          className="flex size-9 items-center justify-center rounded-full border border-line"
        >
          <ContentImage
            alt=""
            width={14}
            height={14}
            className="size-3.5"
            src="/assets/icons/adds/x_mark.svg"
          />
        </button>

        <p className="text-sm font-bold">{t("search.heroSheetTitle")}</p>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-ink-subtle underline underline-offset-4"
        >
          {t("search.heroClearAll")}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3">
        <div id="hero-step-where">
          <HeroStepCard
            icon={STEP_ICON.where}
            isActive={step === "where"}
            title={t("header.searchPlaceholder")}
            onOpen={() => openStep("where")}
            hasBeenOpened={visited.includes("where")}
            summary={draft.cityTitle || draft.q || ""}
          >
            <SearchInlinePanel
              isActive={step === "where"}
              onTermChange={(term) =>
                onPatch({
                  ...CLEARED_DRAFT_TARGET,
                  q: term,
                  cityTitle: undefined,
                })
              }
              onPickPlace={(option) => {
                onPatch(searchOptionToDraft(option));
                openStep("dates");
              }}
              onSubmitTerm={() => openStep("dates")}
            />
          </HeroStepCard>
        </div>

        <div id="hero-step-dates">
          <HeroStepCard
            icon={STEP_ICON.dates}
            isActive={step === "dates"}
            title={t("search.heroStepDates")}
            onOpen={() => openStep("dates")}
            hasBeenOpened={visited.includes("dates")}
            summary={
              datesSummary || skippedSummary("dates", t("search.heroAnyDate"))
            }
          >
            <div className="flex flex-col gap-2 p-3">
              <SearchDateRangePicker
                setSelectedDay={onPickDay}
                selectedDates={{
                  startDate: draft.checkin
                    ? moment(draft.checkin).format(JALALI_FORMAT)
                    : null,
                  endDate: draft.checkout
                    ? moment(draft.checkout).format(JALALI_FORMAT)
                    : null,
                }}
              />
              <button
                type="button"
                onClick={onSkipDates}
                className="self-center py-1 text-xs text-link underline underline-offset-4"
              >
                {t("search.heroDatesFlexible")}
              </button>
            </div>
          </HeroStepCard>
        </div>

        <div id="hero-step-guests">
          <HeroStepCard
            icon={STEP_ICON.guests}
            isActive={step === "guests"}
            title={t("search.heroStepGuests")}
            onOpen={() => openStep("guests")}
            hasBeenOpened={visited.includes("guests")}
            summary={
              draft.total_guests
                ? `${t("common.people", { count: Number(draft.total_guests) })}`
                : skippedSummary("guests", t("search.heroAnyGuests"))
            }
          >
            <HeroGuestsStep
              value={draft.total_guests}
              onChange={(value) => onPatch({ total_guests: value })}
            />
          </HeroStepCard>
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t bg-surface px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3">
        <p className="min-w-0 flex-1 truncate text-xs text-ink-muted">
          {count === 0 ? (
            <span className={isCountStale ? "opacity-50" : ""}>
              {t("search.heroNoMatch")}
            </span>
          ) : (
            t("search.heroMobileTriggerHint")
          )}
        </p>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="btn-primary flex h-11 min-w-32 items-center justify-center gap-2 rounded-full bg-action px-6 text-sm font-bold disabled:bg-line-strong"
        >
          {isPending ? <BtnLoading /> : t("search.search")}
        </button>
      </footer>
    </motion.div>,
    document.body,
  );
};

export default HeroSearchSheet;
