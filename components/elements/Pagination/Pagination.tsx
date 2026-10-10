import { DOTS, usePagination } from "./usePagination";
import { useTranslations } from "next-intl";

import type { PaginationProps } from "@/types/components/elements/pagination";

import PaginationArrow from "./PaginationArrow";

const Pagination = ({
  pageSize,
  totalCount,
  onClickPrev,
  currentPage,
  onClickNext,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const t = useTranslations("common");

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  const pageCount = Math.ceil(totalCount / pageSize);
  if (totalCount < pageSize || !totalCount) return null;
  return (
    <nav
      aria-label={t("pages")}
      className="mt-16 mb-4 flex items-center justify-center"
    >
      <button
        type="button"
        onClick={onClickPrev}
        disabled={currentPage <= 1}
        aria-label={t("previousPage")}
        className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-control bg-surface p-1 transition-all enabled:hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PaginationArrow direction="left" />
      </button>
      <div className="flex items-center rounded-full bg-surface px-2">
        {paginationRange?.map((page, index) =>
          page === DOTS ? (
            <span aria-hidden="true" key={`dots-${index}`}>
              …
            </span>
          ) : (
            <button
              type="button"
              key={page}
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => onPageChange(page)}
              aria-label={`${t("pages")} ${page}`}
              className={`mx-2 flex h-9 w-9 items-center justify-center rounded-md border border-control text-center font-medium ${currentPage === page ? "scale-[1.15] border-0 bg-action text-on-action" : "hover:text-link"}`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        onClick={onClickNext}
        aria-label={t("nextPage")}
        className="mr-2 flex h-9 w-9 items-center justify-center rounded-md border border-control bg-surface p-1 transition-all enabled:hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage >= pageCount}
      >
        <PaginationArrow direction="right" />
      </button>
    </nav>
  );
};

export default Pagination;
