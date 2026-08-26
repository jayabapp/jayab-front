"use client";

import { BlogGridSkeleton } from "@/components/blogs/BlogGridSkeleton";
import { useStoreSocket } from "@/store";
import { useBlogList } from "@features/home/hooks/useBlogList";
import { useEffect } from "react";

import LatestBlogCard from "@/components/blogs/BlogCard";
import InfiniteScroll from "react-infinite-scroll-component";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";

const BlogsClientPageComponent = () => {
  const { notification } = useStoreSocket((state) => state);
  const {
    refresh,
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
      {isLoading && data.length === 0 ? (
        <BlogGridSkeleton />
      ) : (
        <InfiniteScroll
          dataLength={data?.length}
          next={() => void fetchNextPage()}
          hasMore={Boolean(hasNextPage)}
          className="grid   mt-6 grid-cols-1 md:grid-cols-3  gap-8  p-2 "
          loader={
            <div className="flex  col-span-full flex-col gap-4 p-4">
              {isFetchingNextPage ? <BtnLoading /> : null}
            </div>
          }
        >
          {data?.length == 0 ? (
            <div className="col-span-2">
              {" "}
              <EmptyList />
            </div>
          ) : (
            data?.map((e) => (
              <LatestBlogCard item={e} key={`latestBlog${e?.title}`} />
            ))
          )}
        </InfiniteScroll>
      )}
    </>
  );
};

export default BlogsClientPageComponent;
