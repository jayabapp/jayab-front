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
  max_price: string | null | undefined;
  min_price: string | null | undefined;
  sort_type: string | null | undefined;
  cities: string | null | undefined;
  code: string | null | undefined;
  entertainment: string | null | undefined;
  has_pool: string | null | undefined;
  total_guests: string | null | undefined;
  is_premium: string | null | undefined;
  start_day: string | null | undefined;
  num_days: string | null | undefined;
  total_bedrooms: string | null | undefined;
  property_type: string | null | undefined;
  pool_type: string | null | undefined;
  title: string | null | undefined;
  province_id: string | null | undefined;
  has_discount: string | null | undefined;
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
    query.max_price,
    query.min_price,
    query.sort_type,
    query?.property_type,
    query?.pool_type,
    query?.has_pool,
    query?.total_bedrooms,
    query?.total_guests,
    query?.entertainment,
    query?.has_discount,
    query?.is_premium,
  ]);

  const {
    isLoading,
    refetch,
    data: propQueryData,
  } = useQuery({
    queryKey: [
      PropertyService?.GET_PROPERTIES_CACHEKEY,
      query?.property_type,
      query?.pool_type,
      query?.has_pool,
      query?.total_bedrooms,
      query?.total_guests,
      query?.entertainment,
      query?.has_discount,
      query?.is_premium,
    ],
    queryFn: () => {
      return PropertyService?.GetProperties({
        cursor: Number(cursor),
        min_price: Number(query.min_price) || undefined,
        max_price: Number(query.max_price) || undefined,
        per_page: 20,
        cities: query?.cities || undefined,
        code: query?.code || undefined,
        entertainment: query?.entertainment || undefined,
        has_pool: query?.has_pool || undefined,
        is_premium: query?.is_premium || undefined,
        total_guests: query?.total_guests || undefined,
        start_day: query?.start_day || undefined,
        num_days: query?.num_days || undefined,
        total_bedrooms: query?.total_bedrooms || undefined,
        property_type: query?.property_type || undefined,
        pool_type: query?.pool_type || undefined,
        has_discount: query?.has_discount || undefined,
        province_id: query?.province_id || undefined,
        title: query?.title || undefined,
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
            className="grid   pb-8 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 "
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
