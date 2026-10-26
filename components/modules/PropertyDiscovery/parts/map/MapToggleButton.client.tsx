"use client";

import { DISCOVERY_MAP_COLUMN_QUERY } from "@features/map/constants/discovery-map";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@features/map/hooks/useMediaQuery";
import { useMapSupport } from "@features/map/hooks/useMapSupport";
import { createPortal } from "react-dom";
import { Icon } from "@elements/Icon";

const MOBILE_NAV_CLEARANCE = "calc(7rem + env(safe-area-inset-bottom))";

const MapToggleButton = () => {
  const t = useTranslations("listing");
  const isWide = useMediaQuery(DISCOVERY_MAP_COLUMN_QUERY);
  const isMounted = useMapSupport() !== null;
  const {
    isEnabled,
    isColumnOpen,
    isSheetOpen,
    setIsColumnOpen,
    setIsSheetOpen,
  } = useDiscoveryMap();

  if (!isEnabled) return null;

  if (!isWide)
    return isMounted
      ? createPortal(
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setIsSheetOpen(true)}
            style={{ bottom: MOBILE_NAV_CLEARANCE }}
            className={`${isSheetOpen ? "hidden" : "flex"} fixed inset-x-0 z-20 mx-auto h-11 w-fit cursor-pointer items-center gap-2 rounded-full bg-action px-5 text-sm font-medium text-on-action shadow-elevated transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2`}
          >
            <Icon name="map" size={20} />
            {t("mapShow")}
          </button>,
          document.body,
        )
      : null;

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
