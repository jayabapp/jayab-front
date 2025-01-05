"use client";

import React, { useEffect, useState } from "react";
import _STRINGS from "@/utils/LocalStrings";
import type { City, State } from "@/api_services/city/city.interface";
import { CityService } from "@/api_services/city/city.service";

import Image from "next/image";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import Checkbox from "@/components/shared/Form/Checkbox";
import { divide } from "lodash";

const Page = () => {
  const [modalEntry, setModalEntry] = useState<number>(0);
  const [checkedStates, setCheckedStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllStates, setSelectAllStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [ads, setAds] = useState([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await CityService.fetchStates();
        setStates(statesData); // Set the fetched states data
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleSelect = (cityId: number) => {
    setCheckedStates((prev) => ({
      ...prev,
      [cityId]: !prev[cityId], // Toggle the checked state of the specific checkbox
    }));
  };

  const handleSelectAll = (stateId: number, cities: any[]) => {
    const allSelected = cities.every((city) => checkedStates[city.id]);

    // If all cities are selected, deselect all; otherwise, select all
    const newState = cities.reduce((acc, city) => {
      acc[city.id] = !allSelected;
      return acc;
    }, {});

    setCheckedStates((prev) => ({
      ...prev,
      ...newState,
    }));

    // Update selectAllStates for the current state
    setSelectAllStates((prev) => ({
      ...prev,
      [stateId]: !allSelected,
    }));
  };

  const fetchCities = async (id: number) => {
    try {
      const data = await CityService.fetchCities(id);
      setCities(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const displayChildren = (id: number) => {
    setModalEntry(id);

    fetchCities(id);
  };

  const handleSearchCities = async (title: string) => {};

  return (
    <>
      <button onClick={handleModal}>Show Modal</button>

      <Modal
        options={{
          containerClass:
            "mx-auto md:my-10 w-full h-screen md:h-full max-w-lg md:rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
        }}
        show={showModal}
        onHide={handleModal}
      >
        <div className="h-auto">
          <div className="flex flex-col h-auto">
            <div className="flex items-center justify-center sticky select-none z-[40]   shadow-md   bg-white w-full transition-all top-0 h-16 px-6 py-4">
              <span className="font-semibold">{_STRINGS.SEARCH_STATES}</span>
              {modalEntry === 0 ? (
                <button
                  onClick={handleModal}
                  className="text-2xl text-gray-500 absolute right-6 top-6"
                >
                  <img src="/assets/icons/close.svg" alt="" />
                </button>
              ) : (
                <button
                  onClick={() => setModalEntry(0)}
                  className="text-2xl text-gray-500 absolute right-6 top-6"
                >
                  <img alt="" src="/assets/icons/chevron-right.svg" />
                </button>
              )}
            </div>
            <section className="min-h-full">
              {modalEntry === 0 ? (
                <ul>
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
                            onClick={() => handleSelect(city.id)}
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
                  onClick={() => handleSearchCities("someTitle")}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Page;
