"use client";

import { DISCOVERY_MAP_COLUMN_QUERY } from "@features/map/constants/discovery-map";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useTranslations } from "next-intl";
import { useProperties } from "@features/properties/hooks/useProperties";
import { useMediaQuery } from "@features/map/hooks/useMediaQuery";

import type { DiscoveryMapHostProps } from "@/types/components/modules/discovery-map";

import DiscoveryMapSheet from "./DiscoveryMapSheet.client";
import dynamic from "next/dynamic";

const DiscoveryMap = dynamic(() => import("./DiscoveryMap.client"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

const MapPlaceholder = () => (
  <div
    aria-hidden="true"
    className="size-full animate-pulse bg-surface-muted"
  />
);

const DiscoveryMapHost = ({
  query,
  isFilterOpen,
  onOpenFilters,
  onCloseFilters,
}: DiscoveryMapHostProps) => {
  const t = useTranslations("listing");
  const isWide = useMediaQuery(DISCOVERY_MAP_COLUMN_QUERY);
  const { isColumnOpen, isSheetOpen, setIsColumnOpen, setIsSheetOpen } =
    useDiscoveryMap();
  const { properties, isPending, isFetching, isPlaceholderData } =
    useProperties(query);

  const isListSettled = !isPlaceholderData && !isFetching;
  const closeSheet = () => setIsSheetOpen(false);

  return (
    <>
      {isColumnOpen ? (
        <aside
          aria-label={t("mapResultsAria")}
          className="discovery-map-column"
        >
          {isWide && !isPending ? (
            <DiscoveryMap
              query={query}
              variant="column"
              properties={properties}
              isListSettled={isListSettled}
              onClose={() => setIsColumnOpen(false)}
            />
          ) : (
            <MapPlaceholder />
          )}
        </aside>
      ) : null}

      {!isWide && isSheetOpen ? (
        <DiscoveryMapSheet
          onClose={closeSheet}
          label={t("mapResultsAria")}
          isFilterOpen={isFilterOpen}
          onCloseFilters={onCloseFilters}
        >
          {(close) => (
            <DiscoveryMap
              query={query}
              variant="sheet"
              onClose={close}
              properties={properties}
              onOpenFilters={onOpenFilters}
              isListSettled={isListSettled}
            />
          )}
        </DiscoveryMapSheet>
      ) : null}
    </>
  );
};

export default DiscoveryMapHost;
