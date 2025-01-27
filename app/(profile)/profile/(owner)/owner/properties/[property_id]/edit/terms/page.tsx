"use client";
import {
  AssistantSendDto,
  PricingPropertySendDto,
  PropertyTermsSendDto,
} from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import SuccessAddModal from "@/components/properties/SuccessAddModal";
import PropTermItem from "@/components/properties/TermItem";
import TitleCounter from "@/components/properties/TitleCounter";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import Checkbox from "@/components/shared/Form/Checkbox";
import FormInput from "@/components/shared/Form/FormInput";
import FormInputWithExternalUnit from "@/components/shared/Form/FormInputWithExternalUnit";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import StepShower from "@/components/shared/StepShower";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isArray } from "lodash";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreatePropertyTerms = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showSucces, setShowSucces] = useState(false);
  const params = useParams();
  const { property_id } = params;

  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP CREATION                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      } else return null;
    },
    gcTime: 0,
    staleTime: 0,
  });

  const { data: propertyTypes } = useQuery({
    queryFn: () => PropertyService.GetUserPropertyGroup({ group: ["PARTY", "PET", "GUEST_TYPE"] }),
    queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "PARTY", "PET", "GUEST_TYPE"],
  });

  const [values, setValues] = useState<PropertyTermsSendDto>({
    ad_dscr: "",
    canceling_type: "NORMAL",
    check_in_hour: "",
    check_out_hour: "",
    doc_dscr: "",
    guest_dscr: "",
    guest_type: [],
    other_dscr: "",
    party: "",
    party_dscr: "",
    pet: "",
    pet_dscr: "",
    property_dscr: "",
  });
  useEffect(() => {
    if (!!initPropData?.canceling_type) {
      setValues({
        canceling_type: initPropData?.canceling_type || "",
        ad_dscr: initPropData?.description?.ad_dscr,
        doc_dscr: initPropData?.description?.doc_dscr,
        guest_dscr: initPropData?.description?.guest_dscr,
        other_dscr: initPropData?.description?.other_dscr,
        party_dscr: initPropData?.description?.party_dscr,
        property_dscr: initPropData?.description?.property_dscr,
        pet_dscr: initPropData?.description?.pet_dscr,
        check_in_hour: initPropData?.check_in_hour,
        check_out_hour: initPropData?.check_out_hour,
        guest_type:
          initPropData?.property_options?.filter((e) => e?.option?.group == "GUEST_TYPE")?.map((e) => e?.option_id) ||
          [],
        party: initPropData?.property_options?.find((e) => e?.option?.group == "PARTY")?.option_id || "",
        pet: initPropData?.property_options?.find((e) => e?.option?.group == "PET")?.option_id || "",
      });
    }
  }, [initPropData]);

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetTerms,
    onSuccess: () => {
      if (!initPropData?.canceling_type) setShowSucces(true);
    },
  });
  const onSubmit = () => {
    if (!!initPropData?.id) {
      mutate({ ...values, propertyId: initPropData?.id });
    }
  };

  const onChangeMulty = (value: string | number | null, key: keyof PropertyTermsSendDto) => {
    if (isArray(values?.[key]) && values?.[key]?.includes(value)) {
      setValues((e) => ({ ...e, [key]: isArray(values?.[key]) ? values?.[key]?.filter((e) => e != value) : [] }));
    } else {
      setValues((e) => ({ ...e, [key]: isArray(values?.[key]) ? [...values?.[key], value] : [] }));
    }
  };

  return (
    <div
      id="homeParent"
      className="profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps(initPropData?.id)} value={9} />
      </div>

      <div className=" flex flex-col gap-2 w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">
          {_STRINGS.CANCELATIONS_TITLE}
        </p>
        <p className="text-xs md:text-sm">{_STRINGS.LOREM}</p>

        <div className="flex flex-col my-2 gap-3">
          <PropTermItem
            onSelect={() => {
              onChange("STRICT", "canceling_type");
            }}
            title={_STRINGS.STRICT_RULER}
            desc={_STRINGS.LOREM}
            isChecked={values?.canceling_type == "STRICT"}
          />
          <PropTermItem
            onSelect={() => {
              onChange("NORMAL", "canceling_type");
            }}
            title={_STRINGS.NORMAL_RULER}
            desc={_STRINGS.LOREM}
            isChecked={values?.canceling_type == "NORMAL"}
          />
          <PropTermItem
            onSelect={() => {
              onChange("EASY", "canceling_type");
            }}
            title={_STRINGS.EASY_RULER}
            desc={_STRINGS.LOREM}
            isChecked={values?.canceling_type == "EASY"}
          />
        </div>
      </div>
      <div className=" flex flex-col gap-2   w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">
          {_STRINGS.GUEST_TYPE_STATUS}
        </p>
        {propertyTypes?.["GUEST_TYPE"]?.map((e) => (
          <Checkbox
            key={`KITCHEN${e?.id}`}
            rounded="rounded-md"
            onSelect={() => {
              onChangeMulty(e?.id, "guest_type");
            }}
            isChecked={!!values?.guest_type?.includes(e?.id)}
            title={e?.title}
          />
        ))}
        <MultiLineFormInput
          item={{
            title: _STRINGS.MORE_DESC,
            containerClass: "w-full col-span-full",
            placeholder: _STRINGS.DESCRIPTION_DOTS,
            rows: 3,
          }}
          value={values?.guest_dscr || ""}
          onChangeText={(e) => {
            onChange(e, "guest_dscr");
          }}
        />
      </div>
      <div className=" flex flex-col gap-2   w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">{_STRINGS.ANIMAL_RULES}</p>
        {propertyTypes?.["PET"]?.map((e) => (
          <Checkbox
            key={`KITCHEN${e?.id}`}
            rounded="rounded-full"
            onSelect={() => {
              onChange(e?.id, "pet");
            }}
            isChecked={values?.pet == e?.id}
            title={e?.title}
          />
        ))}
        <MultiLineFormInput
          item={{
            title: _STRINGS.MORE_DESC,
            containerClass: "w-full col-span-full",
            placeholder: _STRINGS.DESCRIPTION_DOTS,
            rows: 3,
          }}
          value={values?.pet_dscr || ""}
          onChangeText={(e) => {
            onChange(e, "pet_dscr");
          }}
        />
      </div>
      <div className=" flex flex-col gap-2   w-full">
        <p className="font-bold w-full text-start  text-sm md:text-base text-primary-700  ">{_STRINGS.PARTY_RULES}</p>
        {propertyTypes?.["PARTY"]?.map((e) => (
          <Checkbox
            key={`KITCHEN${e?.id}`}
            rounded="rounded-full"
            onSelect={() => {
              onChange(e?.id, "party");
            }}
            isChecked={values?.party == e?.id}
            title={e?.title}
          />
        ))}
        <MultiLineFormInput
          item={{
            title: _STRINGS.MORE_DESC,
            containerClass: "w-full col-span-full",
            placeholder: _STRINGS.DESCRIPTION_DOTS,
            rows: 3,
          }}
          value={values?.party_dscr || ""}
          onChangeText={(e) => {
            onChange(e, "party_dscr");
          }}
        />
      </div>

      {/* TIME INPUT  */}

      <div className="flex w-full items-center gap-4 ">
        <div className="flex items-center gap-2 ">
          <p className="shrink-0">{_STRINGS.ENTER_HOUR} :</p>
          <FormInput
            item={{}}
            value={values?.check_in_hour || ""}
            onChangeText={(e) => {
              onChange(e, "check_in_hour");
            }}
          />
        </div>
        <div className="flex items-center gap-2 ">
          <p className="shrink-0">{_STRINGS.END_HOUR} :</p>
          <FormInput
            item={{}}
            value={values?.check_out_hour || ""}
            onChangeText={(e) => {
              onChange(e, "check_out_hour");
            }}
          />
        </div>
      </div>
      <MultiLineFormInput
        item={{
          title: _STRINGS.REQUIRED_DOCS,
          containerClass: "w-full col-span-full",
          rows: 3,
          placeholder: _STRINGS.DESCRIPTION_DOTS,
        }}
        value={values?.doc_dscr || ""}
        onChangeText={(e) => {
          onChange(e, "doc_dscr");
        }}
      />
      <MultiLineFormInput
        item={{
          title: _STRINGS.PROP_DESC,
          placeholder: _STRINGS.DESCRIPTION_DOTS,
          containerClass: "w-full col-span-full",
          rows: 3,
        }}
        value={values?.property_dscr || ""}
        onChangeText={(e) => {
          onChange(e, "property_dscr");
        }}
      />
      <MultiLineFormInput
        item={{
          title: _STRINGS.OTHER_DESC,
          placeholder: _STRINGS.DESCRIPTION_DOTS,
          containerClass: "w-full col-span-full",
          rows: 3,
        }}
        value={values?.other_dscr || ""}
        onChangeText={(e) => {
          onChange(e, "other_dscr");
        }}
      />

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={!!initPropData?.canceling_type ? _STRINGS.EDIT : _STRINGS.SUBMIT_PROPERTY}
        />
      </FixedBottomContainer>

      <SuccessAddModal
        show={showSucces}
        onHIde={() => {}}
        callBack={() => {
          router.push(`/profile/owner/properties/${property_id}/subscription`);
        }}
      />
    </div>
  );
};

export default CreatePropertyTerms;
