"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";

import type { SearchPanelInputProps } from "@/types/components/modules/search";

const SearchPanelInput = ({
  value,
  listId,
  isOpen,
  inputRef,
  onChange,
  onSubmit,
  isPending,
  onKeyDown,
  hasOptions,
  placeholder,
  activeIndex,
  boxId = "SEARCH_BOX",
  submitButtonClass = "left-1",
}: SearchPanelInputProps) => {
  const t = useTranslations("search");

  return (
    <div className="flex px-4 pt-4 items-center relative w-full gap-2 flex-row">
      <form
        className="relative flex items-center rounded-full border-line w-full py-1.5 gap-1 px-1.5 pr-3 border-2 focus-within:border-action transition-colors"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPending) onSubmit();
        }}
      >
        <input
          value={value}
          ref={inputRef}
          role="combobox"
          autoComplete="off"
          id={`${boxId}prime`}
          onKeyDown={onKeyDown}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          aria-expanded={isOpen && hasOptions}
          className="bg-transparent w-full placeholder:text-sm"
          onChange={(event) => onChange(event.target.value)}
          aria-activedescendant={
            activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
          }
        />
        <button
          type="submit"
          disabled={isPending}
          aria-label={t("search")}
          className={`cursor-pointer h-8 w-8 flex items-center justify-center p-2 absolute ${submitButtonClass} aspect-square rounded-full bg-action`}
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
};

export default SearchPanelInput;
