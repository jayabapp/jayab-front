"use client";
import { HomeService } from "@/api_services/home/home.service";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { useCitiesStore } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce, isEmpty } from "lodash";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, Suspense, useCallback, useEffect, useRef, useState } from "react";
import SeachBoxCitySelector from "../Home/HomeCityFilterContainer/SeachBoxCitySelector";
import SmallLoading from "../shared/Lotties/SmallLoading";
import SearchBoxCitiesPart from "./SearchBoxCitiesPart";
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
  showPop: boolean;
  setShowPop: Dispatch<SetStateAction<boolean>>;
  onSubmit: (e: string | null) => void | null;
  onClear: () => void | null;
  errors?: { [key: string]: string[] };
  item?: {
    bg?: string;
  };
}

const HomePopSearch = ({
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
  setShowPop,
  showPop,
}: props) => {
  const { push } = useRouter();
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const primeInputRef = useRef<HTMLInputElement>(null);
  const { locationsData } = useCitiesStore();
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
        // HistoryMaker(searchParam);
        setShowPop(false);
      }
    }
  }, [searchParam]);

  useEffect(() => {
    if (!isTyping) {
      if (element) element.value = text;
      if (typeof onSubmit == "function" && element) {
        // onSubmit(element.value);
        // HistoryMaker(element?.value);
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
    }, 600),
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

      push(link);
    },
  });

  return (
    <div className={`${containerClass} relative`}>
      <Suspense>
        <SearchParamExtractor onSearchParam={setSearchParam} />
      </Suspense>

      <div
        className={` ${
          showPop
            ? `   w-full xl:w-1/2  top-0   min-h-[40dvh]   max-h-[90dvh]  lg:max-h-[50dvh]  xl:h-auto  xl:absolute   xl:top-[35dvh] left-0 right-0 xl:mx-auto   opacity-100  min-w-[25dvw]  lg:min-h-[25dvh] `
            : ` top-[-200dvh]  xl:top-0  -z-50  xl:hidden  h-0 xl:opacity-0`
        } transition-all   fixed  overflow-y-scroll    rounded-10  border shadow-card  left-0 w-full -top-2  duration-500 z-50  bg-white `}
      >
        <img
          src="/assets/icons/adds/x_mark.svg"
          className={`w-3  mt-4 mr-4 cursor-pointer  h-3 dark:invert`}
          alt=""
          onClick={() => {
            setShowPop(false);
          }}
        />
        <div className="flex px-4  pt-4 items-center relative w-full gap-2 flex-row ">
          <div className=" relative flex items-center rounded-full border-primary-200 dark:bg-transparent  w-full py-3   gap-1 px-3   border-2 ">
            {" "}
            <input
              id={`${boxId}prime`}
              ref={primeInputRef}
              placeholder={placeholder}
              className={`bg-transparent w-full `}
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
              className="  cursor-pointer h-10 w-10  flex items-center justify-center  p-2 absolute left-1 aspect-square rounded-full  bg-primary-700"
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

        {!isEmpty(locationsData?.regions) || !isEmpty(locationsData?.cities) || !isEmpty(locationsData?.province) ? (
          <SearchBoxCitiesPart setShowPop={setShowPop} />
        ) : (
          <></>
        )}
        <SuggestedPart
          setShowPop={setShowPop}
          searchedText={element?.value || ""}
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

export default HomePopSearch;
