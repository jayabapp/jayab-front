"use client";

import type { ServerSidePaginationProps } from "@/types/components/elements/pagination";
import { usePathname, useRouter } from "next/navigation";
import { DOTS, usePagination } from "./usePagination";

import queryBuilder from "@/helpers/queryBuilder";
import PaginationArrow from "./PaginationArrow";
import _STRINGS from "@/utils/LocalStrings";

const ServerSidePaginate = ({ totalCount, siblingCount = 1, currentPage, pageSize, q, query }: ServerSidePaginationProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pageCount = Math.ceil(totalCount / pageSize);
  const pushPage = (page: number | string) => {
    const body: Record<string, unknown> = { ...query, page, q };
    if (page === 1) delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };
  const paginationRange = usePagination({ currentPage, totalCount, siblingCount, pageSize });
  if (totalCount < pageSize || !totalCount) return null;
  return (
    <nav aria-label={_STRINGS.PAGES} className="ltr mt-16 mb-4 flex items-center justify-center">
      <button aria-label={_STRINGS.PREVIOUS_PAGE} className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500 p-1 transition-all enabled:hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={currentPage <= 1} onClick={() => pushPage(currentPage - 1)} type="button">
        <PaginationArrow direction="left" />
      </button>
      <div className="flex items-center rounded-full px-2">
        {paginationRange?.map((page, index) => page === DOTS ? (
          <span aria-hidden="true" key={`dots-${index}`}>…</span>
        ) : (
          <button aria-current={currentPage === page ? "page" : undefined} aria-label={`${_STRINGS.PAGES} ${page}`} className={`mx-2 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500 text-center font-medium ${currentPage === page ? "scale-[1.15] border-0 bg-brand-600 text-white" : "hover:text-brand-600"}`} key={page} onClick={() => pushPage(page)} type="button">
            {page}
          </button>
        ))}
      </div>
      <button aria-label={_STRINGS.NEXT_PAGE} className="mr-2 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500 p-1 transition-all enabled:hover:-translate-x-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={currentPage >= pageCount} onClick={() => pushPage(currentPage + 1)} type="button">
        <PaginationArrow direction="right" />
      </button>
    </nav>
  );
};

export default ServerSidePaginate;
