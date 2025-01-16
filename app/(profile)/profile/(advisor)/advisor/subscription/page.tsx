"use client";
import { PropertyService } from "@/api_services/property/property.service";
import AdvisorPlansCard from "@/components/Advisor/AdvisorPlansCard";
import { fakeAdvisorPlans } from "@/utils/faker";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const AdvisorRegister = () => {
  const { data: subscriptionPlans } = useQuery({
    queryKey: [PropertyService.USER_SUBSCRIPTION_PLANS_CACHEKEY],

    queryFn: () => {
      return PropertyService.GetPropertySubscriptionPlans({ type: "ADVISOR" });
    },
  });
  return (
    <div className=" profile-container ">
      <div className="  w-full  grid  gird-cols-1 md:grid-cols-2 gap-3">
        {" "}
        {subscriptionPlans?.list?.map((e) => (
          <AdvisorPlansCard data={e} key={e?.id} />
        ))}
      </div>
    </div>
  );
};

export default AdvisorRegister;
