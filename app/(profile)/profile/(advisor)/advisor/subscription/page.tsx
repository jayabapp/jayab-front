"use client";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { PropertyService } from "@/api_services/property/property.service";
import AdvisorPlansCard from "@/components/Advisor/AdvisorPlansCard";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AdvisorRegister = () => {
  const router = useRouter();
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
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
  const isActive = moment().isBefore(advisorProfile?.subscription_expired_at);

  const hideRegisterModa = () => {
    setShowConfirmRegister(false);
  };
  const pusher = (link: string) => {
    router.push(link);
  };

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

            {!advisorProfile?.subscription_expired_at || !isActive ? (
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

      {!!advisorProfile?.admin_description ? (
        <div className=" w-full flex items-center justify-center  ">
          <p className="text-sm text-primary-150">توضیحات ادمین : {advisorProfile?.admin_description} </p>
        </div>
      ) : (
        <></>
      )}
      <div className="  w-full  grid  gird-cols-1 md:grid-cols-2 gap-3">
        {subscriptionPlans?.list?.map((e) => (
          <AdvisorPlansCard
            setShowConfirm={setShowConfirmRegister}
            subscriptionType={!!advisorProfile ? (advisorProfile?.is_special ? "is-especial" : "normal") : null}
            data={e}
            key={e?.id}
          />
        ))}
      </div>

      <ConfirmModal
        isVisible={showConfirmRegister}
        onHide={hideRegisterModa}
        text={`برای خرید ${subscriptionPlans?.list?.find((e) => !!e?.is_special)?.title} باید اول ثبت نام کنید .`}
        onConfirm={() => {
          pusher(`/profile/advisor/subscription/is-especial`);
        }}
        confirmText={"ادامه"}
        hideText="برگشت"
      />
    </div>
  );
};

export default AdvisorRegister;
