"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import _STRINGS from "@/utils/LocalStrings";

import InstallPromt from "@/components/InstallPrompt";
import Modal from "@/components/Modal";

import { AuthService } from "@/api_services/auth/auth.service";
import CreateEditProperty from "@/components/Adds/CreateEditProperty";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import StepShower from "@/components/shared/StepShower";
import { createPropertySteps } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/shared/Button/Button";
import FormInput from "@/components/shared/Form/FormInput";
import PageFooter from "@/components/Footer/PageFooter";
import Checkbox from "@/components/shared/Form/Checkbox";

import axios from "axios";

import ModalSearchStatesAndCities from "@/components/ui/modals/ModalSearchStateAndCities";
import { stringify } from "querystring";

interface Child {
  id: number;
  title: string;
}

interface State {
  id: number;
  title: string;
  image?: string | null;
  child?: Child[];
}

const Page = () => {
  const [modalEntry, setModalEntry] = useState<number>(0);
  const [checkedStates, setCheckedStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAllStates, setSelectAllStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(true);
  const [ads, setAds] = useState([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const url = "http://192.168.1.104:3000/api/v1/cities";

    const fetchStates = async () => {
      try {
        // Axios response type can be inferred here
        const response = await axios.get<{ data: { data: State[] } }>(url);

        // Setting the states data
        setStates(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    // console.log(states);
  }, [states]);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  //   const handleSelect = (cityId: number) => {
  //     setCheckedStates((prev) => ({
  //       ...prev,
  //       [cityId]: !prev[cityId], // Toggle the checked state of the specific checkbox
  //     }));
  //   };

  const handleSelect = (cityId: number) => {
    setCheckedStates((prev) => ({
      ...prev,
      [cityId]: !prev[cityId], // Toggle the checked state of the specific checkbox
    }));
  };

  //   const handleSelectAll = (stateId: number, cities: any[]) => {
  //     const allSelected = cities.every((city) => checkedStates[city.id]);

  //     // If all cities are selected, deselect all; otherwise, select all
  //     const newState = cities.reduce((acc, city) => {
  //       acc[city.id] = !allSelected;
  //       return acc;
  //     }, {});

  //     setCheckedStates((prev) => ({
  //       ...prev,
  //       ...newState,
  //     }));

  //     // Update selectAllStates for the current state
  //     setSelectAllStates((prev) => ({
  //       ...prev,
  //       [stateId]: !allSelected,
  //     }));
  //   };

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
      // Axios response type can be inferred here
      const response = await axios.get<{ data: { data: Child[] } }>(
        `http://192.168.1.104:3000/api/v1/cities/${id}`
      );

      // Setting the states data
      setCities(response.data.data);

      console.log("cities");
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const displayChildren = (id: number) => {
    setModalEntry(id);

    fetchCities(id);
  };

  const handleSearchCities = async (title: string) => {
    // try {
    //   const response = await axios.get<{ data: { data: Child[] } }>(
    //     `http://192.168.1.104:3000/api/v1/cities/search?q=${title}`
    //   );
    //   // Setting the data (assuming you have setAds function to update state)
    //   setAds(response.data.data);
    //   console.log("Response received from the backend");
    //   console.log(JSON.stringify(response.data.data)); // Use JSON.stringify here
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  return (
    <>
      {/* <div className="container items-center !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "></div> */}

      <button onClick={handleModal}>Show Modal</button>

      <Modal
        options={{
          containerClass:
            "mx-auto my-10 w-full max-w-xl rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900",
        }}
        show={showModal}
        onHide={handleModal}
      >
        <div>
          <div className="flex flex-col">
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
            <section className="h-full">
              {modalEntry === 0 ? (
                <ul>
                  {states.map((item, index) => (
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
                        <div className="flex flex-col gap-2">
                          <h3>{item.title}</h3>
                          <ul className="flex items-center gap-1 list-none p-0 m-0 text-xs">
                            {item.child?.length > 0 &&
                              item.child?.map(
                                (city: Child, cityIndex: number) => (
                                  <li key={city.id}>
                                    {city.title}
                                    {cityIndex < item.child.length - 1 && " -"}
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
                  <div className="flex items-center justify-between p-5 !pb-0 -mb-2">
                    <span>{_STRINGS.ALL_CITIES}</span>
                    <Checkbox
                      isChecked={selectAllStates[modalEntry] || false}
                      onSelect={() => handleSelectAll(modalEntry, cities)}
                      containerClass="my-4"
                      rounded="rounded-lg"
                    />
                  </div>
                  <ul>
                    {cities.length > 0 &&
                      cities.map((city) => (
                        <li
                          key={city.id}
                          className="flex items-center justify-between h-20 p-5 border cursor-pointer"
                        >
                          <span>{city.title}</span>
                          <Checkbox
                            isChecked={checkedStates[city.id] || false}
                            onSelect={() => handleSelect(city.id)}
                            containerClass="my-4"
                            rounded="rounded-lg"
                            disabled={false}
                          />
                        </li>
                      ))}
                  </ul>
                </div>
                </>
              )}
            </section>
            {modalEntry !== 0 && (
              <footer className="flex items-center justify-center p-6 sticky bottom-0 h-20 bg-white">
                <Button
                  width="w-full flex items-center justify-center"
                  containerClass="w-full"
                  roundedClass="rounded-full"
                  title={_STRINGS.DISCOVER_ADS}
                  onClick={() => handleSearchCities()}
                />
              </footer>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Page;
