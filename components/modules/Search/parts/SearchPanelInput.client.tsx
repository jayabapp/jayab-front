"use client";

import type { SearchPanelInputProps } from "@/types/components/modules/search";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";

import _STRINGS from "@/utils/LocalStrings";

const SearchPanelInput = ({
  boxId = "SEARCH_BOX",
  inputRef,
  isPending,
  onChange,
  onSubmit,
  placeholder,
  submitButtonClass = "left-1",
  value,
}: SearchPanelInputProps) => (
  <div className="flex px-4 pt-4 items-center relative w-full gap-2 flex-row">
    <form
      className="relative flex items-center rounded-full border-neutral-200 w-full py-1.5 gap-1 px-1.5 pr-3 border-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isPending) onSubmit();
      }}
    >
      <input
        value={value}
        ref={inputRef}
        id={`${boxId}prime`}
        placeholder={placeholder}
        className="bg-transparent w-full placeholder:text-sm"
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="submit"
        disabled={isPending}
        aria-label={_STRINGS.SEARCH}
        className={`cursor-pointer h-8 w-8 flex items-center justify-center p-2 absolute ${submitButtonClass} aspect-square rounded-full bg-brand-600`}
      >
        {isPending ? (
          <BtnLoading />
        ) : (
          <ContentImage
            alt=""
            width={20}
            height={20}
            src="/assets/icons/edit/magnifier.svg"
            className="w-5 grayscale invert brightness-200 h-5 aspect-square"
          />
        )}
      </button>
    </form>
  </div>
);

export default SearchPanelInput;
