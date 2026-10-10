"use client";

import { HeroDestinationSearch } from "@modules/Search";
import { useCallback, useState } from "react";
import {CLEARED_DRAFT_TARGET} from "@features/search/lib/search-option-draft";
import {searchOptionToDraft} from "@features/search/lib/search-option-draft";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { useHeroSearch } from "@features/search/hooks/useHeroSearch";
import { ContentImage } from "@elements/Image";

import type { HomeHeroSearchProps } from "@/types/components/modules/home-hero-search";

import HeroMobileTrigger from "./parts/HeroMobileTrigger";
import dynamic from "next/dynamic";
import moment from "moment-jalaali";

const DAY_MONTH_FORMAT = "jD jMMMM";


const importHeroSearchSheet = () => import("./parts/HeroSearchSheet.client");

const HeroSearchSheet = dynamic(importHeroSearchSheet, { ssr: false });

const HomeHeroSearch = ({ isPhone, variant = "hero" }: HomeHeroSearchProps) => {
  const t = useTranslations();
  const sep = useListSeparator();

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
      draft.total_guests
        ? `${t("common.people", { count: Number(draft.total_guests) })}`
        : "",
    ]
      .filter(Boolean)
      .join(sep),
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
        <div className="surface-panel relative flex w-full flex-nowrap items-center gap-0 !rounded-full p-1 shadow-glass">
          <HeroDestinationSearch
            label={t("search.heroWhereLabel")}
            value={draft.cityTitle || draft.q}
            onTermChange={(term) =>
              patch({ ...CLEARED_DRAFT_TARGET, q: term, cityTitle: undefined })
            }
            onPickPlace={(option) => {
              patch(searchOptionToDraft(option));
            }}
          />

          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            aria-label={t("search.search")}
            className="btn-primary flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 transition-colors hover:bg-brand-700 disabled:bg-neutral-300 md:size-9"
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
    </div>
  );
};

export default HomeHeroSearch;
