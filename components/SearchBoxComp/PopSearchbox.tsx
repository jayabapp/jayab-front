import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import HistoryMaker from "./HistoryMaker";
import HistorySuggPart from "./HistorySuggPart";
import { useQuery } from "@tanstack/react-query";
import SuggestedPart from "./SuggestedPart";
import { isMobile } from "react-device-detect";
import SmallLoading from "../shared/Lotties/SmallLoading";
import { HomeService } from "@/api_services/home/home.service";

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
  containerClass = " w-full md:w-[90%] mx-auto",
  item,
  boxId = "SEARCH_BOX",
  justIcon = false,
}: props) => {
  const searchParam = useSearchParams().get("q");
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
        HistoryMaker(searchParam);
        setShowPop(false);
      }
    }
  }, [searchParam]);

  useEffect(() => {
    if (!isTyping) {
      if (element) element.value = text;
      if (typeof onSubmit == "function" && element) {
        // onSubmit(element.value);
        HistoryMaker(element?.value);
        // setShowPop(false);
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1400);
    }
  }, [isTyping]);

  const checkTyping = useCallback(
    debounce(() => {
      setisTyping(false);
    }, 1400),
    []
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

  return (
    <div className={`${containerClass} relative`}>
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
          <div className="flex items-center w-full">
            <div className="">
              <img src="/assets/icons/edit/magnifier.svg" width={20} className="dark:invert" height={20} />
            </div>
            <div
              id={boxId}
              ref={inputRef}
              className={`bg-transparent dark:bg-transparent py-1 pl-3 pr-0.5  w-full ${!text ? "opacity-50" : ""}  `}
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

            {element?.value && (
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
            )}
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
            ? `   w-full  top-0  h-[100dvh]   md:h-auto  md:absolute  opacity-100  min-h-[25dvh] `
            : ` top-[200dvh]  md:top-0  -z-50  md:hidden  h-0 md:opacity-0`
        } transition-all  fixed p-4  overflow-hidden    rounded-10  border  left-0 w-full -top-2  duration-500 z-50  bg-white `}
      >
        <div className="flex items-center w-full gap-2 flex-row ">
          {isMobile ? (
            <img
              src="/assets/icons/adds/x_mark.svg"
              onClick={() => {
                setShowPop(false);
              }}
              className="w-4 h-4"
            />
          ) : (
            <></>
          )}
          <input
            id={`${boxId}prime`}
            ref={primeInputRef}
            placeholder={placeholder}
            className={`bg-transparent border-b border-primary-700 dark:bg-transparent pt-1 pb-4 pl-3 pr-0.5  w-full  `}
            onChange={(v) => handleChange(v.target.value)}
            value={text}
          />
        </div>

        <SuggestedPart
          setShowPop={setShowPop}
          searchedText={element?.value || ""}
          isLoading={isLoading || loading}
          data={suggsData}
        />

        <HistorySuggPart
          handleChange={(e) => {
            // setShowPop(false);
            handleChange(e);
            // onSubmit(e);
          }}
        />
      </div>

      {!!isMobile ? (
        <></>
      ) : (
        <div
          className={`fixed left-0     top-0 w-full   transition-all duration-0   ${
            showPop ? " z-10 h-[100dvh] " : " -z-10  h-0"
          } `}
        >
          {" "}
          <div
            onClick={() => {
              setShowPop(false);
            }}
            className={` w-full h-full top-0   inset-0 bg-black bg-opacity-70  bg-black/80 transition-all duration-700 ${
              showPop ? " opacity-100 " : " opacity-0"
            } `}
          >
            {" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopSearchbox;
