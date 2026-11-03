"use client";

import { Suspense, useCallback } from "react";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";

import type { HomePopSearchProps } from "@/types/components/modules/search";

import SearchQueryParamSync from "./parts/SearchQueryParamSync.client";
import SearchOverlay from "./parts/SearchOverlay.client";

const OPEN_PANEL_CLASS =
  "w-full xl:w-1/2 top-0 min-h-[25dvh] max-h-[90dvh] lg:max-h-[50dvh] xl:h-auto xl:absolute xl:top-[35dvh] end-0 start-0 xl:mx-auto opacity-100 min-w-[25dvw] lg:min-h-[25dvh]";
const CLOSED_PANEL_CLASS =
  "top-[-200dvh] xl:top-0 -z-50 xl:hidden h-0 xl:opacity-0";

const HomePopSearch = ({
  showPop,
  onSubmit,
  initValue,
  setShowPop,
  boxId = "SEARCH_BOX",
  placeholder = "search...",
  containerClass = " w-full md:w-[80%] mx-auto",
}: HomePopSearchProps) => {
  const onOpenChange = useCallback(
    (open: boolean) => setShowPop(open),
    [setShowPop],
  );
  const {
    activeIndex,
    close,
    hasOpened,
    inputRef,
    isLoading,
    isPending,
    isStale,
    listRef,
    onKeyDown,
    onSearchParam,
    options,
    pick,
    setActiveIndex,
    setTerm,
    submit,
    term,
  } = useSearchPanel({ initValue, isOpen: showPop, onOpenChange, onSubmit });

  return (
    <div className={`${containerClass} relative`}>
      <Suspense>
        <SearchQueryParamSync onSearchParam={onSearchParam} />
      </Suspense>

      <SearchOverlay
        term={term}
        boxId={boxId}
        onPick={pick}
        onClose={close}
        isOpen={showPop}
        onSubmit={submit}
        options={options}
        listRef={listRef}
        inputRef={inputRef}
        isStale={isStale}
        isLoading={isLoading}
        isPending={isPending}
        onKeyDown={onKeyDown}
        hasOpened={hasOpened}
        onTermChange={setTerm}
        onHover={setActiveIndex}
        activeIndex={activeIndex}
        placeholder={placeholder}
        submitButtonClass="end-0.5"
        panelClass={showPop ? OPEN_PANEL_CLASS : CLOSED_PANEL_CLASS}
      />
    </div>
  );
};

export default HomePopSearch;
