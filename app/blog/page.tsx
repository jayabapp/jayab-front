import React, { Suspense } from "react";
import _STRINGS from "@/utils/LocalStrings";

import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import Breadcrumbs from "@/components/BreadCrumbs";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import LatestBlogCard from "@/components/blogs/BlogCard";

import { isEmpty } from "lodash";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import ServerSidePaginate from "@/components/shared/Pagination/ServerSidePaginate";

const BlogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; sort?: "mostVisited" | "newest"; q: string; category: string }>;
}) => {
  const searchParamsData = await searchParams;

  const { data: blogs } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"blog"}&per_page=20&page=${searchParamsData?.page || 1}`
  );
  return (
    <div className="app-container  !overflow-visible">
      <Breadcrumbs />

      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3  md:mt-6 md:px-4">
          {!blogs ? (
            <LottieLoading />
          ) : isEmpty(blogs?.data) ? (
            <EmptyList />
          ) : blogs?.data ? (
            <div className="grid mt-6 grid-cols-1 md:grid-cols-3  gap-8">
              {blogs?.data?.map((e: any) => (
                <LatestBlogCard item={e} key={`${e?.id}blog`} />
              ))}
            </div>
          ) : (
            <></>
          )}{" "}
          <Suspense fallback={<div />}>
            <ServerSidePaginate
              q={searchParamsData?.q || ""}
              currentPage={searchParamsData?.page || 1}
              pageSize={12}
              totalCount={blogs?.meta?.total}
              siblingCount={1}
            />
          </Suspense>
          {/* {faq?.data ? (
            <Suspense>
              {" "}
              <HomeFaqForum data={faq?.data} />
            </Suspense>
          ) : (
            <></>
          )} */}
          {/* {(data?.meta?.total || 15) > (data?.meta?.perPage || 15) ? (
            <Pagination
              onClickNext={() => setPage(page + 1)}
              onClickPrev={() => setPage(page - 1)}
              onPageChange={(e) => setPage(Number(e))}
              currentPage={data?.meta?.currentPage || page}
              pageSize={data?.meta?.perPage || 30}
              totalCount={data?.meta?.total || 30}
            />
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
