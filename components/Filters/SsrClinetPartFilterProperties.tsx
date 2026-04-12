"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PropertyListDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import queryBuilder from "@/helpers/queryBuilder";
import { WeekDays } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import InfiniteScroll from "react-infinite-scroll-component";
import PropertyCard from "../properties/PropertyCard";
import BtnLoading from "../shared/Button/BtnLoading";
import EmptyList from "../shared/Lotties/EmptyList";
import LottieLoading from "../shared/Lotties/LottieLoading";
import ServerSidePaginate from "../shared/Pagination/ServerSidePaginate";

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
  max_building_area: string | null | undefined;
  min_building_area: string | null | undefined;
  max_commission: string | null | undefined;
  min_commission: string | null | undefined;
  party: string | null | undefined;
  pattern: string | null | undefined;
  page: string | null | undefined;
  q: string | null | undefined;
}

type SsrClinetPartFilterPropertiesType = {
  sortType?: { id?: string };
  pageQuery: string | null | undefined;
  query: any;
  hiddenFilters: string[];
};

export const removeKeyArray = (keys: string[], object: { [keys: string]: any }) => {
  for (let index = 0; index < keys.length; index++) {
    delete object?.[keys[index]];
  }
};

function SsrClinetPartFilterProperties({
  sortType,
  query,
  pageQuery,
  hiddenFilters,
}: SsrClinetPartFilterPropertiesType) {
  const router = useRouter();
  const pathname = usePathname();
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);
  const [hasPaginate, setHasPaginate] = useState(false);
  const [week, setWeek] = useState<any[]>([]);
  const [data, setData] = useState<PropertyListDto[]>([]);
  const [page, setPage] = useState(pageQuery ? Number(pageQuery) : 1);
  useEffect(() => {
    if (!!hiddenFilters) {
      setData([]);
      let temp = { ...query };
      removeKeyArray(hiddenFilters, temp);
      setRefetcherBoolean(!refetcherBoolean);
      if (!!temp) {
        router.replace(
          `${pathname}?${queryBuilder({
            ...temp,
          })}`,
        );
      }
    }
  }, [sortType, JSON.stringify(query)]);

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
      query?.sort_type,
      query?.max_building_area,
      query?.min_building_area,
      query.max_price,
      query.min_price,
      query.min_commission,
      query.max_commission,
      query.party,
      query?.q,
      query?.pattern,
    ],
    queryFn: () => {
      return PropertyService?.GetProperties({
        page: Number(page),
        min_price: Number(query.min_price) || undefined,
        max_price: Number(query.max_price) || undefined,
        max_building_area: Number(query.max_building_area) || undefined,
        min_building_area: Number(query.min_building_area) || undefined,
        max_commission: Number(query.max_commission) || undefined,
        min_commission: Number(query.min_commission) || undefined,
        per_page: 51,
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
        sort_type: query?.sort_type || undefined,
        q: query?.q || undefined,
        party: query?.party || undefined,
        pattern: query?.pattern || undefined,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData?.data) {
      if (Number(page) == 1 || page == 1) {
        setData([]);
      } else setData((x) => [...x, ...propQueryData?.data]);
    }
  }, [propQueryData]);

  useEffect(() => {
    if (page != 1) refetch();
  }, [page, refetcherBoolean]);

  useEffect(() => {
    const dayOfWeek = moment().day();

    const weeks = [];
    for (let index = dayOfWeek; index < dayOfWeek + 7; index++) {
      const item = WeekDays?.find((e) => {
        if (index >= 7) {
          return e?.id == index - 7;
        } else {
          return e?.id == index;
        }
      });
      if (index < 7) {
        weeks.push(item);
      } else {
        weeks.push(item);
      }
    }

    setWeek(weeks);
  }, []);

  useEffect(() => {
    if (pageQuery) {
      setHasPaginate(true);
    }
  }, []);
  useEffect(() => {
    if (pageQuery) {
      setPage(Number(pageQuery));
    } else {
      setPage(1);
      setHasPaginate(false);
    }
  }, [pageQuery]);
  return (
    <div className="w-full px-0  self-center">
      {page != 1 ? (
        <div className=" w-full">
          {/* <SortContainer query={query} /> */}

          {isLoading && data?.length == 0 ? (
            <LottieLoading />
          ) : data && data?.length > 0 ? (
            <InfiniteScroll
              scrollThreshold={0.5}
              dataLength={data?.length} //This is important field to render the next data
              next={() => {
                let temp = { ...query };
                removeKeyArray(hiddenFilters, temp);
                window?.history?.replaceState(
                  {},
                  "",
                  `${pathname}?${queryBuilder({
                    ...temp,
                    page: propQueryData?.meta?.next || 1,
                    // sort_type: query.sort_type ? query.sort_type : sortType?.id,
                  })}`,
                );
              }}
              hasMore={!!hasPaginate ? false : propQueryData?.meta?.lastPage != page ? true : false}
              loader={
                <div className="w-full md:col-span-2 xl:col-span-3  mt-8 flex items-center justify-center">
                  <BtnLoading />
                </div>
              }
              className="grid   pb-8 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 "
            >
              {data?.map((i) => (
                <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
              ))}
            </InfiniteScroll>
          ) : (
            <div className="col-span-4">
              <EmptyList />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {!!propQueryData?.meta && !!hasPaginate ? (
        <ServerSidePaginate
          currentPage={page}
          pageSize={propQueryData?.meta?.perPage}
          totalCount={propQueryData?.meta?.total}
          query={
            !!hiddenFilters
              ? (() => {
                  let temp = { ...query };
                  removeKeyArray(hiddenFilters, temp);

                  return temp;
                })()
              : query
          }
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default SsrClinetPartFilterProperties;
