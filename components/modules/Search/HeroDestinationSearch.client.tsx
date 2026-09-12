"use client";

import type { HeroDestinationSearchProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropdownFit } from "@/hooks/useDropdownFit";
import { useCitiesStore } from "@/store";

import SearchOverlay from "./parts/SearchOverlay.client";
import _STRINGS from "@/utils/LocalStrings";

const CLOSE_ON_SCROLL_PX = 24;

const OPEN_PANEL_CLASS =
  "!absolute !left-0 !right-0 !top-[calc(100%+0.5rem)] w-full min-h-[12rem] hero-dropdown opacity-100 !rounded-20 min-w-[25dvw]";
const CLOSED_PANEL_CLASS =
  "!absolute !top-[calc(100%+0.5rem)] -z-50 hidden h-0 opacity-0";

const HeroDestinationSearch = ({
  boxId = "HERO_SEARCH_BOX",
  label,
  onPickPlace,
  onTermChange,
  value,
}: HeroDestinationSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  useDropdownFit(isOpen, anchorRef);

  useEffect(() => {
    if (!isOpen) return;
    const openedAt = window.scrollY;
    const closeOnPageScroll = () => {
      if (Math.abs(window.scrollY - openedAt) > CLOSE_ON_SCROLL_PX)
        setIsOpen(false);
    };
    window.addEventListener("scroll", closeOnPageScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeOnPageScroll);
  }, [isOpen]);

  const onPickOption = useCallback(
    (option?: Parameters<NonNullable<typeof onPickPlace>>[0]) => {
      if (!option) return;
      if (option.kind === "place")
        useCitiesStore.setState({ locationsData: option.locations ?? {} });
      onPickPlace?.(option);
      setIsOpen(false);
    },
    [onPickPlace],
  );

  const {
    pick,
    term,
    close,
    options,
    listRef,
    setTerm,
    inputRef,
    hasOpened,
    isStale,
    isLoading,
    isPending,
    onKeyDown,
    activeIndex,
    setActiveIndex,
  } = useSearchPanel({
    isOpen,
    lockScroll: false,
    onOpenChange: setIsOpen,
    onPickOption,
  });

  const onChangeTerm = useCallback(
    (next: string) => {
      setTerm(next);
      onTermChange?.(next);
    },
    [onTermChange, setTerm],
  );

  return (
    <div
      ref={anchorRef}
      data-hero-open={isOpen}
      className="static min-w-0 flex-[1.2]"
    >
      <button
        id={boxId}
        type="button"
        onClick={() => setIsOpen(true)}
        className="hero-field"
      >
        <span className="hero-field-label">{label}</span>
        {value ? (
          <span className="hero-field-value font-medium text-neutral-900">
            {value}
          </span>
        ) : null}
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
        isStale={isStale}
        isLoading={isLoading}
        isPending={isPending}
        onKeyDown={onKeyDown}
        hasOpened={hasOpened}
        onHover={setActiveIndex}
        activeIndex={activeIndex}
        onTermChange={onChangeTerm}
        onSubmit={() => setIsOpen(false)}
        placeholder={_STRINGS.HERO_WHERE_PLACEHOLDER}
        panelClass={isOpen ? OPEN_PANEL_CLASS : CLOSED_PANEL_CLASS}
      />
    </div>
  );
};

export default HeroDestinationSearch;
