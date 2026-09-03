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
import numberWithCommas from "@/helpers/numberWithCommas";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";

const BANNER_POSITIONS = [BannerPosition.MAIN_2];
const ITEMS_PER_BANNER = 6;
const MAX_INLINE_BANNERS = 2;
const GRID_CLASS =
  "grid pb-8 pt-4 md:pt-2 px-3 lg:px-1 !overflow-hidden grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-3";

const DiscoveryResults = ({
  devices,
  onClearFilters,
  query,
}: DiscoveryResultsProps) => {
  const hasPaginate = Boolean(query?.page);
  const week = weekFromToday();

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isPlaceholderData,
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

  // Only the very first load has nothing to show. Every later filter change
  // keeps the previous results on screen — see `placeholderData` on
  // `propertiesOptions` — so the reader's place in the list survives.
  if (isPending && properties.length === 0) {
    return <PropertyGridSkeleton />;
  }

  if (properties.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          onAction={onClearFilters}
          title={_STRINGS.NO_RESULT_TITLE}
          description={_STRINGS.NO_RESULT_DESCRIPTION}
          actionLabel={onClearFilters ? _STRINGS.REMOVE_FILTERS : undefined}
        />
      </div>
    );
  }

  return (
    <div className="w-full self-center px-0">
      {/* The API already computes this total for pagination; not showing it was
          leaving the one number that tells a visitor whether their filters were
          reasonable sitting unused in the response. */}
      {meta?.total ? (
        <p
          aria-live="polite"
          className="px-3 pt-2 text-xs text-neutral-600 lg:px-1"
        >
          <span className="font-bold text-neutral-900">
            {numberWithCommas(meta.total)}
          </span>{" "}
          {_STRINGS.RESULTS_FOUND_PREFIX}
        </p>
      ) : (
        <></>
      )}

      {/* Dimmed, not replaced. `pointer-events-none` stops a click landing on a
          card that is about to be swapped for a different property. */}
      <div
        className={`w-full transition-opacity duration-200 ${
          isPlaceholderData ? "pointer-events-none opacity-50" : ""
        }`}
      >
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default DiscoveryResults;
