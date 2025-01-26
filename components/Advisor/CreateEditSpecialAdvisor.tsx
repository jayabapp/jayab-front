import { AuthService } from "@/api_services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SinglePopUpSelect from "../shared/Form/SingleSelectPopUpSelect";
import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import { CreateAdvisorDto } from "@/api_services/advisor/advisor.interface";
import { isArray, isEmpty } from "lodash";
import MultyPopUpSelect from "../shared/Form/MultiSelectPopUpSelect";
import FormInputWithExternalUnit from "../shared/Form/FormInputWithExternalUnit";
import MultiLineFormInput from "../shared/Form/MultiLineFormInput";
import MainUploader from "../uploader";
import FixedBottomContainer from "../shared/FixedBottomContainer";
import Button from "../shared/Button/Button";
import { CityService } from "@/api_services/city/city.service";

const CreateEditSpecialAdvisor = ({
  values,
  setValues,
}: {
  values: CreateAdvisorDto & {
    province: string | number | null;
    refral_code: string | number | null;
    profile_image: any;
    national_card_image: any;
    document_image: any;
  };
  setValues: React.Dispatch<
    React.SetStateAction<
      CreateAdvisorDto & {
        province: string | number | null;
        refral_code: string | number | null;
        profile_image: any;
        national_card_image: any;
        document_image: any;
      }
    >
  >;
}) => {
  const { data: provinces } = useQuery({
    queryFn: () => CityService.GetAllCities({ is_parent: "1" }),
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, "is_parent"],
  });

  const { data: cities } = useQuery({
    queryFn: () => {
      if (!!values?.province) return CityService.GetCities({ parentId: values?.province });
      else return [];
    },
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, values?.province],
  });

  const onChangeMulty = (value: { id: string | number }, key: keyof CreateAdvisorDto) => {
    if (isArray(values?.[key]) && values?.[key]?.map((e) => e?.id)?.includes(value?.id)) {
      setValues((e) => ({
        ...e,
        [key]: isArray(values?.[key]) ? values?.[key]?.filter((e) => e?.id != value?.id) : [],
      }));
    } else {
      setValues((e) => ({ ...e, [key]: isArray(values?.[key]) ? [...values?.[key], value] : [] }));
    }
  };

  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="w-full flex items-center  flex-col gap-3  md:gap-4 md:flex-row">
        <FormInput
          item={{ title: _STRINGS.FULL_NAME, isMandatory: true, containerClass: "w-full" }}
          value={values?.full_name || ""}
          onChangeText={(e) => {
            onChange(e, "full_name");
          }}
        />
        <FormInput
          item={{
            title: _STRINGS.NATIONAL_CODE,
            isMandatory: true,
            containerClass: "w-full",
            direction: "ltr",
            keyboard: "number",
            inputClass: "ltr text-left",
            maxLength: 10,
          }}
          value={values?.national_code || ""}
          onChangeText={(e) => {
            onChange(e, "national_code");
          }}
        />
      </div>
      <div className="w-full flex items-center  gap-3 ">
        <FormInput
          value={values?.tel || ""}
          onChangeText={(e) => {
            onChange(e, "tel");
          }}
          item={{
            title: _STRINGS.TELEPHONE_NUMBER,
            isMandatory: true,
            containerClass: " w-full md:w-1/2",
            direction: "ltr",
            inputClass: "ltr text-left",
            maxLength: 11,
            keyboard: "number",
          }}
        />
        {/* <FormInput
          value={values?.area_code || ""}
          onChangeText={(e) => {
            onChange(e, "area_code");
          }}
          item={{
            title: _STRINGS.CITY_CODE,
            isMandatory: true,
            containerClass: "w-full",
            direction: "ltr",
            inputClass: "ltr text-left",
            maxLength: 3,
          }}
        /> */}
      </div>
      <div className="w-full flex flex-col gap-3 items-start">
        {" "}
        <SinglePopUpSelect
          closeOnSelect
          item={{
            list: provinces || [],
            title: _STRINGS.PROVINCE,
            isMandatory: true,
            containerClass: " w-full md:w-1/2",
          }}
          value={values?.province || ""}
          onSelect={(e) => {
            onChange(e, "province");
          }}
        />
        <MultyPopUpSelect
          onSelect={(e) => {
            onChangeMulty(e, "cityIds");
          }}
          value={values?.cityIds}
          title={_STRINGS.SELECT_ACTIVE_CITIES}
          item={{ list: cities || [], full_item: true }}
        />
      </div>
      <MultiLineFormInput
        value={values?.address || ""}
        item={{
          containerClass: "w-full",
          rows: 3,
          title: _STRINGS.STATIONERY_PLACE,
          isMandatory: true,
        }}
        onChangeText={(e) => {
          onChange(e, "address");
        }}
      />

      <p className="w-full text-start  text-base md:text-lg font-medium">{_STRINGS.ADDRESS_DOCS_IMAGES} </p>
      <div
        className="w-full flex items-center justify-center
 flex-col"
      >
        <p className="w-full text-start  text-sm md:text-base">{_STRINGS.UPLOAD_RENTAL_DOC}*</p>

        <MainUploader
          title={_STRINGS.IMAGE}
          withCrop
          // isLogo
          link="/attachments?type=ADVISOR_DOCUMENT_IMAGE"
          key={`uploader`}
          innerClasses={{ sizeClass: "!bg-white  !border !border-dashed   w-24 h-24 !border-gray-300 " }}
          containerClass={"my-3  w-full flex items-start justify-start "}
          item={values?.document_image}
          onSelect={(file) => {
            onChange(file, "document_image");
          }}
          onDelete={() => {
            onChange(null, "document_image");
          }}
        />
      </div>
      <div
        className="w-full flex items-center justify-center
 flex-col"
      >
        <p className="w-full text-start text-sm md:text-base">{_STRINGS.NATIONAL_CARD_IMAGE}* </p>
        <MainUploader
          title={_STRINGS.IMAGE}
          withCrop
          // isLogo
          innerClasses={{ sizeClass: "!bg-white  !border !border-dashed   w-24 h-24 !border-gray-300 " }}
          link="/attachments?type=ADVISOR_NATIONAL_CARD_IMAGE"
          key={`uploader`}
          containerClass={"my-3  w-full flex items-start justify-start "}
          item={values?.national_card_image}
          onSelect={(file) => {
            onChange(file, "national_card_image");
          }}
          onDelete={() => {
            onChange(null, "national_card_image");
          }}
        />
      </div>
      <div
        className="w-full flex items-center justify-center
 flex-col"
      >
        <p className="w-full text-start text-sm md:text-base">{_STRINGS.YOUR_IMAGE} </p>

        <MainUploader
          title={_STRINGS.IMAGE}
          withCrop
          // isLogo
          link="/attachments?type=PROFILE"
          key={`uploader`}
          innerClasses={{ sizeClass: "!bg-white  !border !border-dashed   w-24 h-24 !border-gray-300 " }}
          containerClass={"my-3  !w-full flex items-start justify-start "}
          item={values?.profile_image}
          onSelect={(file) => {
            onChange(file, "profile_image");
          }}
          onDelete={() => {
            onChange(null, "profile_image");
          }}
        />
      </div>

      <FormInput
        item={{
          title: _STRINGS.REFRAL_CODE,
          isMandatory: true,
          containerClass: "w-full  md:w-1/2",
          direction: "ltr",
          inputClass: "ltr text-left",
          maxLength: 10,
        }}
        value={values?.refral_code || ""}
        onChangeText={(e) => {
          onChange(e, "refral_code");
        }}
      />
    </div>
  );
};

export default CreateEditSpecialAdvisor;
