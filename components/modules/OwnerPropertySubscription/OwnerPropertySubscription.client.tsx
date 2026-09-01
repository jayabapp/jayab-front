"use client";

import { useOwnerSubscriptionSelection } from "@features/owner-property/hooks/useOwnerSubscriptionSelection";
import { toDailyViewSeries } from "@features/owner-property/mappers/property-statistics.mapper";
import { usePayOwnerSubscription } from "@features/owner-property/hooks/useOwnerSubscription";
import { usePropertyStatistics } from "@features/owner-property/hooks/usePropertyStatistics";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckboxCardContainer } from "@elements/Form";
import { PropertyPrice } from "@modules/PropertyGrid";
import { useState } from "react";

import OwnerPhotoUpgradeModal from "@/components/profile/photo-upgrade/OwnerPhotoUpgradeModal";
import FixedBottomContainer from "@elements/FixedBottomContainer";
import numberWithCommas from "@/helpers/numberWithCommas";
import ViewsChart from "./parts/ViewsChart.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import isEmpty from "lodash/isEmpty";

const OwnerPropertySubscription = ({ propertyId }: OwnerPropertyRouteProps) => {
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
      Notify({ body: _STRINGS.SELECT_A_PLAN, type: "warn" });
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
                  ? _STRINGS.PROMOTE_AFTER_ACTIVATION
                  : "",
            }}
          >
            <div className="flex gap-2">
              <p className="font-bold text-sm text-brand-600">
                {_STRINGS.COST} :
              </p>
              <PropertyPrice
                ribbon={plan}
                containerClass="flex gap-2 text-brand-600"
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
          <p className="font-bold">{_STRINGS.VIEW_STATS}</p>
          <div className="h-96 w-full animate-pulse rounded-2xl bg-neutral-200" />
        </>
      ) : !isEmpty(statistics?.statistics) ? (
        <div className="w-full">
          <p className="text-base font-bold mb-4">{_STRINGS.ROOM_STATS}</p>
          <div className="h-96">
            <ViewsChart data={toDailyViewSeries(statistics?.statistics)} />
          </div>
        </div>
      ) : null}

      <FixedBottomContainer>
        <div className="w-full flex items-center justify-between p-2 md:px-4">
          <p className="text-sm">
            {_STRINGS.PAYABLE_AMOUNT} : {numberWithCommas(price)}{" "}
            {_STRINGS.TOMAN}
          </p>
          <Button
            loading={isPending}
            title={_STRINGS.PAY}
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
