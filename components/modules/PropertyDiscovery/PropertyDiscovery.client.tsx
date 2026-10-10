"use client";

import { usePropertyDiscoveryFilters } from "@features/properties/hooks/usePropertyDiscoveryFilters";
import { usePropertyOptionGroups } from "@features/properties/hooks/usePropertyOptionGroups";
import { CityModal, RegionModal } from "@modules/CitySelector";
import { useUrlCityWithRegions } from "@features/cities/hooks/useUrlCityWithRegions";
import { SpecialFilterButtons } from "@modules/PropertySearchFilters";
import { PropertyFilterForm } from "@modules/PropertySearchFilters";
import { SelectedFiltersBar } from "@modules/PropertySearchFilters";
import { PropertySortMenu } from "@modules/PropertySearchFilters";
import { useTranslations } from "next-intl";
import { FilterApplyBar } from "@modules/PropertySearchFilters";
import { useStoreParams } from "@/store";
import { useState } from "react";

import type { PropertyDiscoveryProps } from "@/types/components/modules/property-discovery";
import type { ChildCities } from "@/types/components/modules/property-discovery";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import PropertyCategoryStrip from "./parts/PropertyCategoryStrip.client";
import DiscoveryFilterModal from "./parts/DiscoveryFilterModal.client";
import DiscoveryResults from "./parts/DiscoveryResults.client";

const SIDEBAR_HEIGHT = "calc(100dvh - 90px)";

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
    filters,
    queries,
    resetDraft,
    setFilters,
  } = usePropertyDiscoveryFilters();
  const { data: propertyTypes } = usePropertyOptionGroups();
  const urlCityWithRegions = useUrlCityWithRegions(queries);
  const cityWithRegions = modalCityWithRegions ?? urlCityWithRegions;
  const { topHeaderVisible } = useStoreParams((state: any) => state);

  const onApplyFilters = () => {
    applyFilters();
    setFilterModalShow(false);
  };

  const onCloseFilterModal = () => {
    resetDraft();
    setFilterModalShow(false);
  };

  return (
    <div className="app-container !px-0 md:!px-10 2xl:px-[9%] !pt-[7.5rem] xl:!pt-20 z-2 flex flex-col !gap-2">
      <div className="grid grid-cols-12 col-span-12">
        <aside
          aria-label={t("listing.filters")}
          style={{ height: SIDEBAR_HEIGHT }}
          className="surface-panel col-span-3 hidden flex-col justify-between overflow-hidden lg:sticky lg:top-20 lg:flex"
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
          <div className="hidden z-1 w-full xl:flex flex-col xl:flex-row items-center justify-between mb-2">
            <SingleProductBreadCrumb dataArray={BREAD_CRUMBS} />
            <h1 className="sr-only">{t("listing.roomsPageTitle")}</h1>
            <div className="w-full items-center justify-end hidden lg:flex">
              <SpecialFilterButtons query={queries} />
              <PropertySortMenu query={queries} />
            </div>
          </div>

          <div
            className={`flex fixed pt-1 xl:hidden h-16 start-0 duration-1000 transition-all items-center justify-center z-10 xl:z-1 top-[3rem] xl:top-auto end-0 xl:end-auto bg-surface xl:bg-transparent xl:relative flex-col w-full xl:gap-2 ${
              topHeaderVisible ? "" : "shadow-lg lg:shadow-none"
            }`}
          >
            <div className="flex order-1 xl:hidden relative w-full">
              <div className="z-1 px-3 relative w-full items-center gap-1 justify-between">
                <div className="!col-span-9">
                  <SelectedFiltersBar
                    query={queries}
                    setShowRegions={setShowRegions}
                    cityWithRegions={cityWithRegions}
                    propertyTypes={propertyTypes || {}}
                    setFilterModalShow={setFilterModalShow}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex px-3 xl:hidden">
            <PropertyCategoryStrip
              query={queries}
              propertyKey="property_type"
              data={propertyTypes?.PROPERTY_TYPE}
            />
          </div>

          <div className="w-full grow-0 shrink-0 flex flex-row px-3 xl:px-0 relative justify-between">
            <div className="flex flex-row w-fit md:w-[90%] gap-1 lg:w-full items-center justify-start">
              <div className="flex lg:hidden">
                <SpecialFilterButtons query={queries} />
              </div>
              <SelectedFiltersBar
                query={queries}
                setShowRegions={setShowRegions}
                cityWithRegions={cityWithRegions}
                propertyTypes={propertyTypes || {}}
                setFilterModalShow={setFilterModalShow}
                containerClass="!hidden xl:!contents xl:!w-full"
              />
            </div>
            <div className="w-fit md:w-1/3 items-center justify-end flex lg:hidden">
              <PropertySortMenu query={queries} />
            </div>
          </div>

          <DiscoveryResults
            query={queries}
            devices={devices}
            onClearFilters={clearExtraFilters}
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
