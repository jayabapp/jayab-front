"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useOwnerSubscriptionPlans } from "@features/owner-property/hooks/useOwnerSubscription";
import { usePayOwnerSubscription } from "@features/owner-property/hooks/useOwnerSubscription";
import { usePropertyStatistics } from "@features/owner-property/hooks/usePropertyStatistics";
import { useEffect, useState } from "react";
import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { PropertySubsDto } from "@/api_services/property/property.interface";

import OwnerPhotoUpgradeModal from "@/components/profile/photo-upgrade/OwnerPhotoUpgradeModal";
import CheckboxCardContainer from "@/components/shared/Form/Checkbox/CheckboxCardContainer";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import AddCardPricePart from "@/components/properties/AddCardPricePart";
import numberWithCommas from "@/helpers/numberWithCommas";
import SimpleBarChart from "@/components/widgets/chart/SimpleBarChart";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";

const Subscription = () => {
  const router = useRouter();
  const params = useParams();
  const { property_id } = params;
  const searchParams = useSearchParams();
  const GATE_WAY_REDIRECT_URL = searchParams?.get("GATE_WAY_REDIRECT_URL");
  const [selectedPlans, setSelectedPlans] = useState<PropertySubsDto[]>([]);
  const [price, setPrice] = useState(0);
  const [promoteItemId, setPromoteItemId] = useState<number | undefined>(
    undefined,
  );
  const [canPromote, setCanPromote] = useState(false);
  const [shownPlans, setShownPlans] = useState<PropertySubsDto[]>([]);
  const [showUpgradeImage, setShowUpgradeImage] = useState(false);

  const propertyId = `${property_id ?? ""}`;
  const { data: subscriptionPlans } = useOwnerSubscriptionPlans(propertyId);

  useEffect(() => {
    if (subscriptionPlans && !isEmpty(subscriptionPlans?.list)) {
      const promoteItem = subscriptionPlans.list.find((e) => e.is_promote);
      if (promoteItem) {
        if (subscriptionPlans.can_promote) setSelectedPlans([promoteItem]);
        else setPromoteItemId(promoteItem.id);
      }
      setCanPromote(subscriptionPlans.can_promote);
    }
  }, [subscriptionPlans]);

  const { data } = useOwnerProperty(propertyId);

  useEffect(() => {
    const ONE_DAY_PLAN_ID = 1;
    let filterdOnes = subscriptionPlans?.list;
    if (!!data?.remaining_days || !canPromote) {
      filterdOnes = subscriptionPlans?.list?.filter(
        (e) => e?.id != ONE_DAY_PLAN_ID,
      );
    }

    setShownPlans(filterdOnes || []);
  }, [subscriptionPlans, data, canPromote]);

  const { data: statsData, isLoading: statsLoading } =
    usePropertyStatistics(propertyId);

  const getFilledStats = () => {
    if (isEmpty(statsData?.statistics)) return [];
    const map = new Map<string, number>();
    statsData?.statistics?.forEach((e) => {
      const key = new Date(e.date).toISOString().split("T")[0];
      map.set(key, e.view_count);
    });
    const dates = Array.from(map.keys()).map((d) => new Date(d));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const result: { date: Date; value: number; name: string }[] = [];

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      result.push({
        date: new Date(d),
        name: key,
        value: map.get(key) ?? 0,
      });
    }

    return result;
  };

  const { mutate, isPending } = usePayOwnerSubscription();

  const onSelect = (plan: PropertySubsDto) => {
    const isPromote = plan.is_promote;
    let arr = [...selectedPlans];
    if (arr.find((e) => e.id === plan.id))
      arr = arr.filter((e) => e.id !== plan.id);
    else if (isPromote) arr = arr.filter((e) => !e.is_promote).concat(plan);
    else arr = arr.filter((e) => e.is_promote).concat(plan);
    setSelectedPlans(arr);
  };

  useEffect(() => {
    const total = selectedPlans.reduce(
      (acc, cur) => acc + (cur.price_with_discount || cur.price),
      0,
    );
    setPrice(total);
  }, [selectedPlans]);

  const onSubmit = () => {
    const subId = selectedPlans.find((e) => !e.is_promote)?.id;
    const promotId = selectedPlans.find((e) => e.is_promote)?.id;
    if (!subId && !promotId)
      return Notify({ type: "warn", body: "لطفا پلن مورد نظر را انتخاب کنید" });
    mutate(
      {
        gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
        redirect_url:
          window.origin +
          (GATE_WAY_REDIRECT_URL ?? `/profile/owner/properties/${property_id}`),
        property_id: `${property_id}`,
        subscription_id: subId,
        promote_id: promotId,
      },
      {
        onSuccess: (url) => {
          if (url) router.push(url);
        },
      },
    );
  };

  return (
    <div className="profile-container flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shownPlans?.map((e) => (
          <CheckboxCardContainer
            key={e.id}
            item={{
              disabled: !canPromote && e.id === promoteItemId,
              hint:
                !canPromote && e.id === promoteItemId
                  ? "نردبان، پس از فعال شدن آگهی قابل خرید می‌باشد."
                  : "",
            }}
            isChecked={selectedPlans.some((_) => _.id === e.id)}
            onSelect={() => onSelect(e)}
            title={e.title}
            description={e.description}
          >
            <div className="flex gap-2">
              <p className="font-bold text-sm text-primary-700">
                {_STRINGS.COST} :
              </p>
              <AddCardPricePart
                ribbon={e}
                containerClass="flex gap-2 text-primary-700"
                data={{
                  price: e.price,
                  discounted_price: e.price_with_discount,
                }}
              />
            </div>
          </CheckboxCardContainer>
        ))}
      </div>

      {statsLoading ? (
        <>
          <p className="font-bold">{_STRINGS.VIEW_STATS}</p>
          <div className="h-96 w-full animate-pulse rounded-2xl bg-zinc-200" />
        </>
      ) : !isEmpty(statsData?.statistics) ? (
        <div className="w-full">
          <p className="text-base font-bold  mb-4">{_STRINGS.ROOM_STATS}</p>
          <div className="h-96">
            <SimpleBarChart data={getFilledStats()} />
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
            disabled={isEmpty(selectedPlans)}
            loading={isPending}
            onClick={() => {
              // onSubmit();
              setShowUpgradeImage(true);
            }}
            roundedClass="rounded-full"
            width="!py-1.5 !px-10 md:!px-8"
            title={_STRINGS.PAY}
          />
        </div>
      </FixedBottomContainer>
      {!!data ? (
        <OwnerPhotoUpgradeModal
          property={showUpgradeImage ? data : null}
          onHide={() => {
            setShowUpgradeImage(false);
          }}
          onHideClick={() => {
            setShowUpgradeImage(false);
          }}
          noImageSubmit={() => {
            onSubmit();
          }}
          mutationOptions={{
            redirect_url:
              window.origin +
              (GATE_WAY_REDIRECT_URL ??
                `/profile/owner/properties/${property_id}`),
            promote_id: selectedPlans.find((e) => e.is_promote)?.id,
            subscription_id: selectedPlans.find((e) => !e.is_promote)?.id,
          }}
          extraPrice={price}
          selectedPlans={selectedPlans}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Subscription;
