"use client";

import {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Menu, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { useCitiesStore } from "@/store";
import { HomeService } from "@/api_services/home/home.service";
import { useRouter } from "next/navigation";

import SearchBoxPopularPlaces from "./SearchBoxPopularPlaces";
import SeachBoxCitySelector from "../Home/HomeCityFilterContainer/SeachBoxCitySelector";
import SearchBoxCitiesPart from "./SearchBoxCitiesPart";
import HistorySuggPart from "./HistorySuggPart";
import SuggestedPart from "./SuggestedPart";
import SmallLoading from "../shared/Lotties/SmallLoading";
import debounce from "lodash/debounce";
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
  placeholder = "search...",
  onSubmit,
  initValue,
  onClear,
  containerClass = "w-[90%] mx-auto",
  item,
  boxId = "SEARCH_BOX",
}: props) => {
  const { push } = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const { locationsData } = useCitiesStore();
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
        if (!!element?.value)
          return HomeService.GetSearchSuggs({ q: element.value });
        else return null;
      } else return null;
    },
  });

  useEffect(() => {
    setElement(document.getElementById(`${boxId}`) as HTMLInputElement);
  }, []);

  useEffect(() => {
    if (!!showResults) {
      setTimeout(() => {
        primeInputRef?.current?.focus();
      }, 1000);
    }
  }, [showResults]);

  useEffect(() => {
    if (searchParam) {
      setText(searchParam);
      if (typeof onSubmit == "function") {
        onSubmit(searchParam);
        setShowResults(false);
      }
    }
  }, [searchParam]);

  useEffect(() => {
    if (!isTyping) {
      if (element) element.value = text;
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
      onSubmit?.("");
      cancelSearch();
      setShowResults(false);
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
        setShowResults(false);
        onSubmit("");
      }
      onClear?.();
    }
  };

  useEffect(() => {
    !!showResults
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [showResults]);

  const { mutate, isPending } = useMutation({
    mutationKey: [HomeService.SEARCH_KEY],
    mutationFn: HomeService.Search,
    onSuccess: (data) => {
      if (!data?.client_query) return;
      useCitiesStore.setState({
        locationsData: {
          cities: data?.cities_list?.filter(
            (e) => e?.level == CitiesSuggestTypes.CITY,
          ),
          provinces: data?.cities_list?.filter(
            (e) => e?.level == CitiesSuggestTypes.PROVINCE,
          ),
          regions: data?.cities_list?.filter(
            (e) => e?.level == CitiesSuggestTypes.REGION,
          ),
        },
      });
      const createdQuery = Object.keys(data?.client_query)
        ?.map((e) => `${e}=${data?.client_query?.[e]}`)
        .join("&");
      const link = `/rooms?${createdQuery}`;
      push(link);
    },
  });

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
          className={`bg-white/50 rounded-20  w-full  overflow-hidden dark:bg-slate-800   pr-4 pl-2 flex justify-between items-center  ${item?.bg}`}
        >
          <div className="flex items-center w-full">
            <input
              id={boxId}
              value={text}
              ref={inputRef}
              placeholder={placeholder}
              onChange={(v) => handleChange(v.target.value)}
              className={`bg-transparent dark:bg-slate-800 py-1 pl-0.5 pr-3 outline-none  w-full ${item?.bg} `}
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
              className={` ${text ? "  " : " opacity-0"}  transition-all  cursor-pointer h-10 w-10  top-0  bottom-0 my-0 flex items-center justify-center    left-1 aspect-square rounded-full  bg-primary-700 `}
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
          <MenuItems className="absolute w-full  pb-2 md:top-auto left-0 z-20  mt-2  origin-top-center  rounded-20   bg-white dark:bg-zinc-800 custome-shadow-card focus:outline-none  overflow-scroll">
            <div
              onMouseLeave={() => {}}
              className="flex gap-2   w-full items-center flex-col px-2 py-2  border-gray-275 dark:border-zinc-500 "
            >
              {!isEmpty(locationsData?.regions) ||
              !isEmpty(locationsData?.cities) ||
              !isEmpty(locationsData?.province) ? (
                <MenuItem>
                  <SearchBoxCitiesPart setShowPop={setShowResults} />
                </MenuItem>
              ) : (
                <></>
              )}
              <SuggestedPart
                data={suggsData}
                setShowPop={setShowResults}
                isLoading={isLoading || loading}
                searchedText={element?.value || ""}
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
