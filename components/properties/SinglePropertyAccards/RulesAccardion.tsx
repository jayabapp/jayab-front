"use client";
import { HomeService } from "@/api_services/home/home.service";
import { SinglePropDto } from "@/api_services/property/property.interface";
import Checkbox from "@/components/shared/Form/Checkbox";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";

const RulesAccardion = ({ data }: { data: SinglePropDto }) => {
  const { data: propertyRules, isLoading: rulesLoading } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, "propertyRules", 1],
    queryFn: () => {
      return HomeService.GetContent({ key: "propertyRules", page: 1 });
    },
    gcTime: 1000,
    staleTime: 1000,
  });

  const selectedRule = propertyRules?.data?.find((e) => e?.key == data?.canceling_type?.id);
  return (
    <SimpleAccordion
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
      }}
      title={_STRINGS.PROP_TERMS}
    >
      <div className="w-full h-full flex flex-col items-start justify-start gap-4 bg-white   md:rounded-md">
        <p className=" text-sm font-light">{_STRINGS.PROP_TERMS_PROLUGE}</p>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.CANCENLATION_DESC}</p>
          <p className="text-sm whitespace-pre-wrap  text-justify">{selectedRule?.small_text}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.GUEST_TYPE_STATUS}</p>
          {data?.options?.guest_type?.map((e) => (
            <Checkbox key={`${e}checjbox`} title={e} isChecked onSelect={() => {}} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.ANIMAL_RULES}</p>
          <p className="text-sm">{data?.options?.pet}</p>
          <p className="text-sm whitespace-pre-wrap text-justify ">{data?.property_descriptions?.pet_dscr}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.PARTY_RULES}</p>
          <p className="text-sm">{data?.options?.party}</p>
          <p className="text-sm whitespace-pre-wrap text-justify ">{data?.property_descriptions?.party_dscr}</p>
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
          <p className="text-sm">{data?.property_descriptions?.doc_dscr}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className=" text-sm font-bold">{_STRINGS.PROP_DESC}</p>
          <p className="text-sm whitespace-pre-wrap text-justify ">{data?.property_descriptions?.property_dscr}</p>
        </div>
        {!!data?.property_descriptions?.other_dscr ? (
          <div className="flex flex-col gap-2">
            <p className=" text-sm font-bold">{_STRINGS.OTHER_TERMS}</p>
            <p className="text-sm whitespace-pre-wrap text-justify ">{data?.property_descriptions?.other_dscr}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default RulesAccardion;
