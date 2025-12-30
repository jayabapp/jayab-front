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
import { isEmpty } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Subscription = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedPlans, setSelectedPlans] = useState<PropertySubsDto[]>([]);
  const [price, setPrice] = useState(0);
  const { property_id } = params;
  const { data: subscriptionPlans } = useQuery({
    queryKey: [PropertyService.USER_SUBSCRIPTION_PLANS_CACHEKEY, property_id],

    queryFn: () => {
      if (!!property_id) {
        return PropertyService.GetPropertySubscriptionPlans({ type: "PROPERTY", property_id: `${property_id}` });
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                             PRE SELECT PROMOTE                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isEmpty(subscriptionPlans?.list) && !!subscriptionPlans?.can_promote) {
      const promoteItem = subscriptionPlans?.list?.find((e) => e?.is_promote);
      if (!promoteItem) return;
      setSelectedPlans([promoteItem]);
    }
  }, [subscriptionPlans]);

  /* -------------------------------------------------------------------------- */
  /*                               PROP STATS DATA                              */
  /* -------------------------------------------------------------------------- */

  const { data: statsData, isLoading: statsLoading } = useQuery({
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

  /**
   * دو نوع انتخاب داریم: اشتراک و نردبان
   * از هر نوع اشتراک تنها یک انتخاب میتونیم داشته باشیم
   * @param plan
   */
  const onSelect = (plan: PropertySubsDto) => {
    const isPromote = plan.is_promote;
    let arr = [...selectedPlans];

    if (selectedPlans?.findIndex((_) => _.id === plan.id) > -1) {
      arr = arr?.filter((e) => e.id != plan.id);
    } else if (isPromote) arr = arr?.filter((e) => !e.is_promote).concat(plan);
    else {
      arr = arr.filter((e) => e.is_promote).concat(plan);
    }

    setSelectedPlans(arr);
  };

  /* -------------------------------------------------------------------------- */
  /*                             SETTING FINAL PRICE                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let price = selectedPlans.reduce((acc, cur) => acc + (cur.price_with_discount || cur.price), 0);
    setPrice(price);
  }, [selectedPlans]);

  const onSubmit = () => {
    const subId = selectedPlans.find((e) => !e.is_promote)?.id;
    const promotId = selectedPlans.find((e) => e.is_promote)?.id;

    if (!subId && !promotId) return Notify({ type: "warn", body: "لطفا پلن مورد نظر را انتخاب کنید" });
    mutate({
      gateway: "ZARINPAL",
      // gateway: "SANDBOX",
      redirect_url: window.origin + `/profile/owner/properties/${property_id}`,
      property_id: `${property_id}`,
      subscription_id: subId,
      promote_id: promotId,
    });
  };

  return (
    <div
      id="homeParent"
      className="profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className=" grid grid-cols-1 md:grid-cols-2  w-full gap-4">
        {subscriptionPlans?.list?.map((e) => (
          <CheckboxCardContainer
            key={`${e?.id}subs`}
            // item={!subscriptionPlans?.can_promote ? { disabled: e?.is_promote } : {}}
            item={{}} //موقتا اشتراک و نردبان همزمان قابل خرید باشد
            isChecked={selectedPlans?.findIndex((_) => _.id === e.id) !== -1}
            onSelect={() => {
              onSelect(e);
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
      </div>{" "}
      {statsLoading ? (
        <>
          <p className=" font-bold  w-full text-start">{_STRINGS.VIEW_STATS}</p>
          <div className="w-full h-96 relative ">
            <LottieLoading />{" "}
          </div>
        </>
      ) : !isEmpty(statsData?.statistics) ? (
        <div className=" mt-4 w-full flex flex-col items-center justify-center gap-6 ">
          <p className=" text-primary-700  text-xl font-bold">{_STRINGS.ROOM_STATS}</p>
          <div className="w-full h-96 p-1 relative ">
            <SimpleBarChart
              data={statsData?.statistics?.map((e) => ({ date: e?.date, value: e?.view_count, name: e?.date }))}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
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
