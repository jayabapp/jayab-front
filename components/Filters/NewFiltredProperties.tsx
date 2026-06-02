import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { HomeService } from "@/api_services/home/home.service";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import { BannerPosition } from "@/enum/banners.enum";
import { FiltersEnum } from "@/enum/filters.enum";
import { DeviceInfo } from "@/helpers/device.detector";
import queryBuilder from "@/helpers/queryBuilder";
import { WeekDays } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeProductsBannerItems from "../Home/HomePropertiesList/HomeProductsBannerItems";
import PropertyCard from "../properties/PropertyCard";
import BtnLoading from "../shared/Button/BtnLoading";
import EmptyList from "../shared/Lotties/EmptyList";
import LottieLoading from "../shared/Lotties/LottieLoading";
import ServerSidePaginate from "../shared/Pagination/ServerSidePaginate";

export interface catQueryTypes {
  max_price: string | null | undefined;
  min_price: string | null | undefined;
  max_building_area: string | null | undefined;
  min_building_area: string | null | undefined;
  sort_type: string | null | undefined;
  cities: string | null | undefined;
  regions: string | null | undefined;
  pattern: string | null | undefined;
  welfare: string | null | undefined;
  cool_heat: string | null | undefined;
  kitchen: string | null | undefined;
  ownership: string | null | undefined;
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
  provinces: string | null | undefined;
  q: string | null | undefined;
  page: string | null | undefined;
  party: string | null | undefined;
  has_discount: string | null | undefined;
  max_commission: string | null | undefined;
  min_commission: string | null | undefined;
  checkout: string | null | undefined;
  checkin: string | null | undefined;
  [key: string]: FiltersEnum | any;
}

type FilterdPropertiesTypePageOrianted = {
  sortType?: { id?: string };
  setSortType: (e: { id?: string; title?: string }) => void | null;
  query: catQueryTypes;
  devices: DeviceInfo;
};

function FilterdPropertiesPageOrianted({ sortType, setSortType, query, devices }: FilterdPropertiesTypePageOrianted) {
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
      })}`,
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
    query?.regions,
    query?.provinces,
    query?.min_commission,
    query?.max_commission,
    query?.checkout,
    query?.checkin,
    query?.party,
    query?.ownership,
    query?.kitchen,
    query?.cool_heat,
    query?.welfare,
    query?.pattern,
    query?.[FiltersEnum.HAS_BLUE_TICK],
    query?.[FiltersEnum.IS_AUTHORIZED],
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
      query?.regions,
      query?.provinces,
      query?.checkout,
      query?.checkin,
      query?.party,
      query?.ownership,
      query?.kitchen,
      query?.cool_heat,
      query?.welfare,
      query?.pattern,
      query?.[FiltersEnum.HAS_BLUE_TICK],
      query?.[FiltersEnum.IS_AUTHORIZED],
    ],
    queryFn: () => {
      return PropertyService?.GetProperties({
        page: Number(page),
        per_page: 30,
        ...(query as any),
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

  const { data: banners } = useQuery({
    queryKey: [HomeService.BANNERS_RANDOM_CACHEKEY, BannerPosition.MAIN_2],
    queryFn: () => {
      return HomeService.GetBanners({ positions: [BannerPosition.MAIN_2] });
    },
  });

  const shuffledBanners = useMemo(() => {
    const bannersList = banners?.[BannerPosition.MAIN_2];

    if (!Array.isArray(bannersList) || bannersList.length === 0) return [];
    const arr = [...bannersList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [banners]);

  // --- NEW LOGIC: Limit banners based on data length ---
  // Show 1 banner per 6 properties (adjust ITEMS_PER_BANNER if needed).
  // If data is empty, show 0 banners.
  const ITEMS_PER_BANNER = 6;
  const maxBanners = data.length > 0 ? Math.ceil(data.length / ITEMS_PER_BANNER) : 0;
  const visibleBanners = shuffledBanners.slice(0, maxBanners);
  const maxVisibleBanners = visibleBanners.splice(0, 2);
  // -----------------------------------------------------

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
                })}`,
              );
            }}
            hasMore={!!hasPaginate ? false : propQueryData?.meta?.lastPage != page ? true : false}
            loader={
              <div className="w-full mt-8  col-span-full flex items-center justify-center">
                <BtnLoading />
              </div>
            }
            className="grid   pb-8 pt-4 md:pt-2 px-3 lg:px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 "
          >
            {/* UPDATED: Map over visibleBanners instead of shuffledBanners */}
            {maxVisibleBanners?.map((e: any, index: number) => (
              <div
                style={{ gridRowStart: (index + 1) * (isMobile ? 7 : 3) }}
                key={`banner${e?.id}`}
                className={` col-span-full  `}
              >
                <HomeProductsBannerItems devices={devices} bannerItem={e} />
              </div>
            ))}
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
