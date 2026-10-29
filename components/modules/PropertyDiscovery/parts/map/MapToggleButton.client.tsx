"use client";

import { DISCOVERY_MAP_COLUMN_QUERY } from "@features/map/constants/discovery-map";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@features/map/hooks/useMediaQuery";
import { Icon } from "@elements/Icon";

const MapToggleButton = () => {
  const t = useTranslations("listing");
  const isWide = useMediaQuery(DISCOVERY_MAP_COLUMN_QUERY);
  const { isEnabled, isColumnOpen, setIsColumnOpen } = useDiscoveryMap();

  if (!isEnabled || !isWide) return null;

  return (
    <button
      type="button"
      aria-pressed={isColumnOpen}
      onClick={() => setIsColumnOpen((open) => !open)}
      className={`filter-chip shrink-0 cursor-pointer ${
        isColumnOpen ? "filter-chip-active" : "filter-chip-idle"
      }`}
    >
      <Icon name="map" size={20} />
      <span>{isColumnOpen ? t("mapHide") : t("mapShow")}</span>
    </button>
  );
};

export default MapToggleButton;
