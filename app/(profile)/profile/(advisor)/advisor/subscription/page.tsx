"use client";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { AuthService } from "@/api_services/auth/auth.service";
import { PropertyService } from "@/api_services/property/property.service";
import AdvisorPlansCard from "@/components/Advisor/AdvisorPlansCard";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Button from "@/components/shared/Button/Button";
import StatusShower from "@/components/shared/StatusShower";
import timeLeft from "@/helpers/timeLeft";
import { useStoreInit } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdvisorRegister = () => {
  const router = useRouter();
  const { userInfo } = useStoreInit((data) => data);
  const [showEndSub, setShowEndSub] = useState(false);
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const { data: subscriptionPlans } = useQuery({
    queryKey: [PropertyService.USER_SUBSCRIPTION_PLANS_CACHEKEY],

    queryFn: () => {
      return PropertyService.GetPropertySubscriptionPlans({ type: "ADVISOR" });
    },
  });

  const { data: advisorProfile, refetch: refetchAdvvisorProfile } = useQuery({
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

  const hideEndSub = () => {
    setShowEndSub(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                                 DELETE SUB                                 */
  /* -------------------------------------------------------------------------- */

  const { data: profile, refetch } = useQuery({
    queryKey: [AuthService.AU4_CACHEKEY],
    queryFn: () => {
      return AuthService.GetProfile();
    },
    staleTime: 0,
    gcTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!profile) {
      useStoreInit.setState({ userInfo: profile });
    }
  }, [profile]);

  const { mutate, isPending } = useMutation({
    mutationFn: AdvisorService.deleteAdvisorSub,
    onSuccess: (e) => {
      refetch();
      refetchAdvvisorProfile();
      hideEndSub();
    },
  });

  const onDelete = () => {
    mutate();
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
            ) : moment().isBefore(advisorProfile?.subscription_expired_at) ? (
              <p className=" text-sm ">
                {/* انقضا : {moment(advisorProfile?.subscription_expired_at)?.format("jYYYY/jMM/jDD")} */}
                انقضا :
                <span className="text-primary-700 mr-0.5">
                  {timeLeft(advisorProfile?.subscription_expired_at, false)} دیگر
                </span>
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="flex flex-col justify-between items-end gap-2">
            {" "}
            <StatusShower data={advisorProfile?.status} />
            {!!advisorProfile?.is_special ? (
              <Button
                onClick={() => {
                  setShowEndSub(true);
                }}
                containerClass="w-fit "
                width=" !py-1 !px-3  !text-xs "
                variant="outline"
                color="danger"
                title={_STRINGS.END_CONSULT_SUB}
              />
            ) : (
              <></>
            )}
          </div>
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
      <ConfirmModal
        confirmTextClassName=" !bg-primary-900 text-white !rounded-full "
        hideTextClassName=" !border-primary-900 border !bg-white !text-primary-900 !rounded-full "
        headerImage={"/assets/images/shared/red_crossed_sheet.png"}
        isVisible={showEndSub}
        onHide={hideEndSub}
        text={`آیا میخواهید اشتراک مشاور خود را لغو کنید؟`}
        isLoading={isPending}
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
};

export default AdvisorRegister;
