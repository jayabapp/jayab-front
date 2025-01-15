"use client";
import { PropertyService } from "@/api_services/property/property.service";
import AddCardPricePart from "@/components/properties/AddCardPricePart";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import CheckboxCardContainer from "@/components/shared/Form/Checkbox/CheckboxCardContainer";
import SimpleBarChart from "@/components/widgets/chart/SimpleBarChart";
import numberWithCommas from "@/helpers/numberWithCommas";
import { simpleChartFakeData } from "@/utils/faker";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Subscription = () => {
  const router = useRouter();
  const params = useParams();
  const [values, setValues] = useState<(number | string)[]>([]);
  const [price, setPrice] = useState(0);
  const { property_id } = params;
  const { data: subscriptionPlans } = useQuery({
    queryKey: [PropertyService.USER_SUBSCRIPTION_PLANS_CACHEKEY, property_id],

    queryFn: () => {
      if (!!property_id) {
        return PropertyService.GetPropertySubscriptionPlans({ type: "PROPERTY" });
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                               PROP STATS DATA                              */
  /* -------------------------------------------------------------------------- */

  const { data: statsData } = useQuery({
    queryKey: [PropertyService.SINGLE_OWNER_PROPERTY_STATS_CACHEKEY, property_id],

    queryFn: () => {
      if (!!property_id) {
        return PropertyService.getPropertyStatistics({ propertyId: `${property_id}` });
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                PAYMENT POST                                */
  /* -------------------------------------------------------------------------- */

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.PayPropetySubscription,
    onSuccess: (e) => {
      if (!!e) router.push(e);
    },
  });

  const onSelect = (e: number | string) => {
    if (!!values?.includes(e)) {
      setValues((v) => v?.filter((x) => x != e));
    } else {
      setValues((v) => [...v, e]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             SETTING FINAL PRICE                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let price = 0;
    for (let index = 0; index < values.length; index++) {
      const item = subscriptionPlans?.list?.find((e) => e?.id == values[index]);
      price = price + (item?.price_with_discount || item?.price || 0);
    }
    setPrice(price);
  }, [values]);

  const onSubmit = () => {
    let subId = subscriptionPlans?.list?.find((e) => !e?.is_promote && values?.includes(e?.id))?.id;
    let promotId = subscriptionPlans?.list?.find((e) => !!e?.is_promote && values?.includes(e?.id))?.id;

    mutate({
      gateway: "SANDBOX",
      redirect_url: window.origin,
      property_id: `${property_id}`,
      subscription_id: subId,
      promote_id: promotId,
    });
  };

  console.log(statsData, "statsDatastatsDatastatsData");

  return (
    <div
      id="homeParent"
      className="profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <p className=" font-bold  w-full text-start">{_STRINGS.VIEW_STATS}</p>
      <div className="w-full h-96 relative ">
        <SimpleBarChart data={simpleChartFakeData} />{" "}
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2  w-full gap-4">
        {subscriptionPlans?.list?.map((e) => (
          <CheckboxCardContainer
            key={`${e?.id}subs`}
            item={!subscriptionPlans?.can_promote ? { disabled: e?.is_promote } : {}}
            isChecked={!!values?.includes(e?.id)}
            onSelect={() => {
              onSelect(e?.id);
            }}
            title={e?.title}
            description={e?.description}
          >
            <div className="w-full flex items-start gap-2 ">
              <p className="font-bold text-sm text-primary-700 shrink-0">{_STRINGS.COST} :</p>
              <AddCardPricePart
                containerClass=" items-center text-primary-700 flex flex-row w-full gap-2"
                data={{ price: e?.price, discounted_price: e?.price_with_discount }}
              />
            </div>
          </CheckboxCardContainer>
        ))}
      </div>

      <FixedBottomContainer>
        <div className="w-full flex items-center justify-between p-2 md:px-4">
          <p className="text-sm">
            {_STRINGS.PAYABLE_AMOUNT} : {numberWithCommas(price)} {_STRINGS.TOMAN}
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
