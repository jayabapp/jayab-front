"use client";

import { usePathname, useRouter } from "next/navigation";
import { DOTS, usePagination } from "./usePagination";
import { useTranslations } from "next-intl";

import type { ServerSidePaginationProps } from "@/types/components/elements/pagination";

import PaginationArrow from "./PaginationArrow";
import queryBuilder from "@/helpers/queryBuilder";

const ServerSidePaginate = ({
  q,
  query,
  pageSize,
  totalCount,
  currentPage,
  siblingCount = 1,
}: ServerSidePaginationProps) => {
  const t = useTranslations("common");

  const pathname = usePathname();
  const router = useRouter();
  const pageCount = Math.ceil(totalCount / pageSize);
  const pushPage = (page: number | string) => {
    const body: Record<string, unknown> = { ...query, page, q };
    if (page === 1) delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  if (totalCount < pageSize || !totalCount) return null;
  return (
    <nav
      aria-label={t("pages")}
      className="ltr mt-16 mb-4 flex items-center justify-center"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        aria-label={t("previousPage")}
        onClick={() => pushPage(currentPage - 1)}
        className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-control p-1 transition-all enabled:hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PaginationArrow direction="left" />
      </button>
      <div className="flex items-center rounded-full px-2">
        {paginationRange?.map((page, index) =>
          page === DOTS ? (
            <span aria-hidden="true" key={`dots-${index}`}>
              …
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => pushPage(page)}
              aria-label={`${t("pages")} ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`mx-2 flex h-9 w-9 items-center justify-center rounded-md border border-control text-center font-medium ${currentPage === page ? "scale-[1.15] border-0 bg-action text-on-action" : "hover:text-link"}`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        aria-label={t("nextPage")}
        disabled={currentPage >= pageCount}
        onClick={() => pushPage(currentPage + 1)}
        className="mr-2 flex h-9 w-9 items-center justify-center rounded-md border border-control p-1 transition-all enabled:hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PaginationArrow direction="right" />
      </button>
    </nav>
  );
};

export default ServerSidePaginate;
