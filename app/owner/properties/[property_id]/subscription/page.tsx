"use client";
import SimpleBarChart from "@/components/widgets/chart/SimpleBarChart";
import { simpleChartFakeData } from "@/utils/faker";
import React from "react";

const Subscription = () => {
  return (
    <div
      id="homeParent"
      className="container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full h-96 relative ">
        <SimpleBarChart data={simpleChartFakeData} />{" "}
      </div>
    </div>
  );
};

export default Subscription;
