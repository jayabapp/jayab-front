import type { PaginationProps } from "@/types/components/elements/pagination";

import { DOTS, usePagination } from "./usePagination";

import PaginationArrow from "./PaginationArrow";
import _STRINGS from "@/utils/LocalStrings";

const Pagination = ({ onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, onClickPrev, onClickNext }: PaginationProps) => {
  const paginationRange = usePagination({ currentPage, totalCount, siblingCount, pageSize });
  const pageCount = Math.ceil(totalCount / pageSize);
  if (totalCount < pageSize || !totalCount) return null;
  return (
    <nav aria-label={_STRINGS.PAGES} className="mt-16 mb-4 flex items-center justify-center">
      <button aria-label={_STRINGS.PREVIOUS_PAGE} className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500 bg-white p-1 transition-all enabled:hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={currentPage <= 1} onClick={onClickPrev} type="button">
        <PaginationArrow direction="left" />
      </button>
      <div className="flex items-center rounded-full bg-white px-2">
        {paginationRange?.map((page, index) => page === DOTS ? (
          <span aria-hidden="true" key={`dots-${index}`}>…</span>
        ) : (
          <button aria-current={currentPage === page ? "page" : undefined} aria-label={`${_STRINGS.PAGES} ${page}`} className={`mx-2 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500 text-center font-medium ${currentPage === page ? "scale-[1.15] border-0 bg-brand-600 text-white" : "hover:text-brand-600"}`} key={page} onClick={() => onPageChange(page)} type="button">
            {page}
          </button>
        ))}
      </div>
      <button aria-label={_STRINGS.NEXT_PAGE} className="mr-2 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500 bg-white p-1 transition-all enabled:hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={currentPage >= pageCount} onClick={onClickNext} type="button">
        <PaginationArrow direction="right" />
      </button>
    </nav>
  );
};

export default Pagination;
