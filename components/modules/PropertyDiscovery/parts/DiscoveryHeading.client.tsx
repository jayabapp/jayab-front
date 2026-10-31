"use client";

import { DISCOVERY_MAP_COLUMN_QUERY } from "@features/map/constants/discovery-map";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { useMediaQuery } from "@features/map/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import { useProperties } from "@features/properties/hooks/useProperties";

import type { DiscoveryHeadingProps } from "@/types/components/modules/property-discovery";

const DiscoveryHeading = ({
  title,
  query,
  compact = false,
}: DiscoveryHeadingProps) => {
  const t = useTranslations("listing");
  const formatNumber = useFormatNumber();
  const { meta } = useProperties(query);
  const { isEnabled, isColumnOpen } = useDiscoveryMap();
  const isWide = useMediaQuery(DISCOVERY_MAP_COLUMN_QUERY);
  // The list is the map's area whenever a map sits beside or under it.
  const isInArea = compact || (isEnabled && isWide && isColumnOpen);

  // The compact line keeps its height while the count loads, so the sheet below does not jump.
  const count =
    typeof meta?.total === "number"
      ? t(isInArea ? "mapAreaCount" : "propertyCount", {
          formatted: formatNumber(meta.total),
        })
      : null;

  return (
    <div
      className={
        compact
          ? "flex min-w-0 flex-col gap-0.5 px-4 pb-3"
          : "flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 xl:px-0"
      }
    >
      <h1
        className={
          compact
            ? "min-w-0 truncate text-base font-bold text-ink"
            : "text-xl font-bold text-ink md:text-2xl"
        }
      >
        {title}
      </h1>
      {count || compact ? (
        <p
          className={`shrink-0 text-ink-subtle ${compact ? "min-h-4 text-xs" : "text-sm"}`}
        >
          {count}
        </p>
      ) : null}
    </div>
  );
};

export default DiscoveryHeading;
