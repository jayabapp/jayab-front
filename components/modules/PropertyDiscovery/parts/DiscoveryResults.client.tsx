"use client";

import type { DiscoveryResultsProps } from "@/types/components/modules/property-discovery";
import { PropertyGridItems, PropertyGridSkeleton } from "@modules/PropertyGrid";
import { useProperties } from "@features/properties/hooks/useProperties";
import { useHomeBanners } from "@features/home/hooks/useHomeBanners";
import { PropertyCardSkeleton } from "@modules/PropertyGrid";
import { ServerSidePaginate } from "@elements/Pagination";
import { weekFromToday } from "@/helpers/weekFromToday";
import { BannerPosition } from "@/enum/banners.enum";

import InfiniteScroll from "react-infinite-scroll-component";
import EmptyState from "@elements/EmptyState";

const BANNER_POSITIONS = [BannerPosition.MAIN_2];
const ITEMS_PER_BANNER = 6;
const MAX_INLINE_BANNERS = 2;
const GRID_CLASS =
  "grid pb-8 pt-4 md:pt-2 px-3 lg:px-1 !overflow-hidden grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-3";

const DiscoveryResults = ({ devices, query }: DiscoveryResultsProps) => {
  const hasPaginate = Boolean(query?.page);
  const week = weekFromToday();

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    meta,
    properties,
  } = useProperties(query);

  const { data: banners } = useHomeBanners(BANNER_POSITIONS);
  const bannerList = banners?.[BannerPosition.MAIN_2] ?? [];
  const maxBanners =
    properties.length > 0 ? Math.ceil(properties.length / ITEMS_PER_BANNER) : 0;
  const visibleBanners = bannerList.slice(
    0,
    Math.min(maxBanners, MAX_INLINE_BANNERS),
  );

  if (isPending && properties.length === 0) {
    return <PropertyGridSkeleton />;
  }

  if (properties.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="w-full px-0 self-center">
      <div className="w-full">
        <InfiniteScroll
          className={GRID_CLASS}
          scrollThreshold={0.5}
          dataLength={properties.length}
          next={() => void fetchNextPage()}
          loader={isFetchingNextPage ? <PropertyCardSkeleton /> : null}
          hasMore={!hasPaginate && Boolean(hasNextPage) && !isFetchingNextPage}
        >
          <PropertyGridItems
            week={week}
            devices={devices}
            data={properties}
            banners={visibleBanners}
          />
        </InfiniteScroll>
      </div>

      {meta && hasPaginate ? (
        <ServerSidePaginate
          query={query}
          totalCount={meta.total}
          pageSize={meta.perPage}
          currentPage={Number(query.page) || 1}
        />
      ) : null}
    </div>
  );
};

export default DiscoveryResults;
