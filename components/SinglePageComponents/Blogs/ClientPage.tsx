"use client";

import { useEffect, useState } from "react";
import { useStoreSocket } from "@/store";
import { HomeService } from "@/api_services/home/home.service";
import { STALE_TIME } from "@/helpers/queryCache";
import { useQuery } from "@tanstack/react-query";

import LatestBlogCard from "@/components/blogs/BlogCard";
import InfiniteScroll from "react-infinite-scroll-component";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import isEmpty from "lodash/isEmpty";

const BlogsClientPageComponent = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [refresher, setRefresher] = useState(false);
  const { notification } = useStoreSocket((state) => state);

  useEffect(() => {
    if (!!notification) {
      setRefresher((e) => !e);
      setPage(0);
    }
  }, [notification]);
  const { data: solidData, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, page, refresher],
    queryFn: () =>
      HomeService?.GetContent({
        key: "blog",
        page: page,
      }),
    staleTime: STALE_TIME.MEDIUM,
  });

  useEffect(() => {
    if (solidData?.data)
      if (page == 1) setData((x) => solidData?.data);
      else setData((x) => [...x, ...solidData?.data]);
  }, [solidData]);

  return (
    <>
      {!!isLoading && isEmpty(data) ? (
        <LottieLoading />
      ) : (
        <InfiniteScroll
          dataLength={data?.length}
          next={() => {
            setPage(solidData?.meta?.next || 0);
          }}
          hasMore={
            solidData?.meta?.currentPage != solidData?.meta?.lastPage
              ? true
              : false
          }
          className="grid   mt-6 grid-cols-1 md:grid-cols-3  gap-8  p-2 "
          loader={
            <div className="flex  col-span-full flex-col gap-4 p-4">
              <BtnLoading />
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
