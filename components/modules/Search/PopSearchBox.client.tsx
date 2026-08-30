"use client";

import type { PopSearchBoxProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { ContentImage } from "@elements/Image";
import { Suspense, useState } from "react";

import SearchQueryParamSync from "./parts/SearchQueryParamSync.client";
import SearchOverlay from "./parts/SearchOverlay.client";

const OPEN_PANEL_CLASS =
  "w-full top-0 min-h-[25dvh] max-h-[90dvh] lg:max-h-[50dvh] xl:h-auto xl:absolute opacity-100 min-w-[25dvw] lg:min-h-[25dvh]";
const CLOSED_PANEL_CLASS = "top-[-200dvh] xl:top-0 -z-50 xl:hidden h-0 xl:opacity-0";

/** The compact search trigger used by the header and the home search bar. */
const PopSearchBox = ({
  boxId = "SEARCH_BOX",
  containerClass = " w-full md:w-[80%] mx-auto",
  initValue,
  item,
  justIcon = false,
  onSubmit,
  placeholder = "search...",
}: PopSearchBoxProps) => {
  const [showPop, setShowPop] = useState(false);
  const {
    close,
    inputRef,
    isLoading,
    isPending,
    onSearchParam,
    open,
    setTerm,
    submit,
    suggestions,
    term,
  } = useSearchPanel({ initValue, isOpen: showPop, onOpenChange: setShowPop, onSubmit });

  return (
    <div className={`${containerClass} relative`}>
      <Suspense>
        <SearchQueryParamSync onSearchParam={onSearchParam} />
      </Suspense>

      {justIcon ? (
        <button type="button" onClick={open} aria-label={placeholder}>
          <ContentImage
            alt=""
            width={20}
            height={20}
            src="/assets/icons/edit/magnifier.svg"
          />
        </button>
      ) : (
        <button
          id={boxId}
          type="button"
          onClick={open}
          className={`bg-transparent border rounded-20 px-4 py-1.5 w-full overflow-hidden flex justify-between items-center ${item?.bg ?? ""}`}
        >
          <span className="flex items-center gap-1 w-full">
            <span
              className={`bg-transparent text-base lg:text-sm line-clamp-1 py-1 pl-3 pr-0.5 w-full text-right ${term ? "" : "opacity-50"}`}
            >
              {term || placeholder}
            </span>
          </span>
          <span className="inline-flex w-1/5 justify-end" />
        </button>
      )}

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
        panelClass={showPop ? OPEN_PANEL_CLASS : CLOSED_PANEL_CLASS}
      />
    </div>
  );
};

export default PopSearchBox;
