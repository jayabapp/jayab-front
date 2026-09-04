"use client";

import { useBlogList } from "@features/home/hooks/useBlogList";
import { BlogGridSkeleton } from "./parts/BlogGridSkeleton";
import { BtnLoading } from "@elements/Button";
import { useStoreSocket } from "@/store";
import { useEffect } from "react";

import Breadcrumbs from "@elements/Breadcrumbs/Breadcrumbs.client";
import InfiniteScroll from "react-infinite-scroll-component";
import LatestBlogCard from "./parts/BlogCard";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";

const BlogsClientPageComponent = () => {
  const { notification } = useStoreSocket((state) => state);
  const {
    refresh,
    isError,
    refetch,
    isLoading,
    blogs: data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBlogList();

  useEffect(() => {
    if (notification) void refresh();
  }, [notification, refresh]);

  return (
    <>
      <Breadcrumbs />
      {isLoading && data.length === 0 ? (
        <BlogGridSkeleton />
      ) : isError && data.length === 0 ? (
        <EmptyState
          title={_STRINGS.ERROR}
          description={_STRINGS.BLOG_LIST_LOAD_ERROR}
          actionLabel={_STRINGS.TRY_AGAIN}
          onAction={() => void refetch()}
        />
      ) : (
        <InfiniteScroll
          dataLength={data?.length}
          next={() => {
            if (!isFetchingNextPage) void fetchNextPage();
          }}
          hasMore={Boolean(hasNextPage)}
          className="grid   mt-6 grid-cols-1 md:grid-cols-3  gap-8  p-2 "
          loader={
            <div className="flex  col-span-full flex-col gap-4 p-4">
              {isFetchingNextPage ? <BtnLoading /> : null}
            </div>
          }
        >
          {isError ? (
            <div className="col-span-full rounded-xl bg-danger-50 p-3 text-center text-xs text-danger-600">
              {_STRINGS.BLOG_LIST_LOAD_ERROR}{" "}
              <button
                type="button"
                className="font-bold underline underline-offset-4"
                onClick={() => void refetch()}
              >
                {_STRINGS.TRY_AGAIN}
              </button>
            </div>
          ) : null}
          {data?.length == 0 ? (
            <div className="col-span-2">
              {" "}
              <EmptyState />
            </div>
          ) : (
            data?.map((e, index) => (
              <LatestBlogCard
                item={e}
                index={index}
                key={`latest-blog-${e?.id}`}
              />
            ))
          )}
        </InfiniteScroll>
      )}
    </>
  );
};

export default BlogsClientPageComponent;
