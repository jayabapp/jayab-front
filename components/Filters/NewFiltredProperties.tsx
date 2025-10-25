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
import moment from "moment-jalaali";
import { WeekDays } from "@/utils/constantss";
import ServerSidePaginate from "../shared/Pagination/ServerSidePaginate";

export interface catQueryTypes {
  max_price: string | null | undefined;
  min_price: string | null | undefined;
  max_building_area: string | null | undefined;
  min_building_area: string | null | undefined;
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
  q: string | null | undefined;
  page: string | null | undefined;
  party: string | null | undefined;
  has_discount: string | null | undefined;
  max_commission: string | null | undefined;
  min_commission: string | null | undefined;
  checkout: string | null | undefined;
  checkin: string | null | undefined;
}

type FilterdPropertiesTypePageOrianted = {
  sortType?: { id?: string };
  setSortType: (e: { id?: string; title?: string }) => void | null;
  query: catQueryTypes;
};

function FilterdPropertiesPageOrianted({ sortType, setSortType, query }: FilterdPropertiesTypePageOrianted) {
  const router = useRouter();
  const [hasPaginate, setHasPaginate] = useState(false);
  const [week, setWeek] = useState<any[]>([]);
  const pathname = usePathname();
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);
  const [page, setPage] = useState(query?.page ? Number(query?.page) : 1);

  const [data, setData] = useState<PropertyListDto[]>([]);

  useEffect(() => {
    setData([]);
    let temp = { ...query };
    setRefetcherBoolean(!refetcherBoolean);
    router.replace(
      `${pathname}?${queryBuilder({
        ...temp,

        // sort_type: query.sort_type ? query.sort_type : sortType?.id,
      })}`
    );
  }, [
    sortType,
    query.max_price,

    query.sort_type,
    query?.property_type,
    query?.pool_type,
    query?.has_pool,
    query?.total_bedrooms,
    query?.total_guests,
    query?.entertainment,
    query?.has_discount,
    query?.is_premium,
    query?.max_price,
    query?.min_price,
    query?.max_building_area,
    query?.min_building_area,
    query?.q,
    query?.cities,
    query?.province_id,
    query?.min_commission,
    query?.max_commission,
    query?.checkout,
    query?.checkin,
    query?.party,
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
      query?.sort_type,
      query?.max_price,
      query?.min_price,
      query?.max_building_area,
      query?.min_building_area,
      query?.min_commission,
      query?.max_commission,
      query?.q,
      query?.cities,
      query?.province_id,
      query?.checkout,
      query?.checkin,
      query?.party,
    ],
    queryFn: () => {
      return PropertyService?.GetProperties({
        page: Number(page),
        min_price: Number(query.min_price) || undefined,
        max_price: Number(query.max_price) || undefined,
        max_building_area: Number(query.max_building_area) || undefined,
        min_building_area: Number(query.min_building_area) || undefined,
        min_commission: Number(query.min_commission) || undefined,
        max_commission: Number(query.max_commission) || undefined,
        per_page: 30,
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
        checkout: query?.checkout || undefined,
        checkin: query?.checkin || undefined,
        q: query?.q || undefined,
        party: query?.party || undefined,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData?.data) {
      if (!!hasPaginate) {
        setData(propQueryData?.data);
      } else {
        if (Number(page) == 1 || page == 1) {
          setData(propQueryData?.data);
        } else setData((x) => [...x, ...propQueryData?.data]);
      }
    }
  }, [propQueryData, hasPaginate]);

  useEffect(() => {
    refetch();
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
    if (query?.page) {
      setHasPaginate(true);
    }
  }, []);
  useEffect(() => {
    if (query?.page) {
      setPage(Number(query?.page));
    } else {
      setPage(1);
      setHasPaginate(false);
    }
  }, [query?.page]);

  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {isLoading && data?.length == 0 ? (
          <div className="col-span-full">
            {" "}
            <LottieLoading />{" "}
          </div>
        ) : data && data?.length > 0 ? (
          <InfiniteScroll
            scrollThreshold={0.5}
            dataLength={data?.length} //This is important field to render the next data
            next={() => {
              // setPage(propQueryData?.meta?.next || 1);
              window?.history?.replaceState(
                {},
                "",
                `${pathname}?${queryBuilder({
                  ...query,
                  page: propQueryData?.meta?.next || 1,
                  // sort_type: query.sort_type ? query.sort_type : sortType?.id,
                })}`
              );
            }}
            hasMore={!!hasPaginate ? false : propQueryData?.meta?.lastPage != page ? true : false}
            loader={
              <div className="w-full mt-8  col-span-full flex items-center justify-center">
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
          <div className="col-span-full">
            <EmptyList />
          </div>
        )}
      </div>
      {!!propQueryData?.meta && !!hasPaginate ? (
        <ServerSidePaginate
          currentPage={page}
          pageSize={propQueryData?.meta?.perPage}
          totalCount={propQueryData?.meta?.total}
          query={query}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default FilterdPropertiesPageOrianted;
