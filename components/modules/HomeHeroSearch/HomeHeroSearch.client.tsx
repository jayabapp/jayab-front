"use client";

import type { HomeHeroSearchProps } from "@/types/components/modules/home-hero-search";
import { useHeroSearch } from "@features/search/hooks/useHeroSearch";
import { HeroDestinationSearch } from "@modules/Search";
import { ContentImage } from "@elements/Image";

import HeroGuestsField from "./parts/HeroGuestsField.client";
import HeroDatesField from "./parts/HeroDatesField.client";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";

/**
 * The home page's search bar: where, when, how many.
 *
 * Replaces a pair of controls that could only express "some text" and "a city".
 * Dates and party size are the two filters that decide whether a property is
 * even bookable, `/rooms` has always supported them, and until now the entry
 * point to the site could not say them — so every visitor arrived at an
 * unfiltered catalogue and had to discover the filter panel to narrow it.
 *
 * Nothing here navigates on its own. The old city control jumped straight to
 * `/rooms` the moment a city was picked, which made choosing a city *and* dates
 * impossible in one pass.
 */
const HomeHeroSearch = ({ totalProperties }: HomeHeroSearchProps) => {
  const { draft, isPending, patch, submit } = useHeroSearch();

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="surface-panel flex w-full items-center gap-0 !rounded-full p-1 shadow-glass md:p-1.5">
        <HeroDestinationSearch
          label={_STRINGS.HERO_WHERE_LABEL}
          value={draft.cityTitle || draft.q}
          onTermChange={(term) =>
            // Typing replaces a previously picked city: the visitor is plainly
            // describing somewhere else, and keeping the old id would filter by
            // a place they can no longer see in the field.
            patch({ q: term, cities: undefined, cityTitle: undefined })
          }
          onPickPlace={(option) => {
            const cityId = option.locations?.cities?.[0]?.id;
            patch({
              q: option.label,
              cityTitle: option.label,
              cities: cityId ? String(cityId) : undefined,
            });
          }}
        />

        <span className="hidden h-7 w-px shrink-0 bg-neutral-200 sm:block" />

        <div className="hidden min-w-0 flex-1 sm:flex">
          <HeroDatesField
            checkin={draft.checkin}
            checkout={draft.checkout}
            onChange={(next) => patch(next)}
          />
        </div>

        <span className="hidden h-7 w-px shrink-0 bg-neutral-200 sm:block" />

        <div className="hidden min-w-0 flex-1 sm:flex">
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

      {/* On a phone the bar carries only "where" plus the submit, and the two
          short answers share a second row. Four cells across 358px would leave
          each one too narrow to show a city name, and stacking them one per row
          made the search taller than the hero image behind it. */}
      <div className="surface-panel flex w-full items-center !rounded-full p-1 sm:hidden">
        <div className="min-w-0 flex-1">
          <HeroDatesField
            checkin={draft.checkin}
            checkout={draft.checkout}
            onChange={(next) => patch(next)}
          />
        </div>
        <span className="h-7 w-px shrink-0 bg-neutral-200" />
        <div className="min-w-0 flex-1">
          <HeroGuestsField
            value={draft.total_guests}
            onChange={(value) => patch({ total_guests: value })}
          />
        </div>
      </div>

      {totalProperties ? (
        <p className="text-xs text-white/90 drop-shadow-sm">
          <span className="font-bold">
            {numberWithCommas(totalProperties)}
          </span>{" "}
          {_STRINGS.HERO_ACTIVE_PROPERTIES}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HomeHeroSearch;
