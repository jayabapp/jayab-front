"use client";

import { DISCOVERY_MAP_COLUMN_QUERY } from "@features/map/constants/discovery-map";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useTranslations } from "next-intl";
import { useProperties } from "@features/properties/hooks/useProperties";
import { useMediaQuery } from "@features/map/hooks/useMediaQuery";

import type { DiscoveryMapHostProps } from "@/types/components/modules/discovery-map";

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

const DiscoveryMapHost = ({ query }: DiscoveryMapHostProps) => {
  const t = useTranslations("listing");
  const isWide = useMediaQuery(DISCOVERY_MAP_COLUMN_QUERY);
  const { isColumnOpen, setIsColumnOpen } = useDiscoveryMap();
  const { properties, isPending, isFetching, isPlaceholderData } =
    useProperties(query);

  if (!isColumnOpen) return null;

  return (
    <aside aria-label={t("mapResultsAria")} className="discovery-map-column">
      {isWide && !isPending ? (
        <DiscoveryMap
          query={query}
          variant="column"
          properties={properties}
          isListSettled={!isPlaceholderData && !isFetching}
          onClose={() => setIsColumnOpen(false)}
        />
      ) : (
        <MapPlaceholder />
      )}
    </aside>
  );
};

export default DiscoveryMapHost;
