import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import LinearTextBlock from "./LinearTextBlock";
import PropertySelectedOptions from "./PropertySelectedOptions";

const FeatAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
        titleClass: "font-bold",
      }}
      title="امکانات ملک"
    >
      <div className="flex items-center flex-col gap-4">
        {!!data?.options?.entertainment ? (
          <div className="flex w-full flex-col  gap-3">
            <p className="text-primary-700 font-bold">{_STRINGS.ENTERTAINMENT}</p>
            {data?.options?.entertainment?.map((e) => (
              <PropertySelectedOptions title={e} key={`${e}poolType`} />
            ))}
          </div>
        ) : (
          <></>
        )}
        {!!data?.options?.kitchen ? (
          <div className="flex w-full flex-col  gap-3">
            <p className="text-primary-700 font-bold">{_STRINGS.KITCHEN_ACC}</p>
            {data?.options?.kitchen?.map((e) => (
              <PropertySelectedOptions title={e} key={`${e}poolType`} />
            ))}
          </div>
        ) : (
          <></>
        )}
        <div className=" flex w-full flex-col items-start justify-start gap-2">
          <p className="text-sm font-light">{_STRINGS.OTHER_ACCS}</p>
          <p className="font-medium"> {data?.property_descriptions?.other_dscr}</p>
        </div>
      </div>
    </SimpleAccordion>
  );
};

export default FeatAccard;
