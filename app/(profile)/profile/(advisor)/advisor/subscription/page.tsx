"use client";

import { useCancelAdvisorSubscription } from "@features/advisors/hooks/useAdvisorSubscription";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePurchaseAdvisorPlan } from "@features/advisors/hooks/useAdvisorSubscription";
import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";
import { useAdvisorPlans } from "@features/advisors/hooks/useAdvisorPlans";
import { useStoreInit } from "@/store";
import { AuthService } from "@/api_services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";

import AdvisorPlansCard from "@/components/Advisor/AdvisorPlansCard";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Button from "@/components/shared/Button/Button";
import moment from "moment-jalaali";

const AdvisorRegister = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pay_key = searchParams.get("pay_key");
  const [showEndSub, setShowEndSub] = useState(false);
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const { data: subscriptionPlans, isPending: plansPending } =
    useAdvisorPlans();
  const { data: advisorProfile, isPending: profilePending } =
    useAdvisorProfile();
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

  const { data: profile, refetch } = useQuery({
    queryKey: [AuthService.AU4_CACHEKEY],
    queryFn: () => {
      return AuthService.getProfile();
    },
    staleTime: 0,
    gcTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!profile) useStoreInit.setState({ userInfo: profile });
  }, [profile]);

  const { mutate, isPending } = useCancelAdvisorSubscription();
  const onDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        void refetch();
        hideEndSub();
      },
    });
  };

  const goToEdit = () => {
    let link = "";
    if (advisorProfile?.is_special)
      link = "/profile/advisor/subscription/is-especial";
    else link = "/profile/advisor/subscription/normal";
    pusher(link);
  };

  const { mutate: payMutate, isPending: paymentPending } =
    usePurchaseAdvisorPlan();
  const paymentStarted = useRef(false);

  useEffect(() => {
    if (
      !!pay_key &&
      !isEmpty(subscriptionPlans?.list) &&
      !paymentStarted.current
    ) {
      const paymentKey = `advisor-payment:${pay_key}`;
      const lastStartedAt = Number(sessionStorage.getItem(paymentKey));
      if (lastStartedAt && Date.now() - lastStartedAt < 2 * 60_000) return;
      const planId =
        pay_key == "is-especial"
          ? subscriptionPlans?.list?.find((x) => !!x?.is_special)?.id
          : subscriptionPlans?.list?.find((x) => !x?.is_special)?.id;
      if (!!planId) {
        paymentStarted.current = true;
        sessionStorage.setItem(paymentKey, String(Date.now()));
        payMutate(
          {
            gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
            plan_id: planId,
            redirect_url: `${window.origin}/profile/advisor/subscription`,
          },
          {
            onError: () => {
              paymentStarted.current = false;
              sessionStorage.removeItem(paymentKey);
            },
          },
        );
      }
    }
  }, [payMutate, pay_key, subscriptionPlans]);

  if (
    (plansPending || profilePending) &&
    !advisorProfile &&
    !subscriptionPlans
  ) {
    return (
      <div className="profile-container animate-pulse">
        <div className="h-24 rounded-xl bg-neutral-100" />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="h-52 rounded-2xl bg-neutral-100" />
          <div className="h-52 rounded-2xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  return (
    <div className=" profile-container  flex flex-col gap-4 ">
      {!!advisorProfile ? (
        <div className="w-full flex flex-col items-start justify-between  gap-2">
          <div className="flex items-start flex-row justify-between w-full gap-4">
            <p className="text-sm ">
              {" "}
              پلن شما :{" "}
              {!!advisorProfile?.is_special
                ? subscriptionPlans?.list?.find((e) => !!e?.is_special)?.title
                : subscriptionPlans?.list?.find((e) => !e?.is_special)?.title}
            </p>
            <StatusShower data={advisorProfile?.status} />
          </div>

          {!advisorProfile?.subscription_expired_at || !isActive ? (
            <p className="text-danger-500 text-sm">(شما اشتراک فعال ندارید)</p>
          ) : moment().isBefore(advisorProfile?.subscription_expired_at) ? (
            <div className="flex items-center gap-2  justify-between  w-full  flex-row">
              <p className=" text-sm"> تعداد روز باقیمانده از اعتبار :</p>
              <div className=" rounded-full text-xs md:text-sm text-brand-600 bg-brand-200 flex  items-center justify-center h-5 md:h-6 w-16 md:w-20 ">
                {advisorProfile?.subscription_expired_at &&
                moment(advisorProfile?.subscription_expired_at).isAfter()
                  ? `${moment(advisorProfile?.subscription_expired_at).diff(moment(), "days")} روز `
                  : `اعتبار ندارد`}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-row w-full  items-center  gap-2">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              {advisorProfile?.status?.id == 10 ? (
                <Button
                  onClick={goToEdit}
                  containerClass="w-fit "
                  width=" !py-1 !px-3  !text-xs "
                  variant="outline"
                  color="light"
                  title={_STRINGS.EDIT_INFO}
                />
              ) : (
                <></>
              )}
            </div>
            {!!advisorProfile?.is_special ? (
              <Button
                onClick={() => {
                  setShowEndSub(true);
                }}
                containerClass="  w-fit "
                width="  !py-0.5 md:!py-1 !px-2 md:!px-3  !text-xs "
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
          <p className="text-sm text-danger-500">
            توضیحات ادمین : {advisorProfile?.admin_description}{" "}
          </p>
        </div>
      ) : (
        <></>
      )}
      <div className="  w-full  grid  gird-cols-1 md:grid-cols-2 gap-3">
        {subscriptionPlans?.list?.map((e) => (
          <AdvisorPlansCard
            setShowConfirm={setShowConfirmRegister}
            subscriptionType={
              !!advisorProfile
                ? advisorProfile?.is_special
                  ? "is-especial"
                  : "normal"
                : null
            }
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
      {paymentPending ? (
        <div className="fixed inset-x-0 bottom-0 z-50 h-1 animate-pulse bg-success-600" />
      ) : null}
      <ConfirmModal
        onHide={hideEndSub}
        isLoading={isPending}
        isVisible={showEndSub}
        text={`آیا میخواهید اشتراک مشاور خود را لغو کنید؟`}
        headerImage={"/assets/images/shared/red_crossed_sheet.png"}
        confirmTextClassName=" !bg-danger-500 text-white !rounded-full "
        hideTextClassName=" !border-danger-500 border !bg-white !text-danger-500 !rounded-full "
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
};

export default AdvisorRegister;
