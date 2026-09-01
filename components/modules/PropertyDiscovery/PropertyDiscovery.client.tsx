"use client";

import { usePropertyDiscoveryFilters } from "@features/properties/hooks/usePropertyDiscoveryFilters";
import { usePropertyOptionGroups } from "@features/properties/hooks/usePropertyOptionGroups";
import type { PropertyDiscoveryProps } from "@/types/components/modules/property-discovery";
import type { ChildCities } from "@/types/components/modules/property-discovery";
import { SpecialFilterButtons } from "@modules/PropertySearchFilters";
import { PropertyFilterForm } from "@modules/PropertySearchFilters";
import { SelectedFiltersBar } from "@modules/PropertySearchFilters";
import { PropertySortMenu } from "@modules/PropertySearchFilters";
import { CityModal, RegionModal } from "@modules/CitySelector";
import { CitySelectorTitle } from "@modules/CitySelector";
import { useStoreParams } from "@/store";
import { useState } from "react";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import PropertyCategoryStrip from "./parts/PropertyCategoryStrip.client";
import DiscoveryFilterModal from "./parts/DiscoveryFilterModal.client";
import DiscoveryResults from "./parts/DiscoveryResults.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const BREAD_CRUMBS = [
  { title: _STRINGS.HOME, link: "/" },
  { title: _STRINGS.ADDS, link: "/rooms" },
];
const SIDEBAR_HEIGHT = "calc(100dvh - 90px)";

const PropertyDiscovery = ({ devices }: PropertyDiscoveryProps) => {
  const [cityWithRegions, setCityWithRegions] = useState<ChildCities | null>(
    null,
  );
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
        <div
          style={{ height: SIDEBAR_HEIGHT }}
          className="hidden justify-between overflow-y-hidden gap-4 lg:sticky lg:top-20 lg:flex flex-col items-center rounded-10 border col-span-3"
        >
          <div className="w-full flex flex-col gap-4 overflow-y-scroll">
            <PropertyFilterForm
              filters={filters}
              queries={queries}
              setFilters={setFilters}
              propertyTypes={propertyTypes}
            />
          </div>
          <Button
            width="w-full"
            onClick={onApplyFilters}
            title={_STRINGS?.DO_THE_FILTERING}
            containerClass="w-full flex items-center flex-col px-2 pb-2 pt-0"
          />
        </div>

        <div className="col-span-12 md:col-span-12 lg:col-span-9 px-0 xl:pr-4 xl:pl-0 xl:mt-0">
          <div className="hidden z-1 w-full xl:flex flex-col xl:flex-row items-center justify-between mb-2">
            <SingleProductBreadCrumb dataArray={BREAD_CRUMBS} />
            <div className="w-full items-center justify-end hidden lg:flex">
              <SpecialFilterButtons query={queries} />
              <PropertySortMenu query={queries} />
            </div>
          </div>

          <div
            className={`flex fixed pt-1 xl:hidden h-16 right-0 duration-1000 transition-all items-center justify-center z-10 xl:z-1 top-[3rem] xl:top-auto left-0 xl:left-auto bg-white xl:bg-transparent xl:relative flex-col w-full xl:gap-2 ${
              topHeaderVisible ? "" : "shadow-lg lg:shadow-none"
            }`}
          >
            <div className="flex order-1 xl:hidden relative w-full">
              <div className="z-1 px-2 relative w-full items-center gap-1 justify-between">
                <div className="!col-span-9">
                  <SelectedFiltersBar
                    query={queries}
                    cityWithRegions={cityWithRegions}
                    setShowRegions={setShowRegions}
                    propertyTypes={propertyTypes || {}}
                    setFilterModalShow={setFilterModalShow}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex xl:hidden">
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
              <CitySelectorTitle
                hideCityPart
                queries={queries}
                title={cityTitle}
                setShowRegions={setShowRegions}
                cityWithRegions={cityWithRegions}
                cb={() => setShowCityModal(true)}
              />
              <SelectedFiltersBar
                query={queries}
                cityWithRegions={cityWithRegions}
                setShowRegions={setShowRegions}
                propertyTypes={propertyTypes || {}}
                setFilterModalShow={setFilterModalShow}
                containerClass="!hidden xl:!contents xl:!w-full"
              />
            </div>
            <div className="w-fit md:w-1/3 items-center justify-end flex lg:hidden">
              <PropertySortMenu query={queries} />
            </div>
          </div>

          <DiscoveryResults devices={devices} query={queries} />
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
        onShowCityModal={() => setShowCityModal(true)}
        show={filterModalShow && !showCityModal}
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
