"use client";

import { PropertyGridItems, PropertyGridSkeleton } from "@modules/PropertyGrid";
import { useLoadMoreOnScroll } from "@hooks/useLoadMoreOnScroll";
import { ServerSidePaginate } from "@elements/Pagination";
import { useTranslations } from "next-intl";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useHomeBanners } from "@features/home/hooks/useHomeBanners";
import { BannerPosition } from "@/enum/banners.enum";
import { useProperties } from "@features/properties/hooks/useProperties";
import { hasUsableBbox } from "@features/properties/lib/bbox";
import { useCallback } from "react";
import { useMapArea } from "@features/properties/hooks/useMapArea";
import { BtnLoading } from "@elements/Button";
import { GRID_CLASS } from "@/utils/constantss";

import type { FocusEvent, PointerEvent } from "react";
import type { DiscoveryResultsProps } from "@/types/components/modules/property-discovery";

import EmptyState from "@elements/EmptyState";

const BANNER_POSITIONS = [BannerPosition.MAIN_2];
const ITEMS_PER_BANNER = 6;
const MAX_INLINE_BANNERS = 2;

const hoveredCardId = (target: EventTarget | null) => {
  const card = (target as Element | null)?.closest?.("[data-property-id]");
  return card ? Number(card.getAttribute("data-property-id")) : null;
};

const DiscoveryResults = ({
  query,
  devices,
  clearLabel,
  onClearFilters,
}: DiscoveryResultsProps) => {
  const t = useTranslations();

  const hasPaginate = Boolean(query?.page);
  const { isEnabled: hasMap, hover } = useDiscoveryMap();
  const { clearArea } = useMapArea();
  const isAreaBroken = !hasUsableBbox(query);

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

  const loadNextPage = useCallback(() => void fetchNextPage(), [fetchNextPage]);
  const loadMoreRef = useLoadMoreOnScroll({
    onLoadMore: loadNextPage,
    enabled:
      !hasPaginate && hasNextPage && !isFetchingNextPage && !isPlaceholderData,
  });

  const { data: banners } = useHomeBanners(BANNER_POSITIONS);
  const bannerList = banners?.[BannerPosition.MAIN_2] ?? [];
  const maxBanners =
    properties.length > 0 ? Math.ceil(properties.length / ITEMS_PER_BANNER) : 0;
  const visibleBanners = bannerList.slice(
    0,
    Math.min(maxBanners, MAX_INLINE_BANNERS),
  );

  if (isAreaBroken)
    return (
      <div className="col-span-full">
        <EmptyState
          onAction={clearArea}
          title={t("common.error")}
          description={t("listing.mapAreaInvalid")}
          actionLabel={t("listing.removeMapArea")}
        />
      </div>
    );

  if (isPending && properties.length === 0)
    return <PropertyGridSkeleton className={GRID_CLASS} />;

  if (isError && properties.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          title={t("common.error")}
          onAction={() => void refetch()}
          actionLabel={t("common.tryAgain")}
          description={t("listing.searchResultsLoadError")}
        />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          onAction={onClearFilters ?? (query.bbox ? clearArea : undefined)}
          title={t("listing.noResultTitle")}
          description={t("listing.noResultDescription")}
          actionLabel={
            onClearFilters
              ? (clearLabel ?? t("listing.clearAllFilters"))
              : query.bbox
                ? t("listing.removeMapArea")
                : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full self-center px-0">
      {isError ? (
        <div
          role="alert"
          className="mx-3 mt-2 flex items-center justify-between gap-3 rounded-xl bg-status-danger-bg px-3 py-2 text-xs text-status-danger lg:mx-1"
        >
          <span>{t("listing.searchResultsLoadError")}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="shrink-0 font-bold underline underline-offset-4"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      ) : null}

      <div
        className={`w-full transition-opacity duration-200 ${
          isPlaceholderData && isFetching ? "opacity-60" : ""
        }`}
      >
        <div
          className={GRID_CLASS}
          onPointerLeave={hasMap ? () => hover.set(null) : undefined}
          onFocus={
            hasMap
              ? (event: FocusEvent) => hover.set(hoveredCardId(event.target))
              : undefined
          }
          onBlur={
            hasMap
              ? (event: FocusEvent<HTMLDivElement>) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    hover.set(null);
                }
              : undefined
          }
          onPointerOver={
            hasMap
              ? (event: PointerEvent) => {
                  if (event.pointerType !== "touch")
                    hover.set(hoveredCardId(event.target));
                }
              : undefined
          }
        >
          <PropertyGridItems
            devices={devices}
            data={properties}
            banners={visibleBanners}
            searchParams={{
              checkin: query?.checkin,
              checkout: query?.checkout,
              total_guests: query?.total_guests,
            }}
          />
        </div>
        {!hasPaginate && hasNextPage ? (
          <div
            ref={loadMoreRef}
            aria-busy={isFetchingNextPage}
            className="flex min-h-16 w-full items-center justify-center px-3 pb-8"
          >
            {isFetchingNextPage ? <BtnLoading /> : <></>}
          </div>
        ) : null}
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
