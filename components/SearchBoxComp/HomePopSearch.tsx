"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dispatch, SetStateAction, Suspense } from "react";
import { useSearchSuggestions } from "@features/search/hooks/useSearchSuggestions";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useSearchParams } from "next/navigation";
import { useCitiesStore } from "@/store";

import { SearchBoxCitySelector } from "@modules/HomeCities";
import SearchBoxCitiesPart from "./SearchBoxCitiesPart";
import SuggestedPart from "./SuggestedPart";
import { BtnLoading } from "@elements/Button";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";

const HistorySuggPart = dynamic(() => import("./HistorySuggPart"), {
  ssr: true,
});
const SearchBoxPopularPlaces = dynamic(
  () => import("./SearchBoxPopularPlaces"),
  { ssr: true },
);

const SearchParamExtractor = ({
  onSearchParam,
}: {
  onSearchParam: (param: string | null) => void;
}) => {
  const searchParam = useSearchParams().get("q");
  useEffect(() => {
    onSearchParam(searchParam);
  }, [searchParam, onSearchParam]);
  return null;
};

interface props {
  boxId?: string;
  showPop: boolean;
  justIcon?: boolean;
  autofocus?: boolean;
  cancelText?: string;
  placeholder?: string;
  containerClass?: string;
  onClear: () => void | null;
  initValue?: string | undefined;
  errors?: { [key: string]: string[] };
  onSubmit: (e: string | null) => void | null;
  setShowPop: Dispatch<SetStateAction<boolean>>;
  item?: {
    bg?: string;
  };
}

const HomePopSearch = ({
  placeholder = "search...",
  onSubmit,
  initValue,
  containerClass = " w-full md:w-[80%] mx-auto",
  boxId = "SEARCH_BOX",
  setShowPop,
  showPop,
}: props) => {
  const primeInputRef = useRef<HTMLInputElement>(null);
  const { locationsData } = useCitiesStore();
  const [text, setText] = useState(initValue || "");

  const {
    data: suggsData,
    isLoading,
    isDebouncing,
  } = useSearchSuggestions(text, showPop);

  useEffect(() => {
    if (!!showPop) {
      const timeout = setTimeout(() => {
        primeInputRef?.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [showPop]);

  const handleSearchParam = useCallback(
    (param: string | null) => {
      if (!param) return;
      setText(param);
      onSubmit(param);
      setShowPop(false);
    },
    [onSubmit, setShowPop],
  );

  function handleChange(text: string) {
    setText(text);
  }

  useEffect(() => {
    document.body.style.overflow = showPop ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPop]);

  const { mutate, isPending } = usePropertySearch(() => setShowPop(false));

  return (
    <div className={`${containerClass}  relative`}>
      <Suspense>
        <SearchParamExtractor onSearchParam={handleSearchParam} />
      </Suspense>

      <div
        className={` ${
          showPop
            ? `   w-full xl:w-1/2  top-0   min-h-[25dvh]   max-h-[90dvh]  lg:max-h-[50dvh]  xl:h-auto  xl:absolute   xl:top-[35dvh] left-0 right-0 xl:mx-auto   opacity-100  min-w-[25dvw]  lg:min-h-[25dvh] `
            : ` top-[-200dvh]  xl:top-0  -z-50  xl:hidden  h-0 xl:opacity-0`
        } transition-all   flex flex-col items-center justify-between pb-4  fixed  overflow-y-scroll    rounded-b-10 border shadow-card  left-0 w-full -top-2  duration-500 z-50  bg-white `}
      >
        <div className="flex px-4  pt-4 items-center relative w-full gap-2 flex-row ">
          <div className=" relative flex items-center rounded-full border-neutral-200   w-full py-1.5   gap-1 px-1.5 pr-3   border-2 ">
            {" "}
            <input
              value={text}
              ref={primeInputRef}
              id={`${boxId}prime`}
              placeholder={placeholder}
              onChange={(v) => handleChange(v.target.value)}
              className={`bg-transparent w-full placeholder:text-sm `}
            />
            <div
              onClick={
                !!isPending
                  ? undefined
                  : () => {
                      mutate({ q: text });
                    }
              }
              className="  cursor-pointer h-8 w-8  flex items-center justify-center  p-2 absolute left-0.5 aspect-square rounded-full  bg-brand-600"
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

        {!isEmpty(locationsData?.regions) ||
        !isEmpty(locationsData?.cities) ||
        !isEmpty(locationsData?.provinces) ? (
          <SearchBoxCitiesPart setShowPop={setShowPop} />
        ) : (
          <></>
        )}
        <SuggestedPart
          data={suggsData}
          searchedText={text}
          setShowPop={setShowPop}
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
        <Suspense>
          {" "}
          <SearchBoxPopularPlaces setShowPop={setShowPop} />
        </Suspense>
        <SearchBoxCitySelector
          onSubmitCB={() => {
            setShowPop(false);
          }}
        />
      </div>
      <div
        onClick={() => {
          setShowPop(false);
        }}
        className={`fixed left-0  bg-black/35  lg:bg-transparent    top-0 w-full   transition-opacity   ${
          showPop ? " z-[11] h-[100dvh]  opacity-100" : " opacity-0 -z-10  h-0"
        } `}
      ></div>
    </div>
  );
};

export default HomePopSearch;
