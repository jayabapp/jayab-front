"use client";

import { usePropertyDiscoveryFilters } from "@features/properties/hooks/usePropertyDiscoveryFilters";
import { usePropertyOptionGroups } from "@features/properties/hooks/usePropertyOptionGroups";
import type { LandingDiscoveryProps } from "@/types/components/modules/property-discovery";
import type { ChildCities } from "@/types/components/modules/property-discovery";
import { landingQueryDefaults } from "@features/properties/lib/landing-filters";
import { SpecialFilterButtons } from "@modules/PropertySearchFilters";
import { PropertyFilterForm } from "@modules/PropertySearchFilters";
import { SelectedFiltersBar } from "@modules/PropertySearchFilters";
import { PropertySortMenu } from "@modules/PropertySearchFilters";
import { CityModal, RegionModal } from "@modules/CitySelector";
import { CitySelectorTitle } from "@modules/CitySelector";
import { useEffect, useMemo, useState } from "react";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import DiscoveryFilterModal from "./parts/DiscoveryFilterModal.client";
import DiscoveryResults from "./parts/DiscoveryResults.client";
import LandingContent from "./parts/LandingContent";
import _STRINGS from "@/utils/LocalStrings";
import throttle from "lodash/throttle";
import Button from "@elements/Button";

const SIDEBAR_HEIGHT = "calc(100dvh - 90px)";
const SHADOW_SCROLL_THRESHOLD = 20;
const SCROLL_THROTTLE_MS = 100;

const LandingDiscovery = ({ devices, landing }: LandingDiscoveryProps) => {
  const [cityWithRegions, setCityWithRegions] = useState<ChildCities | null>(
    null,
  );
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [cityTitle, setCityTitle] = useState("");
  const [showShadow, setShowShadow] = useState(false);

  const defaults = useMemo(() => landingQueryDefaults(landing), [landing]);
  const { applyFilters, filters, queries, resetDraft, setFilters } =
    usePropertyDiscoveryFilters({ defaults });
  const { data: propertyTypes } = usePropertyOptionGroups();

  const breadCrumbs = useMemo(
    () => [
      { title: _STRINGS.HOME, link: "/" },
      { title: landing?.content?.title || _STRINGS.ADDS, link: "" },
    ],
    [landing?.content?.title],
  );

  const handleScroll = useMemo(
    () =>
      throttle(
        () => setShowShadow(window.scrollY > SHADOW_SCROLL_THRESHOLD),
        SCROLL_THROTTLE_MS,
      ),
    [],
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  const onApplyFilters = () => {
    applyFilters();
    setFilterModalShow(false);
  };

  const onCloseFilterModal = () => {
    resetDraft();
    setFilterModalShow(false);
  };

  return (
    <>
      <div
        className={`flex fixed ${
          showShadow ? "shadow-md" : ""
        } md:shadow-none pt-1 transition-all duration-300 xl:hidden h-16 right-0 items-center justify-center z-10 xl:z-1 top-[3rem] xl:top-auto left-0 xl:left-auto bg-white xl:bg-transparent xl:relative flex-col w-full xl:gap-2`}
      >
        <div className="flex order-1 xl:hidden relative w-full">
          <div className="z-1 pr-2 relative w-full items-center gap-1 justify-between">
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

      <div className="app-container !pt-[7.5rem] lg:!pt-20 !relative z-2">
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

          <div className="col-span-12 md:col-span-12 lg:col-span-9 px-0 md:pr-4 md:pl-0 md:mt-0">
            <div className="hidden mb-2 z-1 w-full xl:flex flex-col xl:flex-row items-center justify-between">
              <SingleProductBreadCrumb dataArray={breadCrumbs} />
            </div>

            <div className="mb-3 w-full flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">
                {landing?.content?.title}
              </h2>
              <div className="w-fit items-center justify-end hidden lg:flex">
                <SpecialFilterButtons query={queries} />
                <PropertySortMenu query={queries} />
              </div>
            </div>

            <div className="w-full grow-0 shrink-0 flex flex-row px-1 xl:px-0 relative justify-between">
              <div className="flex flex-row items-center justify-start gap-1">
                <div className="flex lg:hidden">
                  <SpecialFilterButtons
                    query={queries}
                    containerClass="!w-full lg:!w-fit"
                  />
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
                  setShowRegions={setShowRegions}
                  cityWithRegions={cityWithRegions}
                  containerClass="!hidden xl:!contents"
                  propertyTypes={propertyTypes || {}}
                  setFilterModalShow={setFilterModalShow}
                />
              </div>
              <div className="w-fit flex lg:hidden">
                <PropertySortMenu query={queries} />
              </div>
            </div>

            <div className="min-h-[80dvh] mb-12 xl:mb-20">
              <DiscoveryResults devices={devices} query={queries} />
            </div>

            <LandingContent data={landing} />
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
          onShowCityModal={() => setShowCityModal(true)}
          show={filterModalShow && !showCityModal}
        />

        <CityModal
          show={showCityModal}
          customeValues={filters}
          setTitle={setCityTitle}
          setRegionsCb={setCityWithRegions}
          onHide={() => setShowCityModal(false)}
          onSubmitCustomeCB={filterModalShow ? setFilters : undefined}
        />
        <RegionModal
          show={showRegions}
          cityWithRegions={cityWithRegions}
          onHide={() => setShowRegions(false)}
        />
      </div>
    </>
  );
};

export default LandingDiscovery;
