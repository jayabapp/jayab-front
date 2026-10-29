"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePropertyDiscoveryFilters } from "@features/properties/hooks/usePropertyDiscoveryFilters";
import { DISCOVERY_MAP_COLUMN_QUERY } from "@features/map/constants/discovery-map";
import { usePropertyOptionGroups } from "@features/properties/hooks/usePropertyOptionGroups";
import { CityModal, RegionModal } from "@modules/CitySelector";
import { useUrlCityWithRegions } from "@features/cities/hooks/useUrlCityWithRegions";
import { SpecialFilterButtons } from "@modules/PropertySearchFilters";
import { SelectedFiltersBar } from "@modules/PropertySearchFilters";
import { isSameLocationPath } from "@features/cities/lib/location-label";
import { pickLocationQuery } from "@features/cities/lib/location-label";
import { hasLocationQuery } from "@features/cities/lib/location-label";
import { PropertySortMenu } from "@modules/PropertySearchFilters";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { useTranslations } from "next-intl";
import { useCitiesStore } from "@/store";
import { hasUsableBbox } from "@features/properties/lib/bbox";
import { useMediaQuery } from "@features/map/hooks/useMediaQuery";
import { useMapSupport } from "@features/map/hooks/useMapSupport";
import { usePathname } from "next/navigation";

import type { DiscoveryExperienceProps } from "@/types/components/modules/property-discovery";
import type { ChildCities } from "@/types/components/modules/property-discovery";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import DiscoveryFilterModal from "./DiscoveryFilterModal.client";
import DiscoveryMobileMap from "./map/DiscoveryMobileMap.client";
import DiscoveryMapHost from "./map/DiscoveryMapHost.client";
import DiscoveryHeading from "./DiscoveryHeading.client";
import DiscoveryResults from "./DiscoveryResults.client";
import MapToggleButton from "./map/MapToggleButton.client";
import isEmpty from "lodash/isEmpty";

const HEADER_SELECTOR = ".header-content-container";
const STICK_TOLERANCE_PX = 0.5;

const DiscoveryLayout = ({
  mode,
  title,
  devices,
  content,
}: Omit<DiscoveryExperienceProps, "baselineFilters">) => {
  const t = useTranslations();
  const pathname = usePathname();

  const [modalCityWithRegions, setCityWithRegions] =
    useState<ChildCities | null>(null);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [cityTitle, setCityTitle] = useState("");

  const {
    filters,
    queries,
    baseline,
    resetDraft,
    setFilters,
    applyFilters,
    hasExtraFilters,
    clearExtraFilters,
  } = usePropertyDiscoveryFilters();
  const { isEnabled: hasMap, isColumnOpen } = useDiscoveryMap();
  const { data: propertyTypes } = usePropertyOptionGroups();
  const urlCityWithRegions = useUrlCityWithRegions(queries);
  const cityWithRegions = modalCityWithRegions ?? urlCityWithRegions;
  const hasBaseline = !isEmpty(baseline);
  const isWide = useMediaQuery(DISCOVERY_MAP_COLUMN_QUERY);
  const canDrawMap = useMapSupport() === true;
  const hasArea = hasUsableBbox(queries);
  // Phones and tablets that can draw the map get it behind a results sheet. Without
  // WebGL the page stays a plain list.
  const isMobileMap = hasMap && hasArea && !isWide && canDrawMap;

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
    const bar = barRef.current;
    if (!root || !header) return;
    const sync = () => {
      const top = header.getBoundingClientRect().height;
      root.style.setProperty("--discovery-top", `${top}px`);
      root.style.setProperty(
        "--discovery-stack",
        `${top + (bar?.getBoundingClientRect().height ?? 0)}px`,
      );
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    if (bar) observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const stuckAt = parseFloat(getComputedStyle(bar).top) || 0;
      bar.dataset.stuck = String(
        bar.getBoundingClientRect().top <= stuckAt + STICK_TOLERANCE_PX,
      );
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const location = pickLocationQuery({
      cities: baseline.cities,
      provinces: baseline.provinces ?? baseline.province_id,
    });
    if (!hasLocationQuery(location)) return;
    useCitiesStore.setState((state) => {
      const isSamePage = isSameLocationPath(
        state.locationsData?.path,
        pathname,
      );
      if (isSamePage && state.locationsData?.query) return state;
      return {
        locationsData: {
          ...(isSamePage ? state.locationsData : {}),
          path: pathname,
          query: location,
        },
      };
    });
  }, [baseline.cities, baseline.province_id, baseline.provinces, pathname]);

  const breadCrumbs = useMemo(
    () => [
      { title: t("common.home"), link: "/" },
      mode === "landing"
        ? { title, link: "" }
        : { title: t("header.listings"), link: "/rooms" },
    ],
    [mode, t, title],
  );

  const onApplyFilters = () => {
    applyFilters();
    setFilterModalShow(false);
  };

  const onCloseFilterModal = () => {
    resetDraft();
    setFilterModalShow(false);
  };

  const quickRow = (
    <div className="discovery-quick-row flex w-full items-center gap-2 px-3 py-2 md:gap-3 xl:px-0">
      <div className="-my-1 min-w-0 flex-1 overflow-x-auto py-1">
        <SpecialFilterButtons query={queries} />
      </div>
      {hasArea ? <MapToggleButton /> : null}
      <PropertySortMenu query={queries} />
    </div>
  );

  const results = (
    <DiscoveryResults
      query={queries}
      devices={devices}
      onClearFilters={hasExtraFilters ? clearExtraFilters : undefined}
      clearLabel={
        hasBaseline
          ? t("listing.removeExtraFilters")
          : t("listing.clearAllFilters")
      }
    />
  );

  const landingContent = content ? (
    <div className="px-3 xl:px-0">{content}</div>
  ) : null;

  return (
    <div
      ref={rootRef}
      className="app-container discovery-page !px-0 md:!px-10 2xl:!px-[9%] z-2 flex flex-col !gap-2"
    >
      <div className="hidden w-full items-center xl:flex">
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>

      {isMobileMap ? null : <DiscoveryHeading title={title} query={queries} />}

      <div
        ref={barRef}
        className="discovery-filter-bar sticky z-10 w-full px-3 py-2 xl:rounded-b-20 xl:px-0"
      >
        <SelectedFiltersBar
          query={queries}
          setShowRegions={setShowRegions}
          cityWithRegions={cityWithRegions}
          propertyTypes={propertyTypes || {}}
          setFilterModalShow={setFilterModalShow}
        />
      </div>

      {isMobileMap ? (
        <DiscoveryMobileMap
          query={queries}
          header={<DiscoveryHeading compact title={title} query={queries} />}
        >
          {quickRow}
          {results}
          {landingContent}
        </DiscoveryMobileMap>
      ) : (
        <>
          {quickRow}
          <div
            className="discovery-split w-full"
            data-map={hasMap && isColumnOpen && hasArea ? "open" : "closed"}
          >
            <div className="min-w-0">{results}</div>
            {hasMap && hasArea ? <DiscoveryMapHost query={queries} /> : null}
          </div>
          {landingContent}
        </>
      )}

      <DiscoveryFilterModal
        filters={filters}
        queries={queries}
        cityTitle={cityTitle}
        setFilters={setFilters}
        onApply={onApplyFilters}
        baselineFilters={baseline}
        onClose={onCloseFilterModal}
        propertyTypes={propertyTypes}
        setShowRegions={setShowRegions}
        cityWithRegions={cityWithRegions}
        onClearExtraFilters={clearExtraFilters}
        show={filterModalShow && !showCityModal}
        onShowCityModal={() => setShowCityModal(true)}
      />

      <CityModal
        show={showCityModal}
        setTitle={setCityTitle}
        setRegionsCb={setCityWithRegions}
        onHide={() => setShowCityModal(false)}
        customeValues={filterModalShow ? filters : undefined}
        onSubmitCustomeCB={filterModalShow ? setFilters : undefined}
      />
      <RegionModal
        show={showRegions}
        cityWithRegions={cityWithRegions}
        onHide={() => setShowRegions(false)}
      />
    </div>
  );
};

export default DiscoveryLayout;
