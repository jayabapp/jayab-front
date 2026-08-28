"use client";

import { isMobile, isTablet } from "react-device-detect";
import { SinglePropDto } from "@/api_services/property/property.interface";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";

import PropertyTermsBody from "./PropertyTermsBody";

const RulesAccardion = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      isOpenFirst={isMobile || isTablet}
      item={{
        parenClass: " bg-white border border-neutral-300 !mt-0  rounded-10 w-full",
      }}
      title={_STRINGS.PROP_TERMS}
    >
      <PropertyTermsBody data={data} />
    </SimpleAccordion>
  );
};

export default RulesAccardion;
