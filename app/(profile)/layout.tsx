"use client";
import Breadcrumbs from "@/components/BreadCrumbs";
import Profile from "@/components/profile/Profile";
import React, { ReactNode } from "react";

interface layOut {
  children: ReactNode;
}
const layout = ({ children }: layOut) => {
  return (
    <div className=" profile-grid-part grid-cols-12 w-full  px-3 md:px-3 lg:px-4 2xl:px-[10%] mx-auto gap-3 h-full   ">
      <div className="w-full  col-span-full">
        {" "}
        <Breadcrumbs />
      </div>
      <div className="hidden   lg:flex col-span-3  overflow-scroll  rounded-10 text-center h-full profile-py-28 ">
        <Profile />
      </div>

      <div
        className={`col-span-9 w-full  mx-auto h-full   mb-16 profile-py-28-md `}
        style={{ gridColumn: "span 9 / span 9" }}
      >
        {children}
      </div>
    </div>
  );
};

export default layout;
