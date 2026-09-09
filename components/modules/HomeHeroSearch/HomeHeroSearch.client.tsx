"use client";

import type { HomeHeroSearchProps } from "@/types/components/modules/home-hero-search";
import { useHeroSearch } from "@features/search/hooks/useHeroSearch";
import { HeroDestinationSearch } from "@modules/Search";
import { ContentImage } from "@elements/Image";
import { useCallback, useState } from "react";

import HeroGuestsField from "./parts/HeroGuestsField.client";
import HeroDatesField from "./parts/HeroDatesField.client";
import HeroMobileTrigger from "./parts/HeroMobileTrigger";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import dynamic from "next/dynamic";

const DAY_MONTH_FORMAT = "jD jMMMM";

const SUMMARY_SEPARATOR = "، ";

const importHeroSearchSheet = () => import("./parts/HeroSearchSheet.client");

const HeroSearchSheet = dynamic(importHeroSearchSheet, { ssr: false });

const HomeHeroSearch = ({
  isPhone,
  totalProperties,
  variant = "hero",
}: HomeHeroSearchProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { count, draft, isCountStale, isPending, patch, reset, submit } =
    useHeroSearch(isSheetOpen);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const summary = {
    title: draft.cityTitle || draft.q || "",
    detail: [
      draft.checkin
        ? `${moment(draft.checkin).format(DAY_MONTH_FORMAT)}${
            draft.checkout
              ? ` - ${moment(draft.checkout).format(DAY_MONTH_FORMAT)}`
              : ""
          }`
        : "",
      draft.total_guests ? `${draft.total_guests} ${_STRINGS.PERSON}` : "",
    ]
      .filter(Boolean)
      .join(SUMMARY_SEPARATOR),
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {isPhone ? (
        <>
          <HeroMobileTrigger
            summary={summary}
            variant={variant}
            onPreload={importHeroSearchSheet}
            onOpen={() => setIsSheetOpen(true)}
          />

          {isSheetOpen ? (
            <HeroSearchSheet
              count={count}
              draft={draft}
              onPatch={patch}
              onReset={reset}
              onSubmit={submit}
              onClose={closeSheet}
              isPending={isPending}
              isCountStale={isCountStale}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="surface-panel relative flex w-full flex-nowrap items-center gap-0 !rounded-full p-1 shadow-glass md:p-1.5">
          <HeroDestinationSearch
            label={_STRINGS.HERO_WHERE_LABEL}
            value={draft.cityTitle || draft.q}
            onTermChange={(term) =>
              patch({
                q: term,
                cities: undefined,
                cityTitle: undefined,
                landingUrl: undefined,
              })
            }
            onPickPlace={(option) => {
              const cityId = option.locations?.cities?.[0]?.id;
              patch({
                q: option.label,
                cityTitle: option.label,
                cities: cityId ? String(cityId) : undefined,
                landingUrl: option.href.startsWith("/rooms")
                  ? undefined
                  : option.href,
              });
            }}
          />

          <span className="h-7 w-px shrink-0 bg-neutral-200" />

          <div className="flex min-w-0 flex-1">
            <HeroDatesField
              checkin={draft.checkin}
              checkout={draft.checkout}
              onChange={(next) => patch(next)}
            />
          </div>

          <span className="h-7 w-px shrink-0 bg-neutral-200" />

          <div className="flex min-w-0 flex-1">
            <HeroGuestsField
              value={draft.total_guests}
              onChange={(value) => patch({ total_guests: value })}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            aria-label={_STRINGS.SEARCH}
            className="btn-primary flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-600 transition-colors hover:bg-brand-700 disabled:bg-neutral-300 md:size-10"
          >
            <ContentImage
              alt=""
              width={20}
              height={20}
              className="size-4 shrink-0 brightness-0 invert md:size-[1.125rem]"
              src="/assets/icons/edit/magnifier.svg"
            />
          </button>
        </div>
      )}

      {variant === "hero" && totalProperties ? (
        <p className="text-xs text-white/90 drop-shadow-sm">
          <span className="font-bold">{numberWithCommas(totalProperties)}</span>{" "}
          {_STRINGS.HERO_ACTIVE_PROPERTIES}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HomeHeroSearch;
