"use client";

import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { HomeService } from "@/api_services/home/home.service";
import { useQuery } from "@tanstack/react-query";

import _STRINGS from "@/utils/LocalStrings";
import Checkbox from "@/components/shared/Form/Checkbox";
import CmsText from "@/components/shared/CmsText";

type TPropertyTermsBodyProps = {
  data: SinglePropDto;
  enabled?: boolean;
  className?: string;
  prologueClass?: string;
};

const PropertyTermsBody = ({
  data,
  className = "",
  enabled = true,
  prologueClass = " text-sm font-medium ",
}: TPropertyTermsBodyProps) => {
  const { data: propertyRules } = useQuery({
    queryKey: [HomeService.CONTENTS_CACHEKEY, "propertyRules", 1],
    queryFn: () => HomeService.GetContent({ key: "propertyRules", page: 1 }),
    enabled,
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });

  const selectedRule = propertyRules?.data?.find(
    (e) => e?.key == data?.canceling_type?.id,
  );

  return (
    <div
      className={`w-full h-full flex flex-col items-start justify-start gap-4 bg-white   md:rounded-md ${className}`}
    >
      <p className={prologueClass}>{_STRINGS.PROP_TERMS_PROLUGE}</p>
      <div className="flex flex-col gap-2">
        <p className=" text-sm font-bold">{_STRINGS.CANCENLATION_DESC}</p>
        <CmsText className="text-sm  text-justify content ">
          {selectedRule?.small_text}
        </CmsText>
      </div>
      <div className="flex flex-col gap-2">
        <p className=" text-sm font-bold">{_STRINGS.GUEST_TYPE_STATUS}</p>
        {data?.options?.guest_type?.map((e) => (
          <Checkbox
            key={`${e}checjbox`}
            title={e}
            isChecked
            onSelect={() => {}}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className=" text-sm font-bold">{_STRINGS.ANIMAL_RULES}</p>
        <p className="text-sm">{data?.options?.pet}</p>
        <CmsText className="text-sm text-justify content  ">
          {data?.property_descriptions?.pet_dscr}
        </CmsText>
      </div>
      <div className="flex flex-col gap-2">
        <p className=" text-sm font-bold">{_STRINGS.PARTY_RULES}</p>
        <p className="text-sm">{data?.options?.party}</p>
        <CmsText className="text-sm text-justify content  ">
          {data?.property_descriptions?.party_dscr}
        </CmsText>
      </div>
      <div className="w-full flex items-center  gap-8">
        {" "}
        <div className="flex flex-row gap-2">
          <p className=" text-sm font-bold">{_STRINGS.ENTER_HOUR} :</p>
          <p className="text-sm">{data?.check_in_hour}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className=" text-sm font-bold">{_STRINGS.END_HOUR} :</p>
          <p className="text-sm">{data?.check_out_hour}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className=" text-sm font-bold">{_STRINGS.REQUIRED_DOCS}</p>
        <CmsText className="text-sm">
          {data?.property_descriptions?.doc_dscr}
        </CmsText>
      </div>
      {!!data?.property_descriptions?.other_dscr ? (
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.OTHER_TERMS}</p>
          <CmsText className="text-sm text-justify content  ">
            {data?.property_descriptions?.other_dscr}
          </CmsText>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PropertyTermsBody;
