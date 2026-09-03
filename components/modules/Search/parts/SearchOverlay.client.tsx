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
  activeIndex,
  boxId,
  hasOpened,
  inputRef,
  isLoading,
  isOpen,
  isPending,
  listRef,
  onClose,
  onHover,
  onKeyDown,
  onPick,
  onSubmit,
  onTermChange,
  options,
  panelClass,
  placeholder,
  submitButtonClass,
  term,
}: SearchOverlayProps) => {
  const listId = `${boxId ?? "SEARCH_BOX"}-listbox`;

  return (
    <>
      <div
        // `justify-start`, not `justify-between`: the panel has a min-height, and
        // pushing the content apart left a large hole between the input and a
        // short result list.
        className={`${panelClass} transition-all fixed flex flex-col items-center justify-start pb-4 overflow-y-auto rounded-b-10 border shadow-card left-0 w-full -top-2 duration-500 z-50 bg-white`}
      >
        <SearchPanelInput
          boxId={boxId}
          value={term}
          listId={listId}
          isOpen={isOpen}
          inputRef={inputRef}
          onSubmit={onSubmit}
          onKeyDown={onKeyDown}
          isPending={isPending}
          onChange={onTermChange}
          activeIndex={activeIndex}
          placeholder={placeholder}
          hasOptions={options.length > 0}
          submitButtonClass={submitButtonClass}
        />

        {/* Mounted from the first open onwards — see useSearchPanel for why it
            must not render on the server. */}
        {hasOpened ? (
          <SearchPanelBody
            term={term}
            listId={listId}
            options={options}
            listRef={listRef}
            onClose={onClose}
            onHover={onHover}
            onPick={onPick}
            isLoading={isLoading}
            activeIndex={activeIndex}
            onTermChange={onTermChange}
          />
        ) : (
          <></>
        )}
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
};

export default SearchOverlay;
