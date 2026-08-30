"use client";

import type { HomePopSearchProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { Suspense, useCallback } from "react";

import SearchQueryParamSync from "./parts/SearchQueryParamSync.client";
import SearchOverlay from "./parts/SearchOverlay.client";

const OPEN_PANEL_CLASS =
  "w-full xl:w-1/2 top-0 min-h-[25dvh] max-h-[90dvh] lg:max-h-[50dvh] xl:h-auto xl:absolute xl:top-[35dvh] left-0 right-0 xl:mx-auto opacity-100 min-w-[25dvw] lg:min-h-[25dvh]";
const CLOSED_PANEL_CLASS = "top-[-200dvh] xl:top-0 -z-50 xl:hidden h-0 xl:opacity-0";

/** The home hero variant: the trigger lives in the banner, so the panel is controlled. */
const HomePopSearch = ({
  boxId = "SEARCH_BOX",
  containerClass = " w-full md:w-[80%] mx-auto",
  initValue,
  onSubmit,
  placeholder = "search...",
  setShowPop,
  showPop,
}: HomePopSearchProps) => {
  const onOpenChange = useCallback(
    (open: boolean) => setShowPop(open),
    [setShowPop],
  );
  const {
    close,
    inputRef,
    isLoading,
    isPending,
    onSearchParam,
    setTerm,
    submit,
    suggestions,
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
        onClose={close}
        isOpen={showPop}
        onSubmit={submit}
        inputRef={inputRef}
        isLoading={isLoading}
        isPending={isPending}
        onTermChange={setTerm}
        suggestions={suggestions}
        placeholder={placeholder}
        submitButtonClass="left-0.5"
        panelClass={showPop ? OPEN_PANEL_CLASS : CLOSED_PANEL_CLASS}
      />
    </div>
  );
};

export default HomePopSearch;
