"use client";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import _STRINGS from "@/utils/LocalStrings";
import React, { useState, useEffect } from "react";
import SearchBox from "@/components/SearchBoxComp";
import { fakeConsultants } from "@/utils/faker";
import ModalSearchCities from "@/components/Modal/ModalSearchCity";
import { stringify } from "querystring";

interface City {
  id?: number;
  text?: string;
  title?: string;
}

const Page = () => {
  const users = fakeConsultants;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  useEffect(() => {
    console.log(selectedCities);
  }, [selectedCities]);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelectCities = (cities: City[]) => {
    setSelectedCities(cities);
  };

  const Header = () => (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full">
        <button onClick={handleModal} className="flex items-center gap-2">
          <div>
            <span>{_STRINGS.SEARCH_IN}</span>
            {selectedCities.length > 0 ? (
              <>
                <span> {selectedCities[0].title} </span>
                <span> و </span>
                <span> {selectedCities.length - 1} </span>
                <span> شهر دیگر </span>
              </>
            ) : (
              "شهرهای مختلف"
            )}
          </div>
          <img src="/assets/icons/shared/edit-pencel.svg" alt="" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        id="homeParent"
        className="container items-center !pt-12 !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
      >
        <Header />
        <section className="w-full">
          {users.length > 0 ? (
            <div className="w-full grid md:grid-cols-2 gap-6">
              {users.map((item, index) => (
                <ConsultantCard
                  data={item}
                  key={index}
                  hidden={{ record: true }}
                />
              ))}
            </div>
          ) : (
            "nothing found"
          )}
        </section>
      </div>
      <ModalSearchCities
        showModal={isModalOpen}
        onHide={handleModal}
        onSelectCities={handleSelectCities}
      />
    </>
  );
};

export default Page;
