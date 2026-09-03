"use client";

import type { HeroDestinationSearchProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { useCallback, useState } from "react";
import { useCitiesStore } from "@/store";

import SearchOverlay from "./parts/SearchOverlay.client";
import _STRINGS from "@/utils/LocalStrings";

const OPEN_PANEL_CLASS =
  "w-full top-0 min-h-[25dvh] max-h-[90dvh] lg:max-h-[55dvh] xl:h-auto xl:absolute opacity-100 min-w-[25dvw]";
const CLOSED_PANEL_CLASS =
  "top-[-200dvh] xl:top-0 -z-50 xl:hidden h-0 xl:opacity-0";

/**
 * The "where" cell of the hero search.
 *
 * It lives in the Search module rather than beside the rest of the hero because
 * it needs `SearchOverlay`, and a module's parts are private to it — putting the
 * field here keeps that boundary intact and keeps every surface that renders the
 * suggestion panel in one place.
 *
 * The difference from `PopSearchBox` is only what happens on pick: a place is
 * reported upward and staged, not navigated to. Free text is left in the term
 * for the parent to resolve at submit, because "ویلا تبریز" is a city plus a
 * property type and only `/extract` knows that.
 */
const HeroDestinationSearch = ({
  boxId = "HERO_SEARCH_BOX",
  label,
  onPickPlace,
  onTermChange,
  value,
}: HeroDestinationSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onPickOption = useCallback(
    (option?: Parameters<NonNullable<typeof onPickPlace>>[0]) => {
      if (!option) return;
      if (option.kind === "place") {
        // Same seeding the navigating path does, so the listing page can label
        // the chips without re-resolving ids out of the URL.
        useCitiesStore.setState({ locationsData: option.locations ?? {} });
      }
      onPickPlace?.(option);
      setIsOpen(false);
    },
    [onPickPlace],
  );

  const {
    activeIndex,
    close,
    hasOpened,
    inputRef,
    isLoading,
    isPending,
    listRef,
    onKeyDown,
    options,
    pick,
    setActiveIndex,
    setTerm,
    term,
  } = useSearchPanel({
    isOpen,
    onOpenChange: setIsOpen,
    onPickOption,
  });

  // Typing is reported up as it happens so the closed field shows what was
  // typed, and so submit can resolve it even if the panel was never used.
  const onChangeTerm = useCallback(
    (next: string) => {
      setTerm(next);
      onTermChange?.(next);
    },
    [onTermChange, setTerm],
  );

  return (
    <div className="relative min-w-0 flex-1">
      <button
        id={boxId}
        type="button"
        onClick={() => setIsOpen(true)}
        className="hero-field"
      >
        <span className="hero-field-label">{label}</span>
        <span
          className={`hero-field-value ${
            value ? "font-medium text-neutral-900" : "text-neutral-400"
          }`}
        >
          {value || _STRINGS.HERO_WHERE_EMPTY}
        </span>
      </button>

      <SearchOverlay
        term={term}
        boxId={boxId}
        onPick={pick}
        onClose={close}
        isOpen={isOpen}
        options={options}
        listRef={listRef}
        inputRef={inputRef}
        isLoading={isLoading}
        isPending={isPending}
        onKeyDown={onKeyDown}
        hasOpened={hasOpened}
        onHover={setActiveIndex}
        onTermChange={onChangeTerm}
        activeIndex={activeIndex}
        placeholder={_STRINGS.HERO_WHERE_PLACEHOLDER}
        // Enter with no highlighted row closes the panel and lets the hero's own
        // submit run, so the free text arrives together with dates and guests
        // rather than navigating on its own.
        onSubmit={() => setIsOpen(false)}
        panelClass={isOpen ? OPEN_PANEL_CLASS : CLOSED_PANEL_CLASS}
      />
    </div>
  );
};

export default HeroDestinationSearch;
