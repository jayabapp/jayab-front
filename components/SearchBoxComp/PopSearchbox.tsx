"use client";
import { HomeService } from "@/api_services/home/home.service";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { useCitiesStore } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce, isEmpty } from "lodash";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import SeachBoxCitySelector from "../Home/HomeCityFilterContainer/SeachBoxCitySelector";
import SmallLoading from "../shared/Lotties/SmallLoading";
import SearchBoxCitiesPart from "./SearchBoxCitiesPart";
import SearchBoxPopularPlaces from "./SearchBoxPopularPlaces";
import SuggestedPart from "./SuggestedPart";
const HistorySuggPart = dynamic(() => import("./HistorySuggPart"), { ssr: true });

// Separate client component that uses useSearchParams
const SearchParamExtractor = ({ onSearchParam }: { onSearchParam: (param: string | null) => void }) => {
  const searchParam = useSearchParams().get("q");

  useEffect(() => {
    onSearchParam(searchParam);
  }, [searchParam, onSearchParam]);

  return null;
};

interface props {
  initValue?: string | undefined;
  placeholder?: string;
  cancelText?: string;
  containerClass?: string;
  boxId?: string;
  autofocus?: boolean;
  justIcon?: boolean;

  onSubmit: (e: string | null) => void | null;
  onClear: () => void | null;
  errors?: { [key: string]: string[] };
  item?: {
    bg?: string;
  };
}

const PopSearchbox = ({
  placeholder = "search...",
  cancelText = "لغو",
  onSubmit,
  autofocus = true,
  initValue,
  onClear,
  containerClass = " w-full md:w-[80%] mx-auto",
  item,
  boxId = "SEARCH_BOX",
  justIcon = false,
}: props) => {
  const { locationsData } = useCitiesStore();
  const { push } = useRouter();
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const [showPop, setShowPop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const primeInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(initValue || "");

  const [isTyping, setisTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [element, setElement] = useState<HTMLInputElement | null>(null);
  const { data: suggsData, isLoading } = useQuery({
    queryKey: [HomeService.SEARCH_SUGGS_CACHEKEY, element?.value, isTyping],
    queryFn: () => {
      if (!isTyping) {
        if (!!element?.value) {
          return HomeService.GetSearchSuggs({ q: element.value });
        } else return null;
      } else return null;
    },
  });

  useEffect(() => {
    setElement(document.getElementById(`${boxId}prime`) as HTMLInputElement);
  }, []);

  useEffect(() => {
    if (!!showPop) {
      setTimeout(() => {
        primeInputRef?.current?.focus();
      }, 1000);
    }
  }, [showPop]);

  useEffect(() => {
    if (searchParam) {
      setText(searchParam);
      if (typeof onSubmit == "function") {
        onSubmit(searchParam);
        setShowPop(false);
      }
    }
  }, [searchParam]);

  useEffect(() => {
    if (!isTyping) {
      if (element) element.value = text;
      if (typeof onSubmit == "function" && element) {
        // onSubmit(element.value);
        // setShowPop(false);
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [isTyping]);

  const checkTyping = useCallback(
    debounce(() => {
      setisTyping(false);
    }, 200),
    [],
  );
  useEffect(() => {
    if (!element?.value && !searchParam) {
      onSubmit("");
      cancelSearch();
      setShowPop(false);
    }
  }, [searchParam]);

  function handleChange(text: string) {
    setText(text);
    setisTyping(true);
    checkTyping();
  }

  const cancelSearch = () => {
    if (element) {
      setText("");
      element.value = "";
      if (typeof onSubmit == "function") {
        setShowPop(false);
        onSubmit("");
      }
      onClear();
    }
  };

  useEffect(() => {
    !!showPop ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
  }, [showPop]);

  ////////////////////////////////////////////
  const { mutate, isPending } = useMutation({
    mutationKey: [HomeService.SEARCH_KEY],
    mutationFn: HomeService.Search,
    onSuccess: (data) => {
      if (!data?.client_query) return;

      /* -------------------------------------------------------------------------- */
      /*                              CITY STORE SETTER                             */
      /* -------------------------------------------------------------------------- */

      useCitiesStore.setState({
        locationsData: {
          cities: data?.cities_list?.filter((e) => e?.level == CitiesSuggestTypes.CITY),
          provinces: data?.cities_list?.filter((e) => e?.level == CitiesSuggestTypes.PROVINCE),
          regions: data?.cities_list?.filter((e) => e?.level == CitiesSuggestTypes.REGION),
        },
      });

      /* -------------------------------------------------------------------------- */
      /*                                 QUERY MAKER                                */
      /* -------------------------------------------------------------------------- */

      const createdQuery = Object.keys(data?.client_query)
        ?.map((e) => `${e}=${data?.client_query?.[e]}`)
        .join("&");
      const link = `/rooms?${createdQuery}`;
      setShowPop(false);
      push(link);
    },
  });

  return (
    <div className={`${containerClass} relative`}>
      <Suspense>
        <SearchParamExtractor onSearchParam={setSearchParam} />
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
            {/* <div className="">
              <img src="/assets/icons/edit/magnifier.svg" width={20} className="dark:invert" height={20} />
            </div> */}
            <div
              id={boxId}
              ref={inputRef}
              className={`bg-transparent text-base lg:text-sm  line-clamp-1 dark:bg-transparent py-1 pl-3 pr-0.5  w-full ${!text ? "opacity-50" : ""}  `}
              // onChange={(v) => handleChange(v.target.value)}
            >
              {" "}
              {text || placeholder}{" "}
            </div>
          </div>{" "}
          <div className="inline-flex w-1/5 justify-end">
            {loading && (
              <div className="ml-2">
                <SmallLoading />
              </div>
            )}

            {/* {element?.value && (
              <div
                className="text-rose-500  text-xs ml-3 cursor-pointer "
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  cancelSearch();
                }}
              >
                {cancelText}
              </div>
            )} */}
          </div>
        </div>
      )}
      {/* 
      <div
        className={` ${
          showPop ? `    top-0 ` : `  top-[200dvh] `
        } transition-all  fixed p-4 h-[100dvh]    rounded-10  border  left-0 w-full  duration-1000 z-50  bg-white `}
      > */}
      <div
        className={` ${
          showPop
            ? `   w-full  top-0  min-h-[25dvh]  max-h-[90dvh]  lg:max-h-[50dvh]   xl:h-auto  xl:absolute  opacity-100  min-w-[25dvw]  lg:min-h-[25dvh] `
            : `  top-[-200dvh]  xl:top-0  -z-50  xl:hidden  h-0 xl:opacity-0`
        } transition-all    fixed  flex flex-col items-center justify-between pb-4   overflow-y-scroll    rounded-b-10  border shadow-card  left-0 w-full -top-2  duration-500 z-50  bg-white `}
      >
        {/* <img
          src="/assets/icons/adds/x_mark.svg"
          className={`w-3  mt-4 mr-4 cursor-pointer  h-3 dark:invert`}
          alt=""
          onClick={() => {
            setShowPop(false);
          }}
        /> */}
        <div className="flex px-4  pt-4 items-center relative w-full gap-2 flex-row ">
          <div className=" relative flex items-center rounded-full border-primary-200 dark:bg-transparent  w-full py-1.5   gap-1 px-1.5 pr-3   border-2 ">
            {" "}
            <input
              id={`${boxId}prime`}
              ref={primeInputRef}
              placeholder={placeholder}
              className={`bg-transparent w-full  placeholder:text-sm `}
              onChange={(v) => handleChange(v.target.value)}
              value={text}
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
                <SmallLoading />
              ) : (
                <img
                  src="/assets/icons/edit/magnifier.svg"
                  className="w-5  grayscale invert  brightness-200 h-5 aspect-square   "
                />
              )}
            </div>
          </div>
        </div>

        {!isEmpty(locationsData?.regions) || !isEmpty(locationsData?.cities) || !isEmpty(locationsData?.provinces) ? (
          <SearchBoxCitiesPart setShowPop={setShowPop} />
        ) : (
          <></>
        )}
        <SuggestedPart
          setShowPop={setShowPop}
          searchedText={text || ""}
          isLoading={isLoading || loading}
          data={suggsData}
        />
        <Suspense>
          {" "}
          <HistorySuggPart
            handleChange={(e) => {
              // setShowPop(false);
              handleChange(e);
              // onSubmit(e);
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
