import React from "react";
import Button from "../shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";
import { PropertySubsDto } from "@/api_services/property/property.interface";
import numberWithCommas from "@/helpers/numberWithCommas";

const AdvisorPlansCard = ({ data }: { data: PropertySubsDto }) => {
  return (
    <Link
      href={`/profile/advisor/subscription/${!!data?.is_special ? "is-especial" : "is-not-especial"}`}
      className="bg-primary-100 flex  py-2 px-3 flex-col gap-2 rounded-20 w-full "
    >
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
      <Button title={_STRINGS.CONTINUE} containerClass="w-full pt-4" width="w-full !py-1" roundedClass="rounded-full" />
    </Link>
  );
};

export default AdvisorPlansCard;
