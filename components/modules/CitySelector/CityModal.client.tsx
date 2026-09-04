"use client";

import type { CityModalProps } from "@/types/components/modules/city-selector";
import { useCitySelection } from "@features/cities/hooks/useCitySelection";
import { matchesCitySearch } from "@features/cities/lib/city-selection";
import { hasMatchingChild } from "@features/cities/lib/city-selection";
import { useEffect } from "react";

import CityModalAllCitiesButton from "./parts/CityModalAllCitiesButton";
import SelectedCitiesSwiper from "./parts/SelectedCitiesSwiper";
import CityModalHeader from "./parts/CityModalHeader";
import CityRowSkeleton from "./parts/CityRowSkeleton";
import CitySearchInput from "./parts/CitySearchInput";
import ProvinceCard from "./parts/ProvinceCard";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import CityCard from "./parts/CityCard";
import Button from "@elements/Button";
import isEmpty from "lodash/isEmpty";
import Modal from "@elements/Modal";

const CityModal = ({
  item,
  show,
  onHide,
  isHome,
  setTitle,
  passedUrl,
  setRegionsCb,
  customeValues,
  onSubmitCustomeCB,
  onSubmitExtendedCB,
}: CityModalProps) => {
  const {
    cities,
    clearSelected,
    isLoading,
    provinces,
    regionCity,
    removeProvince,
    search,
    selectedCities,
    selectedProvince,
    setSearch,
    setSelectedCities,
    setSelectedProvince,
    submit,
    title,
    toggleCity,
    visibleProvinces,
  } = useCitySelection({
    enabled: show,
    customValues: customeValues,
    navigateUrl: passedUrl,
    skipEmptyNavigation: isHome,
    onSubmitCustomValues: onSubmitCustomeCB,
  });

  useEffect(() => {
    setTitle?.(title);
  }, [setTitle, title]);

  useEffect(() => {
    setRegionsCb?.(regionCity);
  }, [setRegionsCb, regionCity]);

  const backToProvinces = () => {
    setSelectedProvince(null);
    setSearch("");
  };

  const onSubmitClick = () => {
    void submit();
    onSubmitExtendedCB?.();
    onHide();
  };

  const submitTitle =
    item?.submitTitle ||
    (onSubmitCustomeCB ? _STRINGS.SUBMIT : _STRINGS.SEARCH);

  return (
    <Modal
      show={!!show}
      onHide={onHide}
      zIndex={40000000}
      options={{
        containerClass:
          "mx-auto my-0 md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-0 md:rounded-2xl overflow-y-scroll bg-white relative min-h-[100dvh] min:min-h-[80dvh]",
      }}
    >
      <CityModalHeader
        onHide={onHide}
        onBack={backToProvinces}
        selectedProvince={selectedProvince}
      />

      <div className="w-full flex flex-col gap-4 mt-4 p-3 h-auto min-h-full">
        <CitySearchInput value={search} onChange={setSearch} />

        <SelectedCitiesSwiper
          provinces={provinces}
          onCityClick={toggleCity}
          clearSelected={clearSelected}
          selectedCities={selectedCities}
          onProvCancelClick={removeProvince}
        />

        <p>
          {selectedProvince
            ? `${_STRINGS.CITY_LISTS} ${selectedProvince?.title}`
            : _STRINGS.PROV_LISTS}
        </p>

        {selectedProvince ? (
          <CityModalAllCitiesButton
            cities={cities}
            onToggleAll={setSelectedCities}
            selectedCities={selectedCities}
          />
        ) : null}

        {isLoading ? (
          <CityRowSkeleton />
        ) : !selectedProvince ? (
          isEmpty(visibleProvinces) ? (
            <EmptyState />
          ) : (
            visibleProvinces.map((province) => (
              <ProvinceCard
                item={province}
                key={`province-${province?.id}`}
                callback={() => {
                  setSelectedProvince(province);
                  if (!hasMatchingChild(province, search)) setSearch("");
                }}
              />
            ))
          )
        ) : isEmpty(cities) ? (
          <EmptyState />
        ) : (
          cities
            .filter((city) => matchesCitySearch(city, search))
            .map((city) => (
              <CityCard
                item={city}
                key={`city-${city?.id}`}
                callback={() => toggleCity(city)}
                isChecked={selectedCities.some(
                  (entry) => entry?.id === city?.id,
                )}
              />
            ))
        )}
      </div>

      <div className="bg-white shadow-card w-full py-4 flex items-center sticky gap-4 px-[10%] bottom-0">
        {selectedProvince ? (
          <Button
            width="w-full"
            variant="outline"
            title={_STRINGS.RETURN}
            onClick={backToProvinces}
            containerClass="flex w-full items-center justify-center"
          />
        ) : null}
        <Button
          width="w-full"
          title={submitTitle}
          onClick={onSubmitClick}
          containerClass="flex w-full items-center justify-center"
        />
      </div>
    </Modal>
  );
};

export default CityModal;
