import AdvisorPlansCard from "@/components/Advisor/AdvisorPlansCard";
import { fakeAdvisorPlans } from "@/utils/faker";
import React from "react";

const AdvisorRegister = () => {
  return (
    <div className=" profile-container ">
      <div className="  w-full  grid  gird-cols-1 md:grid-cols-2 gap-3">
        {" "}
        {fakeAdvisorPlans?.map((e) => (
          <AdvisorPlansCard data={e} key={e?.id} />
        ))}
      </div>
    </div>
  );
};

export default AdvisorRegister;
