"use client";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { PropertyService } from "@/api_services/property/property.service";
import AdvisorPlansCard from "@/components/Advisor/AdvisorPlansCard";
import StatusShower from "@/components/shared/StatusShower";
import { fakeAdvisorPlans } from "@/utils/faker";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import React from "react";

const AdvisorRegister = () => {
  const { data: subscriptionPlans } = useQuery({
    queryKey: [PropertyService.USER_SUBSCRIPTION_PLANS_CACHEKEY],

    queryFn: () => {
      return PropertyService.GetPropertySubscriptionPlans({ type: "ADVISOR" });
    },
  });

  const { data: advisorProfile } = useQuery({
    queryKey: [AdvisorService.USER_ADVISORS_PROFILE_CACHEKEY],

    queryFn: () => {
      return AdvisorService.userAdvisorsProfile();
    },
    staleTime: 0,
    gcTime: 0,
  });
  return (
    <div className=" profile-container  flex flex-col gap-4 ">
      {!!advisorProfile ? (
        <div className="w-full flex items-start justify-between">
          <div className="flex items-start flex-col gap-4">
            <p>
              {" "}
              پلن شما :{" "}
              {!!advisorProfile?.is_special
                ? subscriptionPlans?.list?.find((e) => !!e?.is_special)?.title
                : subscriptionPlans?.list?.find((e) => !e?.is_special)?.title}
            </p>

            {!advisorProfile?.subscription_expired_at ? (
              <p className="text-primary-150 text-sm">(شما اشتراک فعال ندارید)</p>
            ) : (
              <p className=" text-sm ">
                انقضا : {moment(advisorProfile?.subscription_expired_at)?.format("jYYYY/jMM/jDD")}
              </p>
            )}
          </div>
          <StatusShower data={advisorProfile?.status} />
        </div>
      ) : (
        <></>
      )}

      <div className="  w-full  grid  gird-cols-1 md:grid-cols-2 gap-3">
        {subscriptionPlans?.list?.map((e) => (
          <AdvisorPlansCard
            subscriptionType={!!advisorProfile ? (advisorProfile?.is_special ? "is-especial" : "normal") : null}
            data={e}
            key={e?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvisorRegister;
