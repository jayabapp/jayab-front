"use client";

import type { SearchBoxDropDownProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { ContentImage } from "@elements/Image";
import { Transition } from "@headlessui/react";
import { BtnLoading } from "@elements/Button";
import { Fragment, useState } from "react";

import SearchPanelBody from "./parts/SearchPanelBody.client";
import _STRINGS from "@/utils/LocalStrings";

/** Desktop variant: the input stays inline and the results hang below it. */
const SearchBoxDropDown = ({
  boxId = "SEARCH_BOX",
  containerClass = "w-[90%] mx-auto",
  initValue,
  item,
  placeholder = "search...",
}: SearchBoxDropDownProps) => {
  const [showResults, setShowResults] = useState(false);
  const { close, isLoading, isPending, setTerm, submit, suggestions, term } =
    useSearchPanel({
      initValue,
      isOpen: showResults,
      onOpenChange: setShowResults,
    });

  return (
    <div className={containerClass}>
      <div
        className="relative w-full inline-block text-left"
        onBlur={(event) => {
          // Only close once focus actually leaves the dropdown, otherwise moving
          // from the input to a result would dismiss the list before the click.
          if (!event.currentTarget.contains(event.relatedTarget)) setShowResults(false);
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!isPending) submit();
          }}
          onFocus={() => setShowResults(true)}
          className={`bg-white/50 rounded-20 w-full overflow-hidden pr-4 pl-2 flex justify-between items-center ${item?.bg ?? ""}`}
        >
          <div className="flex items-center w-full">
            <input
              id={boxId}
              value={term}
              placeholder={placeholder}
              onChange={(event) => setTerm(event.target.value)}
              className={`bg-transparent py-1 pl-0.5 pr-3 outline-none w-full ${item?.bg ?? ""}`}
            />
          </div>
          <div className="inline-flex w-1/4 justify-end">
            <button
              type="submit"
              disabled={isPending}
              aria-label={_STRINGS.SEARCH}
              className={`${term ? "" : "opacity-0 pointer-events-none"} transition-all cursor-pointer h-10 w-10 top-0 bottom-0 my-0 flex items-center justify-center left-1 aspect-square rounded-full bg-brand-600`}
            >
              {isPending ? (
                <BtnLoading />
              ) : (
                <ContentImage
                  alt=""
                  width={20}
                  height={20}
                  src="/assets/icons/edit/magnifier.svg"
                  className="w-5 grayscale invert brightness-200 h-5 aspect-square"
                />
              )}
            </button>
          </div>
        </form>

        <Transition
          as={Fragment}
          show={showResults}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="absolute w-full pb-2 md:top-auto left-0 z-20 mt-2 origin-top-center rounded-20 bg-white custome-shadow-card focus:outline-none overflow-scroll">
            <div className="flex gap-2 w-full items-center flex-col px-2 py-2">
              <SearchPanelBody
                term={term}
                onClose={close}
                isLoading={isLoading}
                onTermChange={setTerm}
                suggestions={suggestions}
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default SearchBoxDropDown;
