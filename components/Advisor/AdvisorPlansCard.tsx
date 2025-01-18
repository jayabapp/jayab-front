import React from "react";
import Button from "../shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { PropertySubsDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";

const AdvisorPlansCard = ({
  data,
  subscriptionType,
}: {
  data: PropertySubsDto;
  subscriptionType: "is-especial" | "normal" | null;
}) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: AdvisorService.payAdvisorPlan,
    onSuccess: (e) => {
      if (!!e) router.push(e);
    },
  });
  const onClick = () => {
    if (!subscriptionType) {
      router.push(`/profile/advisor/subscription/${!!data?.is_special ? "is-especial" : "is-not-especial"}`);
    } else if (!!subscriptionType)
      [
        mutate({
          gateway: "SANDBOX",
          plan_id: data?.id,
          redirect_url: `${window.origin}/profile/advisor/subscription`,
        }),
      ];
  };

  return (
    <div className="bg-primary-100 flex  py-2 px-3 flex-col gap-2 rounded-20 w-full ">
      <p className="font-medium text-sm md:text-base  w-full text-center ">{data?.title}</p>

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
