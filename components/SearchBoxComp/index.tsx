"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { useSearchParams } from "next/navigation";

interface props {
  boxId?: string;
  cancelText?: string;
  passedText?: string;
  autofocus?: boolean;
  children?: ReactNode;
  placeholder?: string;
  containerClass?: string;
  passedQuerykey?: string;
  disableTypeing?: boolean;
  onClear: () => void | null;
  initValue?: string | undefined;
  errors?: { [key: string]: string[] };
  onSubmit: (e: string | null) => void | null;
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

  const debouncedText = useDebouncedValue(text, 400);
  const initialRender = useRef(true);

  useEffect(() => {
    autofocus && inputRef?.current?.focus();
  }, [autofocus]);

  useEffect(() => {
    if (searchParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(searchParam);
      typeof onSubmit == "function" && onSubmit(searchParam);
    }
  }, [onSubmit, searchParam]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!disableTypeing && !searchParam) onSubmit(debouncedText);
  }, [debouncedText, disableTypeing, onSubmit, searchParam]);

  function handleChange(text: string) {
    setText(text);
  }

  const cancelSearch = () => {
    setText("");
    typeof onSubmit == "function" && onSubmit("");
    onClear();
  };
  return (
    <div className={containerClass}>
      <div
        className={` rounded-full   overflow-hidden    pr-4 pl-2 py-2 bg-white  border flex justify-between items-center  ${item?.bg}`}
      >
        <div className={` md:mr-2  `}>
          <img src="/assets/icons/edit/magnifier.svg" width={30} height={30} />
        </div>{" "}
        <div className="flex items-center w-full">
          <input
            id={boxId}
            ref={inputRef}
            placeholder={placeholder}
            value={passedText || text}
            className={`bg-transparent  py-1 pl-0.5 pr-3 outline-none placeholder:text-neutral-400 w-full ${item?.bg} `}
            onChange={(v) => {
              if (!disableTypeing) handleChange(v.target.value);
            }}
          />
        </div>
        {!!text && !item?.disable_cancel ? (
          <div className="inline-flex w-1/4 justify-end">
            {!!text && (
              <div
                className="text-brand-600 text-xs mr-2 cursor-pointer "
                onClick={cancelSearch}
              >
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
