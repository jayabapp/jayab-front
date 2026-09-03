"use client";

import type { SearchPanelInputProps } from "@/types/components/modules/search";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";

import _STRINGS from "@/utils/LocalStrings";

/**
 * The combobox input.
 *
 * Focus stays here while the arrow keys move a cursor through the listbox, which
 * is what the combobox pattern requires and what `aria-activedescendant` reports
 * to a screen reader. Enter with no row highlighted falls through to the form's
 * own submit — the free-text search — so the old behaviour is untouched for
 * anyone who never presses an arrow key.
 */
const SearchPanelInput = ({
  activeIndex,
  boxId = "SEARCH_BOX",
  hasOptions,
  inputRef,
  isOpen,
  isPending,
  listId,
  onChange,
  onKeyDown,
  onSubmit,
  placeholder,
  submitButtonClass = "left-1",
  value,
}: SearchPanelInputProps) => (
  <div className="flex px-4 pt-4 items-center relative w-full gap-2 flex-row">
    <form
      className="relative flex items-center rounded-full border-neutral-200 w-full py-1.5 gap-1 px-1.5 pr-3 border-2 focus-within:border-brand-600 transition-colors"
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
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        onKeyDown={onKeyDown}
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
