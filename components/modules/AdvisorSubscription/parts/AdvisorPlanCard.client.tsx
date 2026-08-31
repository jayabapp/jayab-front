"use client";

import { usePurchaseAdvisorPlan } from "@features/advisors/hooks/useAdvisorSubscription";
import type { AdvisorPlanCardProps } from "@/types/components/modules/advisors";
import { useRouter } from "next/navigation";

import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const AdvisorPlanCard = ({
  plan,
  subscriptionKind,
  onRequireRegistration,
}: AdvisorPlanCardProps) => {
  const router = useRouter();
  const { mutate, isPending } = usePurchaseAdvisorPlan();

  const onClick = () => {
    if (isPending) return;
    if (!subscriptionKind) {
      router.push(
        `/profile/advisor/subscription/${plan?.is_special ? "is-especial" : "is-not-especial"}`,
      );
      return;
    }
    if (subscriptionKind === "normal" && plan?.is_special) {
      onRequireRegistration();
      return;
    }
    mutate({
      gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
      plan_id: plan?.id,
      redirect_url: `${window.origin}/profile/advisor/subscription`,
    });
  };

  return (
    <div className="bg-brand-100 flex justify-between py-2 px-3 flex-col gap-2 rounded-20 w-full">
      <p className="font-medium text-sm md:text-base w-full text-center">
        {plan?.title}
      </p>

      <div className="flex flex-col gap-2 pt-2 w-full items-start">
        <p className="text-sm whitespace-pre-wrap">{plan?.description}</p>
        <p className="text-sm">
          {_STRINGS.AMOUNT} : {numberWithCommas(plan?.price)} {_STRINGS.TOMAN}
        </p>
      </div>

      <Button
        onClick={onClick}
        loading={isPending}
        disabled={isPending}
        width="w-full !py-1"
        roundedClass="rounded-full"
        containerClass="w-full pt-4"
        title={subscriptionKind ? _STRINGS.PAY : _STRINGS.CONTINUE}
      />
    </div>
  );
};

export default AdvisorPlanCard;
