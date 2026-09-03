import type { CategoryBlogsProps } from "@/types/components/modules/blog";
import { useContentList } from "@features/home/hooks/useContentList";
import { useRouter, usePathname } from "next/navigation";
import { BlogGridSkeleton } from "./BlogGridSkeleton";
import { useEffect, useState } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import EmptyState from "@elements/EmptyState";
import Pagination from "@elements/Pagination";
import BlogCard from "./BlogCard";

const CategoryBlogs = ({ queryPage }: CategoryBlogsProps) => {
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
            {blogs?.map((i, index) => (
              <BlogCard index={index} item={i} key={`PRODUCT${i?.id}`} />
            ))}
          </div>
        ) : (
          <div className="col-span-4">
            <EmptyState />
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
};

export default CategoryBlogs;
