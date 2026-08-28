"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchSuggestions } from "@features/search/hooks/useSearchSuggestions";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useSearchParams } from "next/navigation";
import { useCitiesStore } from "@/store";

import SearchBoxPopularPlaces from "./SearchBoxPopularPlaces";
import SeachBoxCitySelector from "../Home/HomeCityFilterContainer/SeachBoxCitySelector";
import SearchBoxCitiesPart from "./SearchBoxCitiesPart";
import SuggestedPart from "./SuggestedPart";
import BtnLoading from "../shared/Button/BtnLoading";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";

const HistorySuggPart = dynamic(() => import("./HistorySuggPart"), {
  ssr: true,
});

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
  justIcon?: boolean;
  cancelText?: string;
  autofocus?: boolean;
  placeholder?: string;
  containerClass?: string;
  onClear: () => void | null;
  initValue?: string | undefined;
  errors?: { [key: string]: string[] };
  onSubmit: (e: string | null) => void | null;
  item?: {
    bg?: string;
  };
}

const PopSearchbox = ({
  item,
  onSubmit,
  initValue,
  justIcon = false,
  boxId = "SEARCH_BOX",
  placeholder = "search...",
  containerClass = " w-full md:w-[80%] mx-auto",
}: props) => {
  const { locationsData } = useCitiesStore();
  const [showPop, setShowPop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const primeInputRef = useRef<HTMLInputElement>(null);

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
    [onSubmit],
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
    <div className={`${containerClass} relative`}>
      <Suspense>
        <SearchParamExtractor onSearchParam={handleSearchParam} />
      </Suspense>
      {!!justIcon ? (
        <img
          src="/assets/icons/edit/magnifier.svg"
          onClick={() => {
            setShowPop(true);
          }}
          width={20}
          className="dark:invert"
          height={20}
        />
      ) : (
        <div
          onClick={() => {
            setShowPop(true);
          }}
          className={`bg-transparent border rounded-20  px-4 py-1.5  overflow-hidden dark:bg-zinc-600  flex justify-between items-center  ${item?.bg}`}
        >
          {" "}
          <div className="flex items-center gap-1 w-full">
            <div
              id={boxId}
              ref={inputRef}
              className={`bg-transparent text-base lg:text-sm  line-clamp-1 dark:bg-transparent py-1 pl-3 pr-0.5  w-full ${!text ? "opacity-50" : ""}  `}
            >
              {text || placeholder}{" "}
            </div>
          </div>{" "}
          <div className="inline-flex w-1/5 justify-end" />
        </div>
      )}
      <div
        className={` ${
          showPop
            ? `   w-full  top-0  min-h-[25dvh]  max-h-[90dvh]  lg:max-h-[50dvh]   xl:h-auto  xl:absolute  opacity-100  min-w-[25dvw]  lg:min-h-[25dvh] `
            : `  top-[-200dvh]  xl:top-0  -z-50  xl:hidden  h-0 xl:opacity-0`
        } transition-all    fixed  flex flex-col items-center justify-between pb-4   overflow-y-scroll    rounded-b-10  border shadow-card  left-0 w-full -top-2  duration-500 z-50  bg-white `}
      >
        <div className="flex px-4  pt-4 items-center relative w-full gap-2 flex-row ">
          <div className=" relative flex items-center rounded-full border-primary-200 dark:bg-transparent  w-full py-1.5   gap-1 px-1.5 pr-3   border-2 ">
            {" "}
            <input
              value={text}
              ref={primeInputRef}
              id={`${boxId}prime`}
              placeholder={placeholder}
              onChange={(v) => handleChange(v.target.value)}
              className={`bg-transparent w-full  placeholder:text-sm `}
            />
            <div
              onClick={
                !!isPending
                  ? undefined
                  : () => {
                      mutate({ q: text });
                    }
              }
              className="  cursor-pointer h-8 w-8  flex items-center justify-center  p-2 absolute left-1 aspect-square rounded-full  bg-primary-700"
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
          setShowPop={setShowPop}
          searchedText={text || ""}
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
        <SearchBoxPopularPlaces setShowPop={setShowPop} />
        <SeachBoxCitySelector
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

export default PopSearchbox;
