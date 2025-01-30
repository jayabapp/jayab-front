import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { _scrollToTop } from "../../helpers/commonFunctions";

import InfiniteScroll from "react-infinite-scroll-component";

import queryBuilder from "@/helpers/queryBuilder";

import BlogCard from "./BlogCard";
import { HomeService } from "@/api_services/home/home.service";
import { useQuery } from "@tanstack/react-query";
import { ContentDto } from "@/api_services/home/home.interface";
import { Meta } from "@/api_services/chat/chat.interface";
import LottieLoading from "../shared/Lotties/LottieLoading";
import EmptyList from "../shared/Lotties/EmptyList";
import Pagination from "../shared/Pagination";

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
  // sortType?: { id?: string };
  // setSortType: (e: { id?: string; title?: string }) => void | null;
  // query: catQueryTypes;
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
      })}`
    );

    // router.replace(
    //   {
    //     pathname: `/categories${queryString}`,
    //     query: {
    //       ...temp,
    //       page: page,
    //       sort_type: sortType?.id,
    //       available: available ? 1 : 0,
    //       free_shipment: freeShipment ? 1 : 0,
    //     },
    //   },

    //   {
    //     shallow: true,
    //   }
    // );
  }, [page]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getProducts();
  // }, [
  //   router?.query?.page,
  //   min_price,
  //   max_price,
  //   brands,
  //   min_weight,
  //   max_weight,
  //   properties,
  //   q,
  //   sort_type,
  //   router?.query?.slug,
  // ]);

  /* ------------------------ GET BLOGS----------------------- */

  const { data: blogsData, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, page],
    queryFn: () =>
      HomeService?.GetContent({
        key: "blog",
        page: page,
      }),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!!blogsData) {
      if (blogsData?.data) {
        setBlogs(blogsData?.data);
      }
      setMeta(blogsData?.meta);
    }
  }, [blogsData]);

  return (
    <div className="w-full px-2 md:px-0  self-center">
      <div className=" w-full">
        {/* <SortContainer sortType={sortType} setSortType={setSortType} query={query} /> */}
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
          onClickNext={() => setPage(page + 1)}
          onClickPrev={() => setPage(page - 1)}
          onPageChange={(e) => setPage(Number(e))}
          currentPage={meta?.currentPage || 1}
          pageSize={meta?.perPage || 10}
          totalCount={meta?.total || 0}
        />
      </div>
    </div>
  );
}

export default CategoryBlogs;
