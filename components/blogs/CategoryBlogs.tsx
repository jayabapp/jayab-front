import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogGridSkeleton } from "./BlogGridSkeleton";
import { useContentList } from "@features/home/hooks/useContentList";

import queryBuilder from "@/helpers/queryBuilder";
import Pagination from "../shared/Pagination";
import EmptyList from "../shared/Lotties/EmptyList";
import BlogCard from "./BlogCard";

export interface catQueryTypes {
  q?: string;
  page?: string;
  tag_ids?: string;
  sort_type: string;
  brand_id?: string;
  store_id?: string;
  max_price?: string;
  min_price?: string;
  store_name?: string;
  min_weight?: string;
  max_weight?: string;
  properties?: string[];
  is_new?: "true" | "false";
  is_offer?: "true" | "false";
  categories?: string | string[];
}

type CategoryBlogsType = {
  queryPage: number | string | null;
};

function CategoryBlogs({ queryPage }: CategoryBlogsType) {
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = useState(queryPage ? Number(queryPage) : 1);

  useEffect(() => {
    router.replace(
      `${pathname}?${queryBuilder({
        page: page,
      })}`,
    );
  }, [page, pathname, router]);

  const {
    meta,
    isLoading,
    items: blogs,
  } = useContentList({ key: "blog", page });

  return (
    <div className="w-full px-2 md:px-0  self-center">
      <div className=" w-full">
        {isLoading ? (
          <BlogGridSkeleton />
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
