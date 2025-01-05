import { difference, last } from "lodash";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import InfiniteScroll from "react-infinite-scroll-component";
import BtnLoading from "../shared/Button/BtnLoading";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "../properties/PropertyCard";
import { fakeVilla } from "@/utils/faker";
import { PropertyService } from "@/api_services/property/property.service";
import LottieLoading from "../shared/Lotties/LottieLoading";
import EmptyList from "../shared/Lotties/EmptyList";
import { PropertyListDto } from "@/api_services/property/property.interface";

export interface catQueryTypes {
  categories: string | null | undefined;
  parent_category: string | null | undefined;
  sort_type: string | null | undefined;
  // cursor: string | null | undefined;
  max_price: string | null | undefined;
  min_price: string | null | undefined;
  is_offer: string | null | undefined;
  is_new: string | null | undefined;
  is_top_sell: string | null | undefined;
  q: string | null | undefined;
  tag_ids: string | null | undefined;
  is_discounted: string | null | undefined;
  is_daily_offer: string | null | undefined;
  is_special_offer: string | null | undefined;
  specifications: string | undefined;
  brands: string | null | undefined;
}

type FilterdPropertiesType = {
  sortType?: { id?: string };
  setSortType: (e: { id?: string; title?: string }) => void | null;
  query: catQueryTypes;
};

function FilterdProperties({ sortType, setSortType, query }: FilterdPropertiesType) {
  const router = useRouter();
  const pathname = usePathname();
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);
  const [cursor, setCursor] = useState(0);

  const [data, setData] = useState<PropertyListDto[]>([]);

  useEffect(() => {
    setCursor(0);
    setData([]);
    let temp = { ...query };
    setRefetcherBoolean(!refetcherBoolean);
    router.replace(
      `${pathname}?${queryBuilder({
        ...temp,

        sort_type: query.sort_type ? query.sort_type : sortType?.id,
      })}`
    );
  }, [
    sortType,
    query.q,
    query.categories,
    query.is_discounted,
    query.is_daily_offer,
    query.is_new,
    query.is_offer,
    query.is_special_offer,
    query.is_top_sell,
    query.max_price,
    query.min_price,
    query.parent_category,
    query.sort_type,
    query.specifications,
    query.tag_ids,
    query.brands,
  ]);

  const {
    isLoading,
    refetch,
    data: propQueryData,
  } = useQuery({
    queryKey: [PropertyService?.GET_PROPERTIES_CACHEKEY],
    queryFn: () => {
      return PropertyService?.GetProperties({
        cursor: Number(cursor),
        //   is_daily_offer: Number(query?.is_daily_offer || 0),
        //   is_discounted: Number(query?.is_discounted || 0),
        //   is_special_offer: Number(query?.is_special_offer || 0),
        //   sort_cheapest: query?.sort_type == "cheapest" ? 1 : 0,
        //   sort_most_sold: query?.sort_type == "best_sellers" ? 1 : 0,
        //   is_top_sell: query?.is_top_sell == "1" ? 1 : 0,
        //   is_new: query?.is_new == "1" ? 1 : 0,
        //   sort_most_expensive: query?.sort_type == "expensive" ? 1 : 0,
        //   sort_newest: query?.sort_type == "new" ? 1 : 0,
        //   specifications: query.specifications,
        //   brand_ids: query.brands || undefined,
        //   min_price: Number(query.min_price) || undefined,
        //   max_price: Number(query.max_price) || undefined,
        //   category_id: query?.categories || query?.parent_category || undefined,
        //   q: query?.q || undefined,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData?.data) {
      if (Number(cursor) == 0 || cursor == 0) {
        setData(propQueryData?.data);
      } else setData((x) => [...x, ...propQueryData?.data]);
    }
  }, [propQueryData]);

  useEffect(() => {
    refetch();
  }, [cursor, refetcherBoolean]);

  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {/* <SortContainer query={query} /> */}

        {isLoading && data?.length == 0 ? (
          <LottieLoading />
        ) : data && data?.length > 0 ? (
          <InfiniteScroll
            dataLength={data?.length} //This is important field to render the next data
            next={() => {
              setCursor(last(data)?.id || 0);
            }}
            hasMore={data?.length % 20 == 0 ? true : false}
            loader={
              <div className="w-full mt-8 flex items-center justify-center">
                <BtnLoading />
              </div>
            }
            className="grid   pb-8 pt-4 !overflow-hidden  grid-cols-2 gap-2 md:gap-4  lg:grid-cols-3 "
          >
            {data?.map((i) => (
              <PropertyCard data={i} key={`PRODUCT${i?.id}`} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="col-span-4">
            <EmptyList />
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterdProperties;
