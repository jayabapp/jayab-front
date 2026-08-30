"use client";

import type { SearchInputProps } from "@/types/components/modules/search";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { ContentImage } from "@elements/Image";

import SearchQueryParamSync from "./parts/SearchQueryParamSync.client";
import _STRINGS from "@/utils/LocalStrings";

/**
 * A debounced text field that reports the typed term to its owner.
 *
 * `onSubmit` fires from exactly one source at a time: while the URL carries the
 * search param the field mirrors it, and only once the user edits the field does
 * the debounced value drive submissions. That is what keeps a single keystroke
 * from producing two requests.
 */
const SearchInput = ({
  autofocus = false,
  boxId = "SEARCH_BOX",
  cancelText = _STRINGS.CANCEL,
  children,
  containerClass = "w-[90%] mx-auto",
  disableTypeing = false,
  initValue,
  item,
  onClear,
  onSubmit,
  passedQuerykey = "q",
  passedText,
  placeholder = "search...",
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(initValue || "");
  const [hasParam, setHasParam] = useState(false);
  const debouncedText = useDebouncedValue(text, 400);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (autofocus) inputRef.current?.focus();
  }, [autofocus]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!disableTypeing && !hasParam) onSubmit(debouncedText);
  }, [debouncedText, disableTypeing, hasParam, onSubmit]);

  const cancelSearch = () => {
    setText("");
    setHasParam(false);
    onSubmit("");
    onClear();
  };

  return (
    <div className={containerClass}>
      <Suspense>
        <SearchQueryParamSync
          queryKey={passedQuerykey}
          onSearchParam={(param) => {
            if (!param) return;
            setText(param);
            setHasParam(true);
            onSubmit(param);
          }}
        />
      </Suspense>
      <div
        className={`rounded-full overflow-hidden pr-4 pl-2 py-2 bg-white border flex justify-between items-center ${item?.bg ?? ""}`}
      >
        <div className="md:mr-2">
          <ContentImage
            alt=""
            width={30}
            height={30}
            src="/assets/icons/edit/magnifier.svg"
          />
        </div>
        <div className="flex items-center w-full">
          <input
            id={boxId}
            ref={inputRef}
            placeholder={placeholder}
            value={passedText || text}
            className={`bg-transparent py-1 pl-0.5 pr-3 outline-none placeholder:text-neutral-400 w-full ${item?.bg ?? ""}`}
            onChange={(event) => {
              if (disableTypeing) return;
              setHasParam(false);
              setText(event.target.value);
            }}
          />
        </div>
        {text && !item?.disable_cancel ? (
          <div className="inline-flex w-1/4 justify-end">
            <button
              type="button"
              onClick={cancelSearch}
              className="text-brand-600 text-xs mr-2 cursor-pointer"
            >
              {cancelText}
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default SearchInput;
