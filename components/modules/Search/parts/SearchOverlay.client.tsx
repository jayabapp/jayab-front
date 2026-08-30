"use client";

import type { SearchOverlayProps } from "@/types/components/modules/search";

import SearchPanelInput from "./SearchPanelInput.client";
import SearchPanelBody from "./SearchPanelBody.client";
import _STRINGS from "@/utils/LocalStrings";

/**
 * The sliding search panel plus its backdrop. Both pop-over surfaces share it and
 * only differ in the panel's position classes.
 */
const SearchOverlay = ({
  boxId,
  inputRef,
  isLoading,
  isOpen,
  isPending,
  onClose,
  onSubmit,
  onTermChange,
  panelClass,
  placeholder,
  submitButtonClass,
  suggestions,
  term,
}: SearchOverlayProps) => (
  <>
    <div
      className={`${panelClass} transition-all fixed flex flex-col items-center justify-between pb-4 overflow-y-scroll rounded-b-10 border shadow-card left-0 w-full -top-2 duration-500 z-50 bg-white`}
    >
      <SearchPanelInput
        boxId={boxId}
        value={term}
        inputRef={inputRef}
        onSubmit={onSubmit}
        isPending={isPending}
        onChange={onTermChange}
        placeholder={placeholder}
        submitButtonClass={submitButtonClass}
      />
      <SearchPanelBody
        term={term}
        onClose={onClose}
        isLoading={isLoading}
        suggestions={suggestions}
        onTermChange={onTermChange}
      />
    </div>

    <button
      type="button"
      onClick={onClose}
      tabIndex={isOpen ? 0 : -1}
      aria-label={_STRINGS.CLOSE}
      className={`fixed left-0 bg-black/35 lg:bg-transparent top-0 w-full transition-opacity ${
        isOpen ? "z-[11] h-[100dvh] opacity-100" : "opacity-0 -z-10 h-0"
      }`}
    />
  </>
);

export default SearchOverlay;
