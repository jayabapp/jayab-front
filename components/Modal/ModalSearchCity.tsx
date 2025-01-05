"use client";

import React, { useEffect, useState } from "react";
import _STRINGS from "@/utils/LocalStrings";
import type { City, State } from "@/api_services/city/city.interface";
import { CityService } from "@/api_services/city/city.service";

import Image from "next/image";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import Checkbox from "@/components/shared/Form/Checkbox";

type ModalSearchCitiesProps = {
  showModal: boolean;
  onHide: () => void;
  onSelectCities: (selectedCities: City[]) => void; // Callback to pass selected cities to parent
};

function ModalSearchCities({
  showModal,
  onHide,
  onSelectCities,
}: ModalSearchCitiesProps) {
  const [modalEntry, setModalEntry] = useState<number>(0);
  const [checkedStates, setCheckedStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllStates, setSelectAllStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]); // Local state to track selected cities
  const [errors, setErrors] = useState<String[]>();

  useEffect(() => {
    console.log(
      "Cities *****************************************************************"
    );
    console.log(cities);
  }, [cities]);

  useEffect(() => {
    console.log(
      "selectedCities ------------------------------------------------------------"
    );
    console.log(selectedCities);
  }, [selectedCities]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await CityService.fetchStates();
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleSelect = (cityId: number, city: City) => {
    setCheckedStates((prev) => ({
      ...prev,
      [cityId]: !prev[cityId],
    }));

    // Update selectedCities based on whether the city is checked
    setSelectedCities((prevSelectedCities) => {
      if (checkedStates[cityId]) {
        return prevSelectedCities.filter((item) => item.id !== cityId); // Deselect
      } else {
        return [...prevSelectedCities, city]; // Select
      }
    });
  };

  const handleSelectAll = (stateId: number, cities: City[]) => {
    const allSelected = cities.every((city) => checkedStates[city.id]);

    const newState = cities.reduce((acc, city) => {
      acc[city.id] = !allSelected;
      return acc;
    }, {});

    setCheckedStates((prev) => ({
      ...prev,
      ...newState,
    }));

    setSelectAllStates((prev) => ({
      ...prev,
      [stateId]: !allSelected,
    }));

    // Update selectedCities when "Select All" is toggled
    if (!allSelected) {
      setSelectedCities(cities); // Select all cities
    } else {
      setSelectedCities([]); // Deselect all cities
    }
  };

  const fetchCities = async (id: number) => {
    try {
      const data = await CityService.fetchCities(id);
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const displayChildren = (id: number) => {
    setModalEntry(id);
    fetchCities(id);
  };

  useEffect(() => {
    // Pass selected cities to the parent whenever it changes
    onSelectCities(selectedCities);
  }, [selectedCities, onSelectCities]);

  return (
    <Modal
      options={{
        containerClass:
          "mx-auto md:my-10 w-full h-screen md:h-full max-w-lg md:rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
      }}
      show={showModal}
      onHide={onHide}
    >
      <div className="h-auto">
        <div className="flex flex-col h-auto">
          <div className="flex items-center justify-center sticky select-none z-[40] shadow-md bg-white w-full transition-all top-0 h-16 px-6 py-4">
            <button
              onClick={onHide}
              className="text-2xl text-gray-500 absolute left-6 top-6 cursor-pointer"
            >
              <img src="/assets/icons/close.svg" alt="" />
            </button>
            <span className="font-semibold">{_STRINGS.SEARCH_STATES}</span>
            {modalEntry !== 0 ? (
              <button
                onClick={() => setModalEntry(0)}
                className="text-2xl text-gray-500 absolute right-6 top-6 cursor-pointer"
              >
                <img alt="" src="/assets/icons/chevron-right.svg" />
              </button>
            ) : null}
          </div>
          <section className="min-h-full">
            {modalEntry === 0 ? (
              <ul>
                {states.length > 0 ? (
                  <>
                    {states?.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between h-20 p-5 border cursor-pointer"
                        onClick={() => displayChildren(item.id)}
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            alt=""
                            src="/assets/images/city.png"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="flex flex-col gap-1">
                            <h3>{item.title}</h3>
                            <ul className="flex items-center gap-1 list-none p-0 m-0 text-xs text-[#9296A0]">
                              {(item.child?.length ?? 0) > 0 &&
                                item.child?.map(
                                  (city: City, cityIndex: number) => (
                                    <li key={city.id}>
                                      {city.title}
                                      {cityIndex <
                                        (item.child?.length ?? 0) - 1 && " -"}
                                    </li>
                                  )
                                )}
                            </ul>
                          </div>
                        </div>
                        <button type="button">
                          <img alt="" src="/assets/icons/chevron-left.svg" />
                        </button>
                      </li>
                    ))}
                  </>
                ) : (
                  <div className="p-10 text-center">
                    هیچ داده ای وجود ندارد.
                  </div>
                )}
              </ul>
            ) : (
              <>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between p-5 !pb-0 -mb-2 font-semibold text-primary-700">
                    <div className="flex items-center gap-1">
                      <img src="/assets/icons/shared/caret-left.svg" alt="" />
                      <span>{_STRINGS.ALL_CITIES}</span>
                    </div>
                    <Checkbox
                      isChecked={selectAllStates[modalEntry] || false}
                      onSelect={() => handleSelectAll(modalEntry, cities)}
                      containerClass="my-4"
                      rounded="rounded-lg"
                    />
                  </div>
                  <ul className="h-full">
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <li
                          key={city.id}
                          onClick={() => handleSelect(city.id, city)}
                          className="flex items-center justify-between h-20 p-5 border cursor-pointer"
                        >
                          <span>{city.title}</span>
                          <Checkbox
                            isChecked={checkedStates[city.id] || false}
                            onSelect={() => console.log("x")}
                            containerClass="my-4"
                            rounded="rounded-lg"
                            disabled={false}
                          />
                        </li>
                      ))
                    ) : (
                      <div className="text-center p-10 mb-80">
                        هیچ اطلاعاتی وارد نشده است
                      </div>
                    )}
                  </ul>
                </div>
              </>
            )}
          </section>
          {modalEntry !== 0 && (
            <div className="w-full flex items-center justify-center p-6 fixed md:sticky bottom-0 h-20 bg-white shadow-[0px_-1px_6px_0px_#00000026] z-50">
              <Button
                width="w-full flex items-center justify-center"
                containerClass="w-full"
                roundedClass="rounded-full"
                title={_STRINGS.DISCOVER_ADS}
                onClick={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalSearchCities;
