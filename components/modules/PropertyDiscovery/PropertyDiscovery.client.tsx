"use client";

import { usePropertyDiscoveryFilters } from "@features/properties/hooks/usePropertyDiscoveryFilters";
import { useEffect, useRef, useState } from "react";
import { usePropertyOptionGroups } from "@features/properties/hooks/usePropertyOptionGroups";
import { CityModal, RegionModal } from "@modules/CitySelector";
import { useUrlCityWithRegions } from "@features/cities/hooks/useUrlCityWithRegions";
import { SpecialFilterButtons } from "@modules/PropertySearchFilters";
import { PropertyFilterForm } from "@modules/PropertySearchFilters";
import { SelectedFiltersBar } from "@modules/PropertySearchFilters";
import { PropertySortMenu } from "@modules/PropertySearchFilters";
import { useTranslations } from "next-intl";
import { FilterApplyBar } from "@modules/PropertySearchFilters";

import type { PropertyDiscoveryProps } from "@/types/components/modules/property-discovery";
import type { ChildCities } from "@/types/components/modules/property-discovery";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import PropertyCategoryStrip from "./parts/PropertyCategoryStrip.client";
import DiscoveryFilterModal from "./parts/DiscoveryFilterModal.client";
import DiscoveryResults from "./parts/DiscoveryResults.client";

const PropertyDiscovery = ({ devices }: PropertyDiscoveryProps) => {
  const t = useTranslations();

  const BREAD_CRUMBS = [
    { title: t("common.home"), link: "/" },
    { title: t("header.listings"), link: "/rooms" },
  ];
  const [modalCityWithRegions, setCityWithRegions] =
    useState<ChildCities | null>(null);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [cityTitle, setCityTitle] = useState("");

  const {
    applyFilters,
    clearExtraFilters,
    hasExtraFilters,
    filters,
    queries,
    resetDraft,
    setFilters,
  } = usePropertyDiscoveryFilters();
  const { data: propertyTypes } = usePropertyOptionGroups();
  const urlCityWithRegions = useUrlCityWithRegions(queries);
  const cityWithRegions = modalCityWithRegions ?? urlCityWithRegions;

  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const stuckAt = parseFloat(getComputedStyle(bar).top) || 0;
      bar.dataset.stuck = String(
        bar.getBoundingClientRect().top <= stuckAt + 0.5,
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

  const onApplyFilters = () => {
    applyFilters();
    setFilterModalShow(false);
  };

  const onCloseFilterModal = () => {
    resetDraft();
    setFilterModalShow(false);
  };

  return (
    <div className="app-container !px-0 md:!px-10 2xl:px-[9%] !pt-14 xl:!pt-20 z-2 flex flex-col !gap-2">
      <div className="hidden w-full items-center xl:flex">
        <SingleProductBreadCrumb dataArray={BREAD_CRUMBS} />
        <h1 className="sr-only">{t("listing.roomsPageTitle")}</h1>
      </div>

      <div
        ref={barRef}
        className="discovery-filter-bar sticky z-10 w-full py-2 xl:rounded-b-20"
      >
        <SelectedFiltersBar
          query={queries}
          setShowRegions={setShowRegions}
          cityWithRegions={cityWithRegions}
          propertyTypes={propertyTypes || {}}
          setFilterModalShow={setFilterModalShow}
        />
      </div>

      <div className="grid grid-cols-12 col-span-12">
        <aside
          aria-label={t("listing.filters")}
          className="discovery-sidebar surface-panel col-span-3 hidden flex-col justify-between overflow-hidden lg:sticky lg:flex"
        >
          <div className="w-full grow overflow-y-auto">
            <PropertyFilterForm
              filters={filters}
              queries={queries}
              setFilters={setFilters}
              onReset={clearExtraFilters}
              propertyTypes={propertyTypes}
            />
          </div>
          <FilterApplyBar draft={filters} onApply={onApplyFilters} />
        </aside>

        <div className="col-span-12 md:col-span-12 lg:col-span-9 px-0 xl:ps-4 xl:pe-0 xl:mt-0">
          <div className="flex w-full px-3 pt-2 xl:hidden">
            <PropertyCategoryStrip
              query={queries}
              propertyKey="property_type"
              data={propertyTypes?.PROPERTY_TYPE}
            />
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 px-3 py-2 xl:px-0">
            <PropertySortMenu query={queries} />
            <SpecialFilterButtons query={queries} />
          </div>

          <DiscoveryResults
            query={queries}
            devices={devices}
            onClearFilters={hasExtraFilters ? clearExtraFilters : undefined}
          />
        </div>
      </div>

      <DiscoveryFilterModal
        filters={filters}
        queries={queries}
        cityTitle={cityTitle}
        setFilters={setFilters}
        onApply={onApplyFilters}
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

export default PropertyDiscovery;
