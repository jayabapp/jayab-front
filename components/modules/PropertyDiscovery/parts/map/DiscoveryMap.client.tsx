"use client";

import { useCallback, useEffect, useEffectEvent } from "react";
import { destinationKey, pinPriceLabel } from "@features/map/lib/map-camera";
import { formatBbox, isPointLikeBbox } from "@features/properties/lib/bbox";
import { useTranslations, useLocale } from "next-intl";
import { formatListingPriceFor } from "@/helpers/intl/number";
import { CLUSTER_MAX_FIT_ZOOM } from "@features/map/constants/discovery-map";
import { MAP_MOVE_DEBOUNCE_MS } from "@features/map/constants/discovery-map";
import { useHoveredPropertyId } from "@features/properties/context/DiscoveryMapContext";
import { DEFAULT_MAP_BOUNDS } from "@features/map/lib/map-camera";
import { padBbox, parseBbox } from "@features/properties/lib/bbox";
import { useRef, useState } from "react";
import { usePropertiesMap } from "@features/properties/hooks/usePropertiesMap";
import { useListSeparator } from "@hooks/useListSeparator";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { boundsOfPoints } from "@features/map/lib/map-camera";
import { useMapMarkers } from "@features/map/hooks/useMapMarkers";
import { useMapSupport } from "@features/map/hooks/useMapSupport";
import { resolveLocale } from "@/i18n/config";
import { publicPoints } from "@features/map/lib/map-camera";
import { IRAN_CENTER } from "@features/map/constants/flight";
import { useMapArea } from "@features/properties/hooks/useMapArea";
import { NeshanMap } from "@elements/Map";
import { Icon } from "@elements/Icon";

import type { CSSProperties, KeyboardEvent } from "react";
import type { MapClusterItem, MapItem } from "@/types/features/map";
import type { NeshanMapInstance } from "@/types/components/elements/map";
import type { DiscoveryMapProps } from "@/types/components/modules/discovery-map";
import type { MarkerDescription } from "@/types/features/map";
import type { MapPropertyItem } from "@/types/features/map";
import type { MapBounds } from "@/types/components/elements/map";
import type { MapCamera } from "@features/properties/hooks/usePropertiesMap";
import type { Bbox } from "@features/properties/lib/bbox";

import DiscoveryMapPreview from "./DiscoveryMapPreview.client";
import DiscoveryMapProblem from "./DiscoveryMapProblem";

const NO_ITEMS: readonly MapItem[] = [];
const INITIAL_ZOOM = 5;
const FIT_PADDING_PX = 64;
const FIT_MAX_ZOOM = 15;
const STACK_AREA_PAD_DEGREES = 0.0005;

const PILL_CLASS =
  "pointer-events-auto flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink shadow-elevated transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

const CARD_SLOT_CLASS = "absolute inset-x-3 z-20 flex justify-center";
const FOOT_GAP_PX = 40;

const asMapBounds = ([west, south, east, north]: Bbox): MapBounds => [
  west,
  south,
  east,
  north,
];

const fitTo = (
  map: NeshanMapInstance,
  bounds: MapBounds,
  options: Parameters<NeshanMapInstance["fitBounds"]>[1],
) => map.fitBounds(bounds, options, { programmatic: true });

const readCamera = (map: NeshanMapInstance): MapCamera => {
  const bounds = map.getBounds();
  return {
    zoom: map.getZoom(),
    bbox: formatBbox([
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ]),
  };
};

const DiscoveryMap = ({
  query,
  variant,
  onClose,
  properties,
  isListSettled,
  bottomInset = 0,
}: DiscoveryMapProps) => {
  const t = useTranslations();
  const separator = useListSeparator();
  const locale = resolveLocale(useLocale());
  const isSupported = useMapSupport();

  const { view, selectedId, searchScope, setSelectedId } = useDiscoveryMap();
  const hoveredId = useHoveredPropertyId();
  const { appliedBbox, applyArea } = useMapArea();
  const destination = destinationKey(query);

  const [map, setMap] = useState<NeshanMapInstance | null>(null);
  const [camera, setCamera] = useState<MapCamera | null>(null);
  const [stackSelection, setStackSelection] = useState<{
    scope: string;
    item: MapClusterItem;
  } | null>(null);
  const stack =
    stackSelection?.scope === searchScope ? stackSelection.item : null;
  const setStack = (item: MapClusterItem | null) =>
    setStackSelection(item ? { scope: searchScope, item } : null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [initial] = useState(() => {
    const saved = view.get();
    if (
      saved &&
      saved.destination === destination &&
      (!appliedBbox || saved.area === appliedBbox)
    )
      return {
        center: saved.center,
        zoom: saved.zoom,
        bounds: null,
        needsFit: false,
      };
    const box = appliedBbox ? parseBbox(appliedBbox) : null;
    return {
      center: IRAN_CENTER,
      zoom: INITIAL_ZOOM,
      needsFit: !box && !isListSettled,
      bounds: asMapBounds(
        box ?? boundsOfPoints(publicPoints(properties)) ?? DEFAULT_MAP_BOUNDS,
      ),
    };
  });

  const {
    data,
    isError,
    isFetching,
    isSettling,
    refetch: refetchPins,
  } = usePropertiesMap(query, camera, map !== null);
  const items = data?.items ?? NO_ITEMS;

  const searchedRef = useRef<string | null>(appliedBbox);
  const searchAfterMove = useEffectEvent((bbox: string) => {
    if (bbox === appliedBbox) return;
    searchedRef.current = bbox;
    applyArea(bbox, { push: false });
  });

  useEffect(() => {
    if (!map) return;
    let timer = 0;
    const onMoveEnd = (event: { programmatic?: boolean }) => {
      const next = readCamera(map);
      setCamera((current) =>
        current?.bbox === next.bbox && current.zoom === next.zoom
          ? current
          : next,
      );
      const center = map.getCenter();
      view.set({
        destination,
        area: appliedBbox,
        zoom: map.getZoom(),
        center: [center.lng, center.lat],
      });
      if (event.programmatic) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(
        () => searchAfterMove(next.bbox),
        MAP_MOVE_DEBOUNCE_MS,
      );
    };
    onMoveEnd({ programmatic: true });
    map.on("moveend", onMoveEnd);
    return () => {
      window.clearTimeout(timer);
      map.off("moveend", onMoveEnd);
    };
  }, [map, view, destination, appliedBbox]);

  useEffect(() => {
    if (!appliedBbox) searchedRef.current = null;
    if (!map || !appliedBbox || appliedBbox === searchedRef.current) return;
    searchedRef.current = appliedBbox;
    const box = parseBbox(appliedBbox);
    if (box) fitTo(map, asMapBounds(box), { padding: 0 });
  }, [map, appliedBbox]);

  const fitPadding = {
    top: FIT_PADDING_PX,
    left: FIT_PADDING_PX,
    right: FIT_PADDING_PX,
    bottom: FIT_PADDING_PX + bottomInset,
  };
  const currentFitPadding = useEffectEvent(() => fitPadding);

  const reframed = useRef(false);
  useEffect(() => {
    if (!map || reframed.current || !initial.bounds || bottomInset === 0)
      return;
    reframed.current = true;
    fitTo(map, initial.bounds, {
      animate: false,
      maxZoom: FIT_MAX_ZOOM,
      padding: currentFitPadding(),
    });
  }, [map, bottomInset, initial.bounds]);

  const fittedFor = useRef<string | null>(
    initial.needsFit ? null : destination,
  );
  useEffect(() => {
    if (!map || !isListSettled || appliedBbox) return;
    if (fittedFor.current === destination) return;
    fittedFor.current = destination;
    const box = boundsOfPoints(publicPoints(properties));
    if (box)
      fitTo(map, asMapBounds(box), {
        padding: currentFitPadding(),
        maxZoom: FIT_MAX_ZOOM,
      });
  }, [map, isListSettled, appliedBbox, destination, properties]);

  const currency = t("listing.mapCurrencyShort");
  const noPrice = t("listing.mapPinNoPrice");
  const describe = useCallback(
    (item: MapItem): MarkerDescription => {
      if (item.type === "cluster") {
        const label = formatListingPriceFor(item.count, locale);
        const text = t(
          isPointLikeBbox(item.bounds)
            ? "listing.mapStackTitle"
            : "listing.mapCluster",
          { formatted: label },
        );
        return {
          label,
          hearts: null,
          title: text,
          ariaLabel: text,
          approximate: false,
        };
      }
      const approximate = item.location.precision === "approximate";
      const hasPrice = item.price !== null && item.price > 0;
      const base = hasPrice
        ? t("listing.mapPinPrice", {
            price: formatListingPriceFor(item.price, locale),
          })
        : noPrice;
      const favorites = item.favorite_count ?? 0;
      const hearts =
        favorites > 0 ? formatListingPriceFor(favorites, locale) : null;
      const parts = [base];
      if (hearts)
        parts.push(t("listing.mapPinFavorites", { formatted: hearts }));
      if (approximate) parts.push(t("listing.mapApproximate"));
      const text = parts.join(separator);
      return {
        hearts,
        title: text,
        ariaLabel: text,
        approximate,
        label: pinPriceLabel(item.price, locale, {
          currency,
          fallback: noPrice,
        }),
      };
    },
    [currency, locale, noPrice, separator, t],
  );

  const onProperty = (item: MapPropertyItem) => {
    setStack(null);
    setSelectedId(item.id);
  };

  const onCluster = (item: MapClusterItem) => {
    if (!map) return;
    const stuck =
      isPointLikeBbox(item.bounds) ||
      map.getZoom() >= CLUSTER_MAX_FIT_ZOOM - 0.5;
    setSelectedId(null);
    setStack(stuck ? item : null);
    if (!stuck)
      fitTo(map, asMapBounds(item.bounds), {
        padding: fitPadding,
        maxZoom: CLUSTER_MAX_FIT_ZOOM,
      });
  };

  useMapMarkers({
    map,
    items,
    describe,
    hoveredId,
    onCluster,
    selectedId,
    onProperty,
  });

  const showStackInList = () => {
    if (!stack) return;
    searchedRef.current = null;
    applyArea(formatBbox(padBbox(stack.bounds, STACK_AREA_PAD_DEGREES)), {
      push: true,
    });
    setStack(null);
    // On a phone the list is a sheet over the map: open it to show them.
    if (variant === "background") onClose();
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const hasBottomCard = selectedId !== null || stack !== null;
  useEffect(() => {
    if (variant === "column" && hasBottomCard)
      rootRef.current?.scrollIntoView({ block: "nearest" });
  }, [variant, hasBottomCard]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || (selectedId === null && !stack)) return;
    event.stopPropagation();
    setSelectedId(null);
    setStack(null);
  };

  const retry = () => {
    setFailed(false);
    setMap(null);
    setCamera(null);
    setAttempt((count) => count + 1);
  };

  if (isSupported === false)
    return (
      <DiscoveryMapProblem
        onBack={onClose}
        title={t("listing.mapUnsupported")}
      />
    );
  if (failed)
    return (
      <DiscoveryMapProblem
        onRetry={retry}
        onBack={onClose}
        title={t("listing.mapLoadError")}
        hint={t("listing.mapLoadErrorHint")}
      />
    );

  const isBusy = isSettling || isFetching;
  const total = data?.meta.total;
  const statusText = isBusy
    ? t("listing.mapUpdating")
    : typeof total === "number"
      ? t("listing.mapAreaCount", {
          formatted: formatListingPriceFor(total, locale),
        })
      : "";
  const stackCount = stack ? formatListingPriceFor(stack.count, locale) : "";
  const footStyle = { bottom: bottomInset + FOOT_GAP_PX };

  return (
    <div
      ref={rootRef}
      aria-busy={isBusy}
      onKeyDown={onKeyDown}
      style={{ "--map-foot": `${bottomInset}px` } as CSSProperties}
      className="discovery-map relative size-full overflow-hidden bg-surface-muted"
    >
      <NeshanMap
        key={attempt}
        onMapReady={setMap}
        zoom={initial.zoom}
        className="size-full"
        center={initial.center}
        bounds={initial.bounds}
        mapStyle="monochrome_light"
        onError={() => setFailed(true)}
        ariaLabel={t("listing.mapResultsAria")}
      />

      <div className="pointer-events-none absolute top-3 z-10 flex flex-wrap items-center gap-2 ltr:start-3 ltr:end-14 rtl:end-3 rtl:start-14">
        {variant === "column" ? (
          <button
            type="button"
            onClick={onClose}
            title={t("listing.mapHide")}
            aria-label={t("listing.mapHide")}
            className={`${PILL_CLASS} !px-3`}
          >
            <Icon name="x" size={20} />
          </button>
        ) : null}
        {statusText ? (
          <p role="status" className={PILL_CLASS}>
            {statusText}
          </p>
        ) : null}
      </div>

      {stack ? (
        <div className={CARD_SLOT_CLASS} style={footStyle}>
          <div
            role="group"
            aria-label={t("listing.mapStackTitle", { formatted: stackCount })}
            className="flex w-full max-w-sm flex-col gap-3 rounded-20 bg-surface p-4 shadow-elevated"
          >
            <p className="text-sm font-bold text-ink">
              {t("listing.mapStackTitle", { formatted: stackCount })}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={showStackInList}
                className="flex h-11 cursor-pointer items-center justify-center rounded-full bg-action px-5 text-sm font-medium text-on-action transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
              >
                {t("listing.mapStackAction")}
              </button>
              <button
                type="button"
                onClick={() => setStack(null)}
                className="flex h-11 cursor-pointer items-center justify-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
              >
                {t("listing.mapPreviewClose")}
              </button>
            </div>
          </div>
        </div>
      ) : selectedId !== null ? (
        <div className={CARD_SLOT_CLASS} style={footStyle}>
          <DiscoveryMapPreview
            id={selectedId}
            properties={properties}
            onClose={() => setSelectedId(null)}
            searchParams={{
              checkin: query.checkin,
              checkout: query.checkout,
              total_guests: query.total_guests,
            }}
          />
        </div>
      ) : isError && !data ? (
        <div
          style={footStyle}
          className="pointer-events-none absolute z-10 ltr:start-3 rtl:end-3"
        >
          <div
            role="alert"
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-status-danger-bg px-4 py-2 text-xs text-status-danger shadow-elevated"
          >
            <span>{t("listing.mapLoadError")}</span>
            <button
              type="button"
              onClick={() => void refetchPins()}
              className="cursor-pointer font-bold underline underline-offset-4"
            >
              {t("common.tryAgain")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DiscoveryMap;
