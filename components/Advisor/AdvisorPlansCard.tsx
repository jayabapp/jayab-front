import React from "react";
import Button from "../shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const AdvisorPlansCard = ({
  data,
}: {
  data: {
    id: number;
    title: string;
    desc: string;
    pros: string[];
  };
}) => {
  return (
    <Link
      href={`/profile/advisor/subscription/is-especial`}
      className="bg-primary-100 flex  py-2 px-3 flex-col gap-2 rounded-20 w-full "
    >
      <p className="font-medium text-sm  w-full text-center ">{data?.title}</p>

      <div className="flex flex-col  pt-2 w-full items-start ">
        {data?.pros?.map((e, index) => (
          <p key={`${e}${index + 1}`} className=" text-sm ">
            <span>{index + 1}. </span>
            {e}
          </p>
        ))}
      </div>
      <Button title={_STRINGS.CONTINUE} containerClass="w-full pt-4" width="w-full !py-1" roundedClass="rounded-full" />
    </Link>
  );
};

export default AdvisorPlansCard;
