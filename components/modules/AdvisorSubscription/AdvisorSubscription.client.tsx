"use client";

import { useCancelAdvisorSubscription } from "@features/advisors/hooks/useAdvisorSubscription";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdvisorPlanCheckout } from "@features/advisors/hooks/useAdvisorPlanCheckout";
import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";
import { useAdvisorPlans } from "@features/advisors/hooks/useAdvisorPlans";
import { useTranslations } from "next-intl";
import { useState } from "react";

import AdvisorSubscriptionSkeleton from "./AdvisorSubscriptionSkeleton";
import AdvisorSubscriptionStatus from "./parts/AdvisorSubscriptionStatus.client";
import AdvisorPlanCard from "./parts/AdvisorPlanCard.client";
import ConfirmModal from "@elements/Modal/ConfirmModal.client";

const AdvisorSubscription = () => {
  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const payKey = searchParams.get("pay_key");

  const { data: plans, isPending: plansPending } = useAdvisorPlans();
  const { data: profile, isPending: profilePending } = useAdvisorProfile();
  const { isPending: isPaying } = useAdvisorPlanCheckout(payKey);
  const { mutate: cancel, isPending: isCancelling } =
    useCancelAdvisorSubscription();

  const [showCancel, setShowCancel] = useState(false);
  const [showRegisterFirst, setShowRegisterFirst] = useState(false);

  if ((plansPending || profilePending) && !profile && !plans)
    return <AdvisorSubscriptionSkeleton />;

  const specialPlanTitle = plans?.list?.find(
    (plan) => !!plan?.is_special,
  )?.title;
  const subscriptionKind = profile
    ? profile.is_special
      ? "is-especial"
      : "normal"
    : null;

  return (
    <>
      {profile ? (
        <AdvisorSubscriptionStatus
          profile={profile}
          plans={plans?.list}
          onCancel={() => setShowCancel(true)}
        />
      ) : null}

      {profile?.admin_description ? (
        <div className="w-full flex items-center justify-center">
          <p className="text-sm text-danger-500">
            {t("advisor.adminDescription")} : {profile.admin_description}
          </p>
        </div>
      ) : null}

      <div className="w-full grid gird-cols-1 md:grid-cols-2 gap-3">
        {plans?.list?.map((plan) => (
          <AdvisorPlanCard
            plan={plan}
            key={plan?.id}
            subscriptionKind={subscriptionKind}
            onRequireRegistration={() => setShowRegisterFirst(true)}
          />
        ))}
      </div>

      {isPaying ? (
        <div className="fixed inset-x-0 bottom-0 z-50 h-1 animate-pulse bg-success-600" />
      ) : null}

      <ConfirmModal
        hideText={t("common.back")}
        isVisible={showRegisterFirst}
        confirmText={t("advisor.continue")}
        onHide={() => setShowRegisterFirst(false)}
        text={`${t("advisor.buyRequiresRegistrationPrefix")} ${specialPlanTitle} ${t("advisor.buyRequiresRegistrationSuffix")}`}
        onConfirm={() =>
          router.push("/profile/advisor/subscription/is-especial")
        }
      />

      <ConfirmModal
        isVisible={showCancel}
        isLoading={isCancelling}
        onHide={() => setShowCancel(false)}
        text={t("advisor.areUSureCancelAdvisorSub")}
        headerImage="/assets/images/shared/red_crossed_sheet.png"
        confirmTextClassName=" !bg-danger-500 text-white !rounded-full "
        hideTextClassName=" !border-danger-500 border !bg-white !text-danger-500 !rounded-full "
        onConfirm={() => {
          if (isCancelling) return;
          cancel(undefined, { onSuccess: () => setShowCancel(false) });
        }}
      />
    </>
  );
};

export default AdvisorSubscription;
