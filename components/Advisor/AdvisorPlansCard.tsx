import Button from "@elements/Button";
import _STRINGS from "@/utils/LocalStrings";
import { PropertySubsDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import { useRouter } from "next/navigation";
import { usePurchaseAdvisorPlan } from "@features/advisors/hooks/useAdvisorSubscription";

const AdvisorPlansCard = ({
  data,
  subscriptionType,
  setShowConfirm,
}: {
  data: PropertySubsDto;
  subscriptionType: "is-especial" | "normal" | null;
  setShowConfirm: (e: boolean) => void | null;
}) => {
  const router = useRouter();

  const { mutate, isPending } = usePurchaseAdvisorPlan();
  const onClick = () => {
    if (!subscriptionType) {
      router.push(
        `/profile/advisor/subscription/${!!data?.is_special ? "is-especial" : "is-not-especial"}`,
      );
    } else if (!!subscriptionType)
      if (subscriptionType == "normal" && !!data?.is_special) {
        setShowConfirm(true);
      } else {
        mutate({
            gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
            plan_id: data?.id,
            redirect_url: `${window.origin}/profile/advisor/subscription`,
          });
      }
  };

  return (
    <div className="bg-brand-100 flex  justify-between py-2 px-3 flex-col gap-2 rounded-20 w-full ">
      <p className="font-medium text-sm md:text-base  w-full text-center ">
        {data?.title}
      </p>

      <div className="flex flex-col  gap-2 pt-2 w-full items-start ">
        <p className="text-sm  whitespace-pre-wrap ">{data?.description}</p>
        <p className="text-sm">
          مبلغ : {numberWithCommas(data?.price)} {_STRINGS.TOMAN}
        </p>
        {/* {data?.pros?.map((e, index) => (
          <p key={`${e}${index + 1}`} className=" text-sm ">
            <span>{index + 1}. </span>
            {e}
          </p>
        ))} */}
      </div>
      <Button
        loading={isPending}
        onClick={onClick}
        title={!!subscriptionType ? _STRINGS.PAY : _STRINGS.CONTINUE}
        containerClass="w-full pt-4"
        width="w-full !py-1"
        roundedClass="rounded-full"
      />
    </div>
  );
};

export default AdvisorPlansCard;
