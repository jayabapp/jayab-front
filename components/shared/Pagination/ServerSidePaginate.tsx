"use client";

import React from "react";
import { DOTS, usePagination } from "./usePagination";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import queryBuilder from "@/helpers/queryBuilder";
type paginationType = {
  totalCount: number;
  q?: string;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  query?: any;
};

const ServerSidePaginate = (props: paginationType) => {
  const { totalCount, siblingCount = 1, currentPage, pageSize, q, query } = props;
  const pathname = usePathname();
  const router = useRouter();

  const catPusher = (page: number | string) => {
    let body: { page?: string | number; q?: string } = {
      ...query,
      page: page,
      q: q,
    };

    if (page == 1) {
      delete body.page;
    }
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
    <div className="flex items-center ltr mt-16 justify-center mb-4">
      <div
        className={`p-1 border border-neutral-500   rounded-md w-9 h-9 flex justify-center items-center ml-2 cursor-pointer transition-all hover:translate-x-2 ${
          currentPage == 1 && "opacity-50"
        }`}
        onClick={() => (currentPage > 1 ? catPusher(Number(currentPage) - 1) : void null)}
      >
        <ChevronLeft />
      </div>
      <div className="flex items-center    rounded-full  px-2">
        {paginationRange?.map((e, i) => {
          if (e == DOTS)
            return (
              <div key={i} className="">
                …
              </div>
            );
          return (
            <div
              key={i}
              className={`w-9 h-9 flex justify-center items-center text-center font-medium mx-2 cursor-pointer border  border-neutral-500 rounded-md ${
                currentPage == e
                  ? " bg-brand-600 rounded-md text-white scale-[1.15] ease-in-out duration-300 transition-all border-0"
                  : "hover:text-brand-600"
              }`}
              onClick={() => catPusher(e)}
            >
              {e}
            </div>
          );
        })}
      </div>
      <div
        className={`  p-1 border border-neutral-500   rounded-md w-9 h-9 flex justify-center items-center mr-2 cursor-pointer transition-all hover:-translate-x-2 ${
          currentPage >= totalCount / pageSize && "opacity-50"
        }`}
        onClick={() => (currentPage < totalCount / pageSize ? catPusher(Number(currentPage) + 1) : void null)}
      >
        <ChevronRight />
      </div>
    </div>
  );
};

export default ServerSidePaginate;

const ChevronRight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
};

const ChevronLeft = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
};
