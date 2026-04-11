"use client";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import SmallLoading from "../shared/Lotties/SmallLoading";
interface props {
  initValue?: string | undefined;
  placeholder?: string;
  cancelText?: string;
  containerClass?: string;
  passedQuerykey?: string;
  autofocus?: boolean;
  disableTypeing?: boolean;
  boxId?: string;
  passedText?: string;
  children?: ReactNode;

  onSubmit: (e: string | null) => void | null;
  onClear: () => void | null;
  errors?: { [key: string]: string[] };
  item?: {
    bg?: string;
    disable_cancel?: boolean;
  };
}

const SearchBox = ({
  placeholder = "search...",
  cancelText = "لغو",
  onSubmit,
  autofocus = false,
  disableTypeing = false,
  initValue,
  onClear,
  containerClass = "w-[90%] mx-auto",
  item,
  passedText,
  boxId = "SEARCH_BOX",
  passedQuerykey = "q",
  children,
}: props) => {
  const searchParam = useSearchParams().get(passedQuerykey);

  const inputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(initValue || "");

  const [isTyping, setisTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [element, setElement] = useState<HTMLInputElement | null>(null);
  useEffect(() => {
    setElement(document.getElementById(boxId) as HTMLInputElement);
  }, []);

  useEffect(() => {
    autofocus && inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (searchParam) {
      setText(searchParam);
      typeof onSubmit == "function" && onSubmit(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    if (!isTyping) {
      // inputRef.current.blur();
      typeof onSubmit == "function" && element && onSubmit(element.value);

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [isTyping]);

  const checkTyping = useCallback(
    debounce(() => {
      setisTyping(false);
    }, 500),
    [],
  );
  useEffect(() => {
    if (!element?.value && !searchParam) {
      onSubmit("");
      cancelSearch();
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
      typeof onSubmit == "function" && onSubmit("");
      onClear();
    }
  };
  return (
    <div className={containerClass}>
      <div
        className={` rounded-full   overflow-hidden dark:bg-slate-800   pr-4 pl-2 py-2 bg-white  border flex justify-between items-center  ${item?.bg}`}
      >
        <div className={` md:mr-2  `}>
          <img src="/assets/icons/edit/magnifier.svg" width={30} height={30} />
        </div>{" "}
        <div className="flex items-center w-full">
          <input
            id={boxId}
            ref={inputRef}
            placeholder={placeholder}
            className={`bg-transparent dark:bg-slate-800 py-1 pl-0.5 pr-3 outline-none placeholder:text-gray-400 w-full ${item?.bg} `}
            onChange={(v) => {
              if (!disableTypeing) handleChange(v.target.value);
            }}
            value={passedText || text}
          />
        </div>
        {(!!loading || element?.value) && !item?.disable_cancel ? (
          <div className="inline-flex w-1/4 justify-end">
            {loading && (
              <div className="ml-2">
                <SmallLoading />
              </div>
            )}

            {element?.value && (
              <div className="text-primary-700 text-xs mr-2 cursor-pointer " onClick={cancelSearch}>
                {cancelText}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}{" "}
        {children}
      </div>
    </div>
  );
};

export default SearchBox;
