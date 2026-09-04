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
  query,
  devices,
  onClearFilters,
}: DiscoveryResultsProps) => {
  const hasPaginate = Boolean(query?.page);
  const week = weekFromToday();

  const {
    meta,
    refetch,
    isError,
    isPending,
    isFetching,
    properties,
    hasNextPage,
    fetchNextPage,
    isPlaceholderData,
    isFetchingNextPage,
  } = useProperties(query);

  const { data: banners } = useHomeBanners(BANNER_POSITIONS);
  const bannerList = banners?.[BannerPosition.MAIN_2] ?? [];
  const maxBanners =
    properties.length > 0 ? Math.ceil(properties.length / ITEMS_PER_BANNER) : 0;
  const visibleBanners = bannerList.slice(
    0,
    Math.min(maxBanners, MAX_INLINE_BANNERS),
  );

  if (isPending && properties.length === 0) return <PropertyGridSkeleton />;

  if (isError && properties.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          onAction={() => void refetch()}
          title={_STRINGS.ERROR}
          description={_STRINGS.SEARCH_RESULTS_LOAD_ERROR}
          actionLabel={_STRINGS.TRY_AGAIN}
        />
      </div>
    );
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
      {isError ? (
        <div
          role="alert"
          className="mx-3 mt-2 flex items-center justify-between gap-3 rounded-xl bg-danger-50 px-3 py-2 text-xs text-danger-600 lg:mx-1"
        >
          <span>{_STRINGS.SEARCH_RESULTS_LOAD_ERROR}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="shrink-0 font-bold underline underline-offset-4"
          >
            {_STRINGS.TRY_AGAIN}
          </button>
        </div>
      ) : null}
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

      <div
        className={`w-full transition-opacity duration-200 ${
          isPlaceholderData && isFetching ? "opacity-60" : ""
        }`}
      >
        <InfiniteScroll
          className={GRID_CLASS}
          scrollThreshold={0.5}
          dataLength={properties.length}
          next={() => {
            if (!isPlaceholderData && !isFetchingNextPage) void fetchNextPage();
          }}
          loader={isFetchingNextPage ? <PropertyCardSkeleton /> : null}
          hasMore={
            !hasPaginate &&
            !isPlaceholderData &&
            Boolean(hasNextPage) &&
            !isFetchingNextPage
          }
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
