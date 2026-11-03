"use client";

import { BlogGridSkeleton } from "./parts/BlogGridSkeleton";
import { useTranslations } from "next-intl";
import { useStoreSocket } from "@/store";
import { useBlogList } from "@features/home/hooks/useBlogList";
import { BtnLoading } from "@elements/Button";
import { useEffect } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import LatestBlogCard from "./parts/BlogCard";
import Breadcrumbs from "@elements/Breadcrumbs/Breadcrumbs.client";
import EmptyState from "@elements/EmptyState";

const BlogsClientPageComponent = () => {
  const t = useTranslations();

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
          title={t("common.error")}
          description={t("content.blogListLoadError")}
          actionLabel={t("common.tryAgain")}
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
            <div className="col-span-full rounded-xl bg-status-danger-bg p-3 text-center text-xs text-status-danger">
              {t("content.blogListLoadError")}{" "}
              <button
                type="button"
                className="font-bold underline underline-offset-4"
                onClick={() => void refetch()}
              >
                {t("common.tryAgain")}
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
