"use client";

import { Menu, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { useSearchSuggestions } from "@features/search/hooks/useSearchSuggestions";
import { Suspense, useEffect } from "react";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useCitiesStore } from "@/store";

import SearchBoxPopularPlaces from "./SearchBoxPopularPlaces";
import SeachBoxCitySelector from "../Home/HomeCityFilterContainer/SeachBoxCitySelector";
import SearchBoxCitiesPart from "./SearchBoxCitiesPart";
import HistorySuggPart from "./HistorySuggPart";
import SuggestedPart from "./SuggestedPart";
import { BtnLoading } from "@elements/Button";
import isEmpty from "lodash/isEmpty";
interface props {
  boxId?: string;
  color?: string;
  placeholder?: string;
  containerClass?: string;
  onClear?: () => void | null;
  initValue?: string | undefined;
  errors?: { [key: string]: string[] };
  onSubmit?: (e: string | null) => void | null;
  item?: {
    bg?: string;
  };
}

const SearchBoxDropDown = ({
  item,
  initValue,
  placeholder = "search...",
  containerClass = "w-[90%] mx-auto",
  boxId = "SEARCH_BOX",
}: props) => {
  const [showResults, setShowResults] = useState(false);
  const { locationsData } = useCitiesStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const primeInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(initValue || "");

  const {
    data: suggsData,
    isLoading,
    isDebouncing,
  } = useSearchSuggestions(text, showResults);

  useEffect(() => {
    if (!!showResults) {
      const timeout = setTimeout(() => {
        primeInputRef?.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [showResults]);

  function handleChange(text: string) {
    setText(text);
  }

  useEffect(() => {
    document.body.style.overflow = showResults ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showResults]);

  const { mutate, isPending } = usePropertySearch(() => setShowResults(false));

  return (
    <div className={containerClass}>
      <Menu
        onClick={() => {
          setShowResults(true);
        }}
        onBlur={() => {
          setShowResults(false);
        }}
        as="div"
        className="relative w-full  inline-block text-left "
      >
        {" "}
        <div
          onClick={() => {
            setShowResults(true);
          }}
          className={`bg-white/50 rounded-20  w-full  overflow-hidden    pr-4 pl-2 flex justify-between items-center  ${item?.bg}`}
        >
          <div className="flex items-center w-full">
            <input
              id={boxId}
              value={text}
              ref={inputRef}
              placeholder={placeholder}
              onChange={(v) => handleChange(v.target.value)}
              className={`bg-transparent  py-1 pl-0.5 pr-3 outline-none  w-full ${item?.bg} `}
            />
          </div>
          <div className="inline-flex w-1/4 justify-end">
            <div
              onClick={
                !!isPending
                  ? undefined
                  : (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      mutate({ q: text });
                    }
              }
              className={` ${text ? "  " : " opacity-0"}  transition-all  cursor-pointer h-10 w-10  top-0  bottom-0 my-0 flex items-center justify-center    left-1 aspect-square rounded-full  bg-brand-600 `}
            >
              {!!isPending ? (
                <BtnLoading />
              ) : (
                <img
                  src="/assets/icons/edit/magnifier.svg"
                  className="w-5  grayscale invert  brightness-200 h-5 aspect-square   "
                />
              )}
            </div>
          </div>
        </div>
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
          <MenuItems className="absolute w-full  pb-2 md:top-auto left-0 z-20  mt-2  origin-top-center  rounded-20   bg-white  custome-shadow-card focus:outline-none  overflow-scroll">
            <div
              onMouseLeave={() => {}}
              className="flex gap-2 w-full items-center flex-col px-2 py-2"
            >
              {!isEmpty(locationsData?.regions) ||
              !isEmpty(locationsData?.cities) ||
              !isEmpty(locationsData?.provinces) ? (
                <MenuItem>
                  <SearchBoxCitiesPart setShowPop={setShowResults} />
                </MenuItem>
              ) : (
                <></>
              )}
              <SuggestedPart
                data={suggsData}
                searchedText={text}
                setShowPop={setShowResults}
                isLoading={isLoading || isDebouncing}
              />
              <Suspense>
                {" "}
                <HistorySuggPart
                  handleChange={(e) => {
                    handleChange(e);
                  }}
                />
              </Suspense>
              <SearchBoxPopularPlaces setShowPop={setShowResults} />
              <SeachBoxCitySelector
                onSubmitCB={() => {
                  setShowResults(false);
                }}
              />
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default SearchBoxDropDown;
