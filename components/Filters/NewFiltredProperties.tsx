import { BannerPosition } from "@/enum/banners.enum";
import { useProperties } from "@features/properties/hooks/useProperties";
import { HomeService } from "@/api_services/home/home.service";
import { DeviceInfo } from "@/helpers/device.detector";
import { WeekDays } from "@/utils/constantss";
import { isMobile } from "react-device-detect";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import HomeProductsBannerItems from "../Home/HomePropertiesList/HomeProductsBannerItems";
import PropertyCardSkeleton from "../properties/PropertyCardSkeleton";
import { ServerSidePaginate } from "@elements/Pagination";
import InfiniteScroll from "react-infinite-scroll-component";
import PropertyCard from "../properties/PropertyCard";
import EmptyState from "@elements/EmptyState";
import moment from "moment-jalaali";

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
  pet: string | null | undefined;
  has_discount: string | null | undefined;
  max_commission: string | null | undefined;
  min_commission: string | null | undefined;
  checkout: string | null | undefined;
  checkin: string | null | undefined;
  [key: string]: any;
}

type FilterdPropertiesTypePageOrianted = {
  sortType?: { id?: string };
  setSortType: (e: { id?: string; title?: string }) => void | null;
  query: catQueryTypes;
  devices: DeviceInfo;
};

function FilterdPropertiesPageOrianted({
  query,
  devices,
}: FilterdPropertiesTypePageOrianted) {
  const hasPaginate = Boolean(query?.page);
  const week = useMemo<any[]>(() => {
    const dayOfWeek = moment().day();
    return Array.from({ length: 7 }, (_, offset) =>
      WeekDays.find((item) => item.id === (dayOfWeek + offset) % 7),
    );
  }, []);
  const {
    properties: data,
    meta,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useProperties(query);

  const { data: banners } = useQuery({
    queryKey: [HomeService.BANNERS_RANDOM_CACHEKEY, BannerPosition.MAIN_2],
    queryFn: () => {
      return HomeService.GetBanners({ positions: [BannerPosition.MAIN_2] });
    },
  });

  const shuffledBanners = useMemo(() => {
    const bannersList = banners?.[BannerPosition.MAIN_2];

    if (!Array.isArray(bannersList) || bannersList.length === 0) return [];
    return [...bannersList];
  }, [banners]);

  const ITEMS_PER_BANNER = 6;
  const maxBanners =
    data.length > 0 ? Math.ceil(data.length / ITEMS_PER_BANNER) : 0;
  const visibleBanners = shuffledBanners.slice(0, maxBanners);
  const maxVisibleBanners = visibleBanners.splice(0, 2);
  // -----------------------------------------------------

  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {isPending && data.length === 0 ? (
          <div className="grid grid-cols-1 gap-2 px-3 pt-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : data && data?.length > 0 ? (
          <InfiniteScroll
            scrollThreshold={0.5}
            dataLength={data.length}
            next={() => void fetchNextPage()}
            hasMore={!hasPaginate && Boolean(hasNextPage)}
            loader={isFetchingNextPage ? <PropertyCardSkeleton /> : null}
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
            <EmptyState />
          </div>
        )}
      </div>
      {!!meta && hasPaginate ? (
        <ServerSidePaginate
          currentPage={Number(query.page) || 1}
          pageSize={meta.perPage}
          totalCount={meta.total}
          query={query}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default FilterdPropertiesPageOrianted;
