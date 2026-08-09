import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { _scrollToTop } from "../../helpers/commonFunctions";
import { HomeService } from "@/api_services/home/home.service";
import { STALE_TIME } from "@/helpers/queryCache";
import { ContentDto } from "@/api_services/home/home.interface";
import { useQuery } from "@tanstack/react-query";
import { Meta } from "@/api_services/chat/chat.interface";

import LottieLoading from "../shared/Lotties/LottieLoading";
import queryBuilder from "@/helpers/queryBuilder";
import Pagination from "../shared/Pagination";
import EmptyList from "../shared/Lotties/EmptyList";
import BlogCard from "./BlogCard";

export interface catQueryTypes {
  sort_type: string;
  max_price?: string;
  page?: string;
  min_price?: string;
  store_name?: string;
  store_id?: string;
  min_weight?: string;
  max_weight?: string;
  is_offer?: "true" | "false";
  is_new?: "true" | "false";
  q?: string;
  categories?: string | string[];
  tag_ids?: string;
  properties?: string[];
  brand_id?: string;
}

type CategoryBlogsType = {
  queryPage: number | string | null;
};

function CategoryBlogs({ queryPage }: CategoryBlogsType) {
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = useState(queryPage ? Number(queryPage) : 1);
  const [meta, setMeta] = useState<Meta>();

  const [blogs, setBlogs] = useState<ContentDto[]>([]);

  useEffect(() => {
    router.replace(
      `${pathname}?${queryBuilder({
        page: page,
        // sort_type: sortType?.id,

        // q: searchTextInHeader,
      })}`,
    );
  }, [page]);

  const { data: blogsData, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, page],
    queryFn: () =>
      HomeService?.GetContent({
        key: "blog",
        page: page,
      }),
    staleTime: STALE_TIME.MEDIUM,
  });

  useEffect(() => {
    if (!!blogsData) {
      if (blogsData?.data) setBlogs(blogsData?.data);
      setMeta(blogsData?.meta);
    }
  }, [blogsData]);

  return (
    <div className="w-full px-2 md:px-0  self-center">
      <div className=" w-full">
        {isLoading ? (
          <LottieLoading />
        ) : blogs && blogs?.length > 0 ? (
          <div className="grid grid-cols-1 gap-1 lg:gap-6 lg:grid-cols-3 !pb-8 p-2 !overflow-hidden">
            {blogs?.map((i) => (
              <BlogCard item={i} key={`PRODUCT${i?.id}`} />
            ))}
          </div>
        ) : (
          <div className="col-span-4">
            <EmptyList />
          </div>
        )}
        <Pagination
          totalCount={meta?.total || 0}
          pageSize={meta?.perPage || 10}
          currentPage={meta?.currentPage || 1}
          onClickNext={() => setPage(page + 1)}
          onClickPrev={() => setPage(page - 1)}
          onPageChange={(e) => setPage(Number(e))}
        />
      </div>
    </div>
  );
}

export default CategoryBlogs;
