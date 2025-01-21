import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import LinearTextBlock from "./LinearTextBlock";
import numberWithCommas from "@/helpers/numberWithCommas";

const EnvAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
        titleClass: "font-bold",
      }}
      title="اطلاعات محیطی"
    >
      <div className="flex items-center flex-col gap-4">
        <LinearTextBlock title={_STRINGS.ENV_PATTERN} value={data?.options?.pattern} />
        <LinearTextBlock title={_STRINGS.ACCESS_ROUTE} value={data?.options?.access} />
        <div className=" flex w-full flex-col items-start justify-start gap-2">
          <p className="text-sm font-light">{_STRINGS.ACCSESS_ROUTE_DESC}</p>
          <p className="font-medium whitespace-pre-wrap "> {data?.property_descriptions?.pattern_dscr}</p>
        </div>
        <LinearTextBlock title={_STRINGS.PROP_NEIGHTBOUR} value={data?.options?.neighborhood} />
        <div className=" flex w-full flex-col items-start justify-start gap-2">
          <p className="text-sm font-light">{_STRINGS.DISTANCETO_POINT}</p>
          <p className="font-medium whitespace-pre-wrap"> {data?.property_descriptions?.distance_dscr}</p>
        </div>
      </div>
    </SimpleAccordion>
  );
};

export default EnvAccard;
