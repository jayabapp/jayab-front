"use client";

import { useOwnerSubscriptionSelection } from "@features/owner-property/hooks/useOwnerSubscriptionSelection";
import { useRouter, useSearchParams } from "next/navigation";
import { usePayOwnerSubscription } from "@features/owner-property/hooks/useOwnerSubscription";
import { OwnerPhotoUpgradeModal } from "@modules/OwnerPhotoUpgrade";
import { usePropertyStatistics } from "@features/owner-property/hooks/usePropertyStatistics";
import { CheckboxCardContainer } from "@elements/Form";
import { toDailyViewSeries } from "@features/owner-property/mappers/property-statistics.mapper";
import { useTranslations } from "next-intl";
import { PropertyPrice } from "@modules/PropertyGrid";
import { useState } from "react";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";

import FixedBottomContainer from "@elements/FixedBottomContainer";
import numberWithCommas from "@/helpers/numberWithCommas";
import ViewsChart from "./parts/ViewsChart.client";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import isEmpty from "lodash/isEmpty";

const OwnerPropertySubscription = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const gatewayRedirectUrl = searchParams?.get("GATE_WAY_REDIRECT_URL");
  const [showPhotoUpgrade, setShowPhotoUpgrade] = useState(false);

  const {
    price,
    toggle,
    property,
    promoteId,
    canPromote,
    shownPlans,
    selectedPlans,
    subscriptionId,
    lockedPromoteId,
  } = useOwnerSubscriptionSelection(propertyId);

  const { data: statistics, isLoading: statsLoading } =
    usePropertyStatistics(propertyId);
  const { mutate, isPending } = usePayOwnerSubscription();

  const redirectUrl = () =>
    window.origin +
    (gatewayRedirectUrl ?? `/profile/owner/properties/${propertyId}`);

  const onSubmit = () => {
    if (isPending) return;
    if (!subscriptionId && !promoteId) {
      Notify({ body: t("owner.selectAPlan"), type: "warn" });
      return;
    }
    mutate(
      {
        gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
        promote_id: promoteId,
        property_id: propertyId,
        redirect_url: redirectUrl(),
        subscription_id: subscriptionId,
      },
      {
        onSuccess: (url) => {
          if (url) router.push(url);
        },
      },
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shownPlans?.map((plan) => (
          <CheckboxCardContainer
            key={plan.id}
            title={plan.title}
            description={plan.description}
            onSelect={() => toggle(plan)}
            isChecked={selectedPlans.some((entry) => entry.id === plan.id)}
            item={{
              disabled: !canPromote && plan.id === lockedPromoteId,
              hint:
                !canPromote && plan.id === lockedPromoteId
                  ? t("owner.promoteAfterActivation")
                  : "",
            }}
          >
            <div className="flex gap-2">
              <p className="font-bold text-sm text-link">
                {t("common.cost")} :
              </p>
              <PropertyPrice
                ribbon={plan}
                containerClass="flex gap-2 text-link"
                data={{
                  discounted_price: plan.price_with_discount,
                  price: plan.price,
                }}
              />
            </div>
          </CheckboxCardContainer>
        ))}
      </div>

      {statsLoading ? (
        <>
          <p className="font-bold">{t("owner.viewStats")}</p>
          <div className="h-96 w-full animate-pulse rounded-2xl bg-surface-hover" />
        </>
      ) : !isEmpty(statistics?.statistics) ? (
        <div className="w-full">
          <p className="text-base font-bold mb-4">{t("owner.roomStats")}</p>
          <div className="h-96">
            <ViewsChart data={toDailyViewSeries(statistics?.statistics)} />
          </div>
        </div>
      ) : null}

      <FixedBottomContainer>
        <div className="w-full flex items-center justify-between p-2 md:px-4">
          <p className="text-sm">
            {t("owner.payableAmount")} : {numberWithCommas(price)}{" "}
            {t("common.toman")}
          </p>
          <Button
            loading={isPending}
            title={t("common.pay")}
            roundedClass="rounded-full"
            width="!py-1.5 !px-10 md:!px-8"
            disabled={isEmpty(selectedPlans)}
            onClick={() => setShowPhotoUpgrade(true)}
          />
        </div>
      </FixedBottomContainer>

      {property ? (
        <OwnerPhotoUpgradeModal
          extraPrice={price}
          noImageSubmit={onSubmit}
          selectedPlans={selectedPlans}
          property={showPhotoUpgrade ? property : null}
          onHide={() => setShowPhotoUpgrade(false)}
          onHideClick={() => setShowPhotoUpgrade(false)}
          mutationOptions={{
            promote_id: promoteId,
            redirect_url: redirectUrl(),
            subscription_id: subscriptionId,
          }}
        />
      ) : null}
    </>
  );
};

export default OwnerPropertySubscription;
