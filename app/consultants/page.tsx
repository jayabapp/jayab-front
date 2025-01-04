"use client";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import _STRINGS from "@/utils/LocalStrings";
import React, { useEffect, useState } from "react";
import SearchBox from "@/components/SearchBoxComp";
import { fakeConsultants } from "@/utils/faker";

const Page = () => {
  const users = fakeConsultants;

  return (
    <div
      id="homeParent"
      className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.SEARCH_FOR_CONSULTANTS} />

      <header className="w-full flex flex-col gap-6">
        <div className="w-full">
          <SearchBox
            placeholder={_STRINGS.SEARCH_FOR_CONSULTANTS}
            onSubmit={(query) => console.log("Search submitted:", query)}
            onClear={() => console.log("Search cleared")}
            autofocus={true}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>جستجو در کردان و سه شهر دیگر</span>
        </div>
      </header>
      <div className="flex flex-row-reverse gap-6">
        <main className="w-full lg:w-10/12 grid lg:grid-cols-2 gap-6">
          {users.map((item, index) => (
            <ConsultantCard data={item} key={index} hidden={{ record: true }} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default Page;
