"use client";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import _STRINGS from "@/utils/LocalStrings";
import React, { useState } from "react";
import SearchBox from "@/components/SearchBoxComp";
import { fakeConsultants } from "@/utils/faker";
import ModalSearchCities from "@/components/Modal/ModalSearchCity";

const Page = () => {
  const users = fakeConsultants;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const Header = () => (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full">
        <button onClick={handleModal} className="flex items-center gap-2">
          <span>{_STRINGS.SEARCH_IN} شهرهای مختلف</span>
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

        <div className="w-full grid md:grid-cols-2 gap-6">
          {users.map((item, index) => (
            <ConsultantCard data={item} key={index} hidden={{ record: true }} />
          ))}
        </div>
      </div>

      <ModalSearchCities showModal={isModalOpen} onHide={handleModal} />
    </>
  );
};

export default Page;
