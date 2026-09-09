"use client";

import type { HeroSearchSheetProps, HeroSearchStep } from "@/types/components/modules/home-hero-search";
import { SearchDateRangePicker, updateDateRange } from "@modules/PropertySearchFilters";
import { useOverlayBackButton } from "@hooks/useOverlayBackButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";
import { SearchInlinePanel } from "@modules/Search";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

import numberWithCommas from "@/helpers/numberWithCommas";
import HeroGuestsStep from "./HeroGuestsStep";
import _STRINGS from "@/utils/LocalStrings";
import HeroStepCard from "./HeroStepCard";
import moment from "moment-jalaali";

const DAY_MONTH_FORMAT = "jD jMMMM";
const JALALI_FORMAT = "jYYYY/jMM/jD";

const STEP_ICON: Record<HeroSearchStep, string> = {
  where: "/assets/icons/adds/pin_point_location.svg",
  dates: "/assets/icons/reserve/blue_calendar_reserve.svg",
  guests: "/assets/icons/reserve/blue_persons.svg",
};

/**
 * The hero search on phones: a full-screen sheet that asks where, when and how
 * many, one open step at a time.
 *
 * Full-screen rather than the shared `ModalBottomSheet`. That sheet caps itself
 * at 90dvh, and the destination step raises the keyboard — which would leave
 * roughly a third of the screen for a list of cities. A surface that owns the
 * viewport keeps the result list readable with the keyboard up.
 */
const HeroSearchSheet = ({
  count,
  draft,
  isCountStale,
  isPending,
  onClose,
  onPatch,
  onReset,
  onSubmit,
}: HeroSearchSheetProps) => {
  // Opening lands on the first unanswered question rather than always on
  // "where": re-opening to change the guest count should not walk back through a
  // city and a date range that are already settled.
  const [step, setStep] = useState<HeroSearchStep>(() =>
    !draft.cities && !draft.q ? "where" : !draft.checkin ? "dates" : "guests",
  );
  const [visited, setVisited] = useState<HeroSearchStep[]>(() => [step]);

  const openStep = useCallback((next: HeroSearchStep) => {
    setStep(next);
    setVisited((current) => (current.includes(next) ? current : [...current, next]));
  }, []);

  /**
   * "Any date" / "any number" is an answer, not a prompt, so a step only reads
   * that way once the user has been through it and moved on. Showing it while
   * the step is still open told them their question was already settled while
   * they were looking at the empty calendar.
   */
  const skippedSummary = (of: HeroSearchStep, label: string) =>
    visited.includes(of) && step !== of ? label : "";

  useBodyScrollLock(true);
  // Dismissing through the header also pops the history entry the hook pushed,
  // so the back gesture and the close button leave the stack in the same state.
  const requestClose = useOverlayBackButton(true, onClose);

  // Only the steps below the fold are scrolled to, and only once they become
  // active. Scrolling on the destination step would fight the keyboard it is
  // raising.
  useEffect(() => {
    if (step === "where") return;
    document
      .getElementById(`hero-step-${step}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const datesSummary = useMemo(() => {
    if (!draft.checkin) return "";
    const checkin = moment(draft.checkin).format(DAY_MONTH_FORMAT);
    return draft.checkout
      ? `${checkin} - ${moment(draft.checkout).format(DAY_MONTH_FORMAT)}`
      : `${checkin} - ...`;
  }, [draft.checkin, draft.checkout]);

  const onPickDay = useCallback(
    (day: string) =>
      updateDateRange({
        date: day,
        // `updateDateRange` calls back only once a checkout lands, which is
        // exactly when the question is answered and the flow should move on.
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
      className="fixed inset-0 z-[1000] flex h-[100dvh] w-full flex-col bg-neutral-50"
    >
      <header className="flex shrink-0 items-center justify-between border-b bg-white px-4 py-3">
        <button
          type="button"
          onClick={requestClose}
          aria-label={_STRINGS.CLOSE}
          className="flex size-9 items-center justify-center rounded-full border border-neutral-200"
        >
          <ContentImage
            alt=""
            width={14}
            height={14}
            className="size-3.5"
            src="/assets/icons/adds/x_mark.svg"
          />
        </button>

        <p className="text-sm font-bold">{_STRINGS.HERO_SHEET_TITLE}</p>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-neutral-500 underline underline-offset-4"
        >
          {_STRINGS.HERO_CLEAR_ALL}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3">
        <div id="hero-step-where">
          <HeroStepCard
            icon={STEP_ICON.where}
            isActive={step === "where"}
            title={_STRINGS.HERO_STEP_WHERE}
            onOpen={() => openStep("where")}
            hasBeenOpened={visited.includes("where")}
            summary={draft.cityTitle || draft.q || ""}
          >
            <SearchInlinePanel
              isActive={step === "where"}
              onTermChange={(term) =>
                onPatch({
                  q: term,
                  cities: undefined,
                  cityTitle: undefined,
                  landingUrl: undefined,
                })
              }
              onPickPlace={(option) => {
                const cityId = option.locations?.cities?.[0]?.id;
                onPatch({
                  q: option.label,
                  cityTitle: option.label,
                  cities: cityId ? String(cityId) : undefined,
                  landingUrl: option.href.startsWith("/rooms") ? undefined : option.href,
                });
                openStep("dates");
              }}
              // Enter commits the typed text as the destination and moves on,
              // rather than running the free-text search and abandoning the two
              // questions the sheet exists to ask.
              onSubmitTerm={() => openStep("dates")}
            />
          </HeroStepCard>
        </div>

        <div id="hero-step-dates">
          <HeroStepCard
            icon={STEP_ICON.dates}
            isActive={step === "dates"}
            title={_STRINGS.HERO_STEP_DATES}
            onOpen={() => openStep("dates")}
            hasBeenOpened={visited.includes("dates")}
            summary={datesSummary || skippedSummary("dates", _STRINGS.HERO_ANY_DATE)}
          >
            <div className="flex flex-col gap-2 p-3">
              <SearchDateRangePicker
                setSelectedDay={onPickDay}
                selectedDates={{
                  startDate: draft.checkin ? moment(draft.checkin).format(JALALI_FORMAT) : null,
                  endDate: draft.checkout ? moment(draft.checkout).format(JALALI_FORMAT) : null,
                }}
              />
              {/* The way out for the visitor who knows the city but not the
                  week. Without it a stepped flow quietly demands a date range
                  before it will show anything, which is the single largest
                  reason a stepped search converts worse than a flat one. */}
              <button
                type="button"
                onClick={onSkipDates}
                className="self-center py-1 text-xs text-brand-600 underline underline-offset-4"
              >
                {_STRINGS.HERO_DATES_FLEXIBLE}
              </button>
            </div>
          </HeroStepCard>
        </div>

        <div id="hero-step-guests">
          <HeroStepCard
            icon={STEP_ICON.guests}
            isActive={step === "guests"}
            title={_STRINGS.HERO_STEP_GUESTS}
            onOpen={() => openStep("guests")}
            hasBeenOpened={visited.includes("guests")}
            summary={
              draft.total_guests
                ? `${draft.total_guests} ${_STRINGS.PERSON}`
                : skippedSummary("guests", _STRINGS.HERO_ANY_GUESTS)
            }
          >
            <HeroGuestsStep
              value={draft.total_guests}
              onChange={(value) => onPatch({ total_guests: value })}
            />
          </HeroStepCard>
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3">
        <p className="min-w-0 flex-1 truncate text-xs text-neutral-600">
          {count === undefined ? (
            _STRINGS.HERO_MOBILE_TRIGGER_HINT
          ) : (
            <span className={isCountStale ? "opacity-50" : ""}>
              {count > 0
                ? `${numberWithCommas(count)} ${_STRINGS.RESULTS_FOUND_PREFIX}`
                : _STRINGS.HERO_NO_MATCH}
            </span>
          )}
        </p>

        {/* Never disabled. An empty draft is a legitimate search — it means
            "show me everything", and `submit` already routes that to `/rooms`
            unfiltered — so greying the button out would block a working path. */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="btn-primary flex h-11 min-w-32 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold disabled:bg-neutral-300"
        >
          {isPending ? <BtnLoading /> : _STRINGS.SEARCH}
        </button>
      </footer>
    </motion.div>,
    document.body,
  );
};

export default HeroSearchSheet;
