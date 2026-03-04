"use client";

import { PropertySubsDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import AddCardPricePart from "@/components/properties/AddCardPricePart";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import CheckboxCardContainer from "@/components/shared/Form/Checkbox/CheckboxCardContainer";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Notify from "@/components/shared/Toast";
import SimpleBarChart from "@/components/widgets/chart/SimpleBarChart";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import isEmpty from "lodash/isEmpty";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Subscription = () => {
  const router = useRouter();
  const params = useParams();
  const { property_id } = params;

  const [selectedPlans, setSelectedPlans] = useState<PropertySubsDto[]>([]);
  const [price, setPrice] = useState(0);
  const [promoteItemId, setPromoteItemId] = useState<number | undefined>(
    undefined,
  );
  const [canPromote, setCanPromote] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                              SUBSCRIPTIONS                                 */
  /* -------------------------------------------------------------------------- */

  const { data: subscriptionPlans } = useQuery({
    queryKey: [PropertyService.USER_SUBSCRIPTION_PLANS_CACHEKEY, property_id],
    queryFn: () => {
      if (property_id) {
        return PropertyService.GetPropertySubscriptionPlans({
          type: "PROPERTY",
          property_id: `${property_id}`,
        });
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                         PRE SELECT PROMOTE PLAN                             */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                                PROPERTY STATS                               */
  /* -------------------------------------------------------------------------- */

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: [
      PropertyService.SINGLE_OWNER_PROPERTY_STATS_CACHEKEY,
      property_id,
    ],
    queryFn: () => {
      if (property_id) {
        return PropertyService.getPropertyStatistics({
          propertyId: `${property_id}`,
        });
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                     FILL MISSING DAYS WITH ZERO                             */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                                 PAYMENT                                    */
  /* -------------------------------------------------------------------------- */

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.PayPropetySubscription,
    onSuccess: (e) => {
      if (e) router.push(e);
    },
  });

  const onSelect = (plan: PropertySubsDto) => {
    const isPromote = plan.is_promote;
    let arr = [...selectedPlans];

    if (arr.find((e) => e.id === plan.id)) {
      arr = arr.filter((e) => e.id !== plan.id);
    } else if (isPromote) {
      arr = arr.filter((e) => !e.is_promote).concat(plan);
    } else {
      arr = arr.filter((e) => e.is_promote).concat(plan);
    }

    setSelectedPlans(arr);
  };

  /* -------------------------------------------------------------------------- */
  /*                            FINAL PRICE CALCULATION                          */
  /* -------------------------------------------------------------------------- */

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

    mutate({
      gateway: "SANDBOX",
      redirect_url: window.origin + `/profile/owner/properties/${property_id}`,
      property_id: `${property_id}`,
      subscription_id: subId,
      promote_id: promotId,
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="profile-container flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptionPlans?.list?.map((e) => (
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
          <div className="h-96">
            <LottieLoading />
          </div>
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
            loading={isPending}
            onClick={() => {
              onSubmit();
            }}
            roundedClass="rounded-full"
            width="!py-1.5 !px-10 md:!px-8"
            title={_STRINGS.PAY}
          />
        </div>
      </FixedBottomContainer>
    </div>
  );
};

export default Subscription;
